const use = require('abrequire');
const CONST = use('config/const.js');
const util = use('src/lib/util.js');
const axios = require("axios");
const cheerio = require("cheerio");
const sdf = require('date-and-time');
const qs = require('qs');
const ConnException = use('src/exception/connError');
const CrawlerService = use('src/services/crawlerService.js');
const CreateService = use('src/services/createService.js');

class CrawlerModule {

    #DBConn;
    #crawlerService;
    #createService;
    #gallId = '';
    #gallGubun = '';
    #debug = false;
    #currId = 0;
    #stopFlag = false;

    constructor(id, gubun) {
        this.#gallId = id;
        this.#gallGubun = gubun;
        this.#DBConn = use('src/db/connection.js');
        this.#crawlerService = new CrawlerService(this.#DBConn);
        this.#createService = new CreateService(this.#DBConn);
    }

    setGallId(id) {
        this.#gallId = id;
        console.log(`gallId >>> ${id}`);
    }

    setGallGubun(gubun) {
        this.#gallGubun = gubun;
    }

    setDebug(debug) {
        this.#debug = debug;
    }

    async setGallCurrId(curId) {
        if(this.#gallId == '') return;
        await this.#crawlerService.mrgCurrId({'GALL_ID': this.#gallId, 'BOARD_ID' : curId});
    }

    async getGallCurrId() {
        if(this.#gallId == '') return;
        await this.#crawlerService.getCurrId({'GALL_ID': this.#gallId});
    }

    getCurrId() {
        return this.#currId;
    }

    async #dbClose() {
        if(this.#DBConn.isConn()) {
            if(this.#currId != 0) {
                await this.#crawlerService.mrgCurrId({'GALL_ID': this.#gallId, 'BOARD_ID' : this.#currId});
            }
            await this.#DBConn.close();
        }
    }

    #exitEvent() {
        process.on('beforeExit', async (code) => {
            console.log('beforeExit', code);
            await this.#dbClose();
        });

        process.on('exit', async (code) => {
            console.log('exit', code); 
        });
        
        //해당 이벤트를 등록해야 EXIT(0) 처럼 동작함
        process.on('uncaughtException', (err) => {
            console.log('uncaughtException');
            console.error(err);
        });    

        process.on('SIGINT', async (err) => {
            console.log('SIGINT');

            //CTRL + C의 경우 beforeExit 호출하지 않음
            await this.#dbClose();
            process.exit(0);
        });        
    }
 
    async #getMaxPageId() {
        let instance = axios.create({timeout: CONST.TIMEOUT});
        let response = null;
        let url = CONST.DC_URL;

        switch(this.#gallGubun) {
            case CONST.GALL_GUBUN.MAGER :
                url += util.replaceParam(CONST.MAGER_BOARD_QS, this.#gallId, '1');
                break;
            case CONST.GALL_GUBUN.MINER :
                url += util.replaceParam(CONST.MINER_BOARD_QS, this.#gallId, '1');
                break;
        }

        for(let i=0; i<=CONST.TRY_CNT; i++) {
            try {
                response = await instance({
                    url: url,
                    method: 'get',
                    headers: {
                        'User-Agent' : CONST.USER_AGENT[util.getRandomInt(0, CONST.USER_AGENT.length)]
                    }
                });
    
                if(response !== null) {
                    break;
                }
            }
            catch(ex) {
                if(ex.response?.status == '404') {
                    console.log(`getMaxPageId 404 ERROR!!`);
                    response = null;
                    break;                 
                }

                if(i == CONST.TRY_CNT) {
                    response = null;
                }
                else {
                    if(this.#debug) console.log(`getMaxPageId Error / NOT 404 ERROR / TRY_CNT : ${i + 1}`);
                    response = null;
                    await util.delay(CONST.DELAY_NUM);
                    continue;
                }
            }
        }
        
        if(response !== null) {
            let $ = cheerio.load(response.data);
            let list = $('table.gall_list tbody').children();
            let rtn = '';
            list.each(function(idx, item) {
                let id = $(item).children('.gall_num').text();
                if(/[0-9]/gi.test(id)) {
                    rtn = id;
                    return false;
                }
            });

            return rtn;
        }
        else {
            throw new ConnException('not connected');
        }
    }

    /**
     * rtn code
     *  200 : 성공
     *  404 : 404 not found
     *  500 : connection error
     */
    async #getPage(no) {
        let instance = axios.create({timeout: CONST.TIMEOUT});
        let response = null;
        let rtn = {
            'cntnt' : {
                "GALL_ID" : this.#gallId,
                "BOARD_ID" : no,
                "WRITE_DT" : '',
                "WRITE_USER_ID" : '',
                "WRITE_USER_NM" : '',
                "WRITE_USER_IP" : '',
                "PAGE_CNTNT" : null
            }
            ,'code' : ''
            ,'msg' : ''
            ,'e_s_n_o' : ''
            ,'cookie' : ''
            ,'write_user_id' : ''
        };      
        
        let url = CONST.DC_URL;

        switch(this.#gallGubun) {
            case CONST.GALL_GUBUN.MAGER :
                url += util.replaceParam(CONST.MAGER_PAGE_QS, this.#gallId, no);
                break;
            case CONST.GALL_GUBUN.MINER :
                url += util.replaceParam(CONST.MINER_PAGE_QS, this.#gallId, no);
                break;
        }        
    
        for(let i=0; i<=CONST.TRY_CNT; i++) {
            try {
                response = await instance({
                    url: url,
                    method: 'get',
                    headers: {
                        'User-Agent' : CONST.USER_AGENT[util.getRandomInt(0, CONST.USER_AGENT.length)]
                    }
                });   
    
                if(response !== null) {
                    break;
                }
            }
            catch(ex) {
                if(ex.response?.status == '404') {
                    console.log(`${no} -> 404 ERROR`);
                    response = null;
                    rtn.code = '404';
                    rtn.msg = '404 ERROR';
                    break;                 
                }

                if(i == CONST.TRY_CNT) {
                    response = null;
                    rtn.code = '500';
                    rtn.msg = 'NOT 404 ERROR';
                }
                else {
                    if(this.#debug) console.log(`getPage Error / ${no} / NOT 404 ERROR / TRY_CNT : ${i + 1}`);
                    response = null;
                    await util.delay(CONST.DELAY_NUM);
                    continue;
                }
            }
        }

        if(response !== null) {
            if(response.data == '') {
                rtn.result = 'fail';
                rtn.msg = 'empty data';
                return rtn;
            }
            
            if(response.data.indexOf(CONST.ADULT_DATA) == 0) {
                rtn.result = 'fail';
                rtn.msg = 'adult page';
                return rtn;
            }

            let $ = cheerio.load(response.data);
            let e_s_n_o = $('#e_s_n_o').val();
            let $writeUserInfo = $('.gallview_head.clear.ub-content').find('.gall_writer.ub-writer');

            rtn.cntnt.WRITE_DT = sdf.format(new Date($('.gall_writer.ub-writer').find('.gall_date').text()), 'YYYY-MM-DD HH:mm:ss');
            rtn.cntnt.WRITE_USER_ID = util.empty2Null($writeUserInfo.data('uid'));
            rtn.cntnt.WRITE_USER_NM = util.empty2Null($writeUserInfo.data('nick'));
            rtn.cntnt.WRITE_USER_IP = util.empty2Null($writeUserInfo.data('ip'));
            rtn.e_s_n_o = e_s_n_o;
            rtn.write_user_id = util.empty2Null($writeUserInfo.data('uid'));
            rtn.cookie = response.headers['set-cookie'];
            rtn.code = '200';
        }

        return rtn;
    }

    async #getComment(cookie, no, e_s_n_o, page) {
        let rtn = {
            'res' : null
            ,'code' : ''
            ,'msg' : ''
        }

        let sendData = {
            id: this.#gallId,
            no: no,
            cmt_id: this.#gallId,
            cmt_no: no,
            e_s_n_o: e_s_n_o,
            comment_page: page
        };
    
        let instance = axios.create({timeout: CONST.TIMEOUT});
        let response = null;
    
        for(let i=0; i<=CONST.TRY_CNT; i++) {
            try {
                response = await instance({
                    url: CONST.DC_URL + CONST.COMMENT_URL,
                    method: 'post',
                    headers: {
                        'set-cookie' : cookie,
                        'User-Agent' : CONST.USER_AGENT[util.getRandomInt(0, CONST.USER_AGENT.length)],
                        'X-Requested-With' : 'XMLHttpRequest',
                        'Content-Type': 'application/x-www-form-urlencoded'                
                    },
                    data: qs.stringify(sendData)
                });
    
                if(response !== null) {
                    break;
                }
            }
            catch(ex) {
                if(i == CONST.TRY_CNT) {
                    response = null;
                    rtn.code = '500';
                    rtn.msg = 'NOT 404 ERROR';
                }
                else {
                    if(this.#debug) console.log(`getComment Error / ${no} / NOT 404 ERROR / TRY_CNT : ${i + 1}`);
                    response = null;
                    await util.delay(CONST.DELAY_NUM);
                    continue;
                }                
            }
        }
        
        if(response !== null) {
            rtn.res = response.data;
            rtn.code = '200';
        }

        return rtn;
    }

    #getCmtCnt(cmt) {
        let cnt = 0;
        for(let i=0; i<cmt.length; i++) {
            if(cmt[i].nicktype == CONST.BOT_ID) {
                //댓글돌이
                continue;
            }
            else if(cmt[i].is_delete == "1") {
                //삭제된댓글(삭제된댓글도 댓글수에 포함되므로 cnt더함)
                cnt++; 
                continue;
            }
            else {
                cnt++;
            }
        }
    
        return cnt;
    }    

    async #getCommentList(cookie, no, e_s_n_o) {
        let rtn = {
            'cntnt' : []
            ,'code' : ''
            ,'msg' : ''
        };

        let curPaging = 0;
        let curCnt = 0;        
        let totCnt = 0;
        let cmtArr = [];

        while(true) {
            curPaging++;
            let cmtInfo = await this.#getComment(cookie, no, e_s_n_o, curPaging);

            if(cmtInfo.code == '200') {
                if(cmtInfo.res.comments == null) {
                    break;
                }

                totCnt = Number(cmtInfo.res.total_cnt);
                if(totCnt == 0) {
                    break;
                }
                
                cmtArr = cmtArr.concat(cmtInfo.res.comments);
                curCnt += this.#getCmtCnt(cmtInfo.res.comments);                         
                
                if(curCnt == totCnt) {
                    break;
                }                
            }
            else {
                cmtArr = [];
                rtn.code = cmtInfo.code;
                rtn.msg = cmtInfo.msg;
                break;
            }
        }

        if(cmtArr.length > 0) {
            rtn.cntnt = cmtArr;
        }

        return rtn;
    }

    async #cmtProcess(cmt, userId) {
        let rtn = [];
        let nowDate = new Date();
    
        for(let i=0; i<cmt.length; i++) {
            if(cmt[i].nicktype == CONST.BOT_ID) {
                //댓글돌이
                continue;
            }
            else {
                let reg_date = cmt[i].reg_date;
                if(reg_date.length == 14) {
                    reg_date = nowDate.getFullYear() + '.' + reg_date;
                }
    
                let emoticonYn = false;
                if(cmt[i].memo.indexOf('<img class=') > -1 || cmt[i].memo.indexOf('<video class=') > -1) {
                    emoticonYn = true;
                }        
                
                let selfYn = false;
                if(userId !== '' && userId == cmt[i].user_id) {
                    selfYn = true;
                }
    
                let param = {
                    "GALL_ID" : this.#gallId,
                    "BOARD_ID" : cmt[i].parent,
                    "CMT_ID" : cmt[i].no,
                    "WRITE_DT" : sdf.format(new Date(reg_date), 'YYYY-MM-DD HH:mm:ss'),
                    "WRITE_USER_ID" : util.empty2Null(cmt[i].user_id),
                    "WRITE_USER_NM" : util.empty2Null(cmt[i].name),
                    "WRITE_USER_IP" : util.empty2Null(cmt[i].ip),
                    "SELF_YN" : selfYn ? 'Y' : 'N',
                    "EMOTICON_YN" : emoticonYn ? 'Y' : 'N',
                    "DEL_YN" : cmt[i].is_delete == "1" ? "Y" : "N",
                    "CMT_CNTNT" : emoticonYn ? 'EMOTICON' : cmt[i].memo
                }
    
                rtn.push(param);
            }
        }
    
        return rtn;
    }    

    async run() { 
        console.log('CrawlerModule run!!!');

        this.#exitEvent();

        //STOP FLAG 설정
        this.#stopFlag = false;

        //DB OPEN
        await this.#DBConn.open(CONST.DB_PATH, CONST.QUERY_PATH);

        //테이블 생성(없으면)
        await this.#createService.createTable();

        let startId = (await this.#crawlerService.getCurrId({'GALL_ID': this.#gallId})).BOARD_ID;
        let endId = await this.#getMaxPageId();

        startId = Number(startId);
        endId = Number(endId);

        for(let i=startId; i<=endId; i++) {
            if(this.#stopFlag) {
                break;
            }

            this.#currId = i;
            if(this.#debug) console.log("current : " + this.#currId);

            //게시글정보
            let pageInfo = await this.#getPage(this.#currId);
 
            if(pageInfo.code == '200') {
                let cmtArr = await this.#getCommentList(pageInfo.cookie, this.#currId, pageInfo.e_s_n_o);
                cmtArr = await this.#cmtProcess(cmtArr.cntnt, pageInfo.write_user_id);

                await this.#crawlerService.insPage(pageInfo.cntnt, cmtArr); 
            }
            else {
                if(pageInfo.code == '404') {
                    //404일경우 삭제
                    await this.#crawlerService.delPage({'GALL_ID': this.#gallId, 'BOARD_ID' : this.#currId}); 
                }

                if(pageInfo.code == '500') {
                    //에러페이지 기록 후 처리
                    let errorParam = {
                        "GALL_ID" : this.#gallId,
                        "BOARD_ID" : this.#currId,
                        "ERR_TYPE" : "PAGE_ERROR",
                        "ERR_CNTNT" : pageInfo.msg                    
                    }
    
                    await this.#crawlerService.insError(errorParam); 
                }
            }

            //마지막 게시글ID UPDATE
            await this.#crawlerService.mrgCurrId({'GALL_ID': this.#gallId, 'BOARD_ID' : this.#currId});

            //연속 request 방지를 위한 delay 설정
            await util.delay(CONST.DELAY_NUM);
        }
        
        //에러처리
        let errorList = [];
        if(!this.#stopFlag) {
            errorList = await this.#crawlerService.srchError({'GALL_ID': this.#gallId, 'CMPLT_YN' : 'N'});
        }

        for(let i=0; i<errorList.length; i++) {
            if(this.#stopFlag) break;

            let errorId = errorList[i].ERROR_ID;
            if(this.#debug) console.log("error id : " + errorId);

            //게시글정보
            let pageInfo = await this.#getPage(errorId);
 
            if(pageInfo.code == '200') {
                let cmtArr = await this.#getCommentList(pageInfo.cookie, errorId, pageInfo.e_s_n_o);
                cmtArr = await this.#cmtProcess(cmtArr.cntnt, pageInfo.write_user_id);

                await this.#crawlerService.insPage(pageInfo.cntnt, cmtArr); 

                //ERROR처리완료
                await this.#crawlerService.updErrorCmpltYn({'CMPLT_YN': 'Y', 'ERROR_ID' : errorId});
            }

            await util.delay(CONST.DELAY_NUM);            
        }

        //DB connection 닫기
        await this.#DBConn.close();

        console.log('CrawlerModule run end!!!');
    }

    async stop() {
        this.#stopFlag = true;
    }
}

module.exports = CrawlerModule;