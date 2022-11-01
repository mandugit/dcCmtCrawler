const use = require('abrequire');
const path = require('path');
const CONST = use('config/const.js');
const util = use('src/lib/util.js');
const sdf = require('date-and-time');
const StatisticsService = use('src/services/statisticsService.js');

const fs = require('fs');

class StatisticsModule {

    #statisticsService;
    #gallId;
    #DBConn;
    #YYYYMM;
    #rankCnt = 3;
    #resultFilePath = path.join(process.cwd(), 'result');
    #limitCnt = 200;

    constructor(id) {
        this.#gallId = id;
        this.#DBConn = use('src/db/connection.js');
        this.#DBConn.setDebug(true);
        this.#statisticsService = new StatisticsService(this.#DBConn);
    }

    set YYYYMM(yyyymm) {
        this.#YYYYMM = yyyymm;
    }

    set resultFilePath(path) {
        this.#resultFilePath = path;
    } 
    
    set limitCnt(limitCnt) {
        this.#limitCnt = limitCnt;
    }

    set rankCnt(rankCnt) {
        this.#rankCnt = rankCnt;
    }

    #formatStrChange(sql, param) {
        let regExp = null;
        let rtn = sql;
    
        for (const [key, value] of Object.entries(param)) {
            regExp = new RegExp(`#{${key}}`, 'gi');

            if(value === null) {
                rtn = rtn.replace(regExp, '');
            }
            else {
                rtn = rtn.replace(regExp, `${value}`);
            }
        }
        
        return rtn;
    }

    async #exportStts(obj) {
        let resultDate = sdf.format(new Date(), 'YYYYMMDDHHmmss');
        let txtData = '';
    
        txtData += obj.title;
        txtData += '\n';
        
        if(obj.subTitle !== null) {
            txtData += obj.subTitle;
            txtData += '\n';
        }
    
        let arr = obj.result;
        for(let i=0; i<arr.length; i++) {
            txtData += this.#formatStrChange(obj.format, arr[i]);
            txtData += '\n';
        }
    
        if(!fs.existsSync(path.join(this.#resultFilePath, this.#YYYYMM))) {
            fs.mkdirSync(path.join(this.#resultFilePath, this.#YYYYMM));
        }
    
        fs.writeFile(`${path.join(this.#resultFilePath, this.#YYYYMM)}${path.sep}${obj.title}_${resultDate}.txt`, txtData, 'utf8', function(err) {});
    }

    async run() {
        console.log('statisticsModule run!!!');

        //DB OPEN
        await this.#DBConn.open(CONST.DB_PATH, CONST.QUERY_PATH);

        let betweeDate = util.getBetweenDate(this.#YYYYMM);

        let param = {
            'limitCnt' : this.#limitCnt,
            'gallId' : this.#gallId,
            'startDate' : betweeDate.startDate,
            'endDate' : betweeDate.endDate
        }

        await this.#exportStts(await this.#statisticsService.srchCmtRank(param));
        await this.#exportStts(await this.#statisticsService.srchCmtBoardRplyRank(param));
        await this.#exportStts(await this.#statisticsService.srchCmtImoticonRank(param));
    
        let param2 = {
            'startDate' : betweeDate.startDate,
            'endDate' : betweeDate.endDate,
            'rank' : this.#rankCnt,
            'type' : '',
            'format' : '',
            'gallId' : this.#gallId,
            'limitCnt' : 3
        }    
    
        param2.type = CONST.STTS_TYPE.HOUR;
        param2.format = CONST.STTS_DB_TYPE.HOUR;
        await this.#exportStts(await this.#statisticsService.srchCmtRankTypeList(param2));
        await this.#exportStts(await this.#statisticsService.srchCmtRankStts(param2));

        param2.type = CONST.STTS_TYPE.WEEK;
        param2.format = CONST.STTS_DB_TYPE.WEEK;
        await this.#exportStts(await this.#statisticsService.srchCmtRankTypeList(param2));
        await this.#exportStts(await this.#statisticsService.srchCmtRankStts(param2));

        param2.type = CONST.STTS_TYPE.DATE;
        param2.format = CONST.STTS_DB_TYPE.DATE;
        await this.#exportStts(await this.#statisticsService.srchCmtRankTypeList(param2));
        await this.#exportStts(await this.#statisticsService.srchCmtRankStts(param2));
        
        //DB CLOSE
        await this.#DBConn.close();

        console.log('statisticsModule run end!!!');        
    }
}

module.exports = StatisticsModule;