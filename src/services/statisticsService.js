const use = require('abrequire');
const CONST = use('config/const.js');
const statisticsDAO = use('src/dao/statisticsDAO.js');

class StatisticsService {
    #statisticsDAO;

    constructor(conn) {
        this.#statisticsDAO = new statisticsDAO(conn);
    }

    async srchCmtRank(param) {
        let result = await this.#statisticsDAO.srchCmtRank(param);

        let tot = 0;

        if(result.length > 0) {
            tot = result[0].TOT
        }
    
        return {
            "result" : result,
            "format" : `#{RANK}등 : #{WRITE_USER_NM} / 댓글수 : #{CNT} / 지분율 : #{RATE}`,
            "title" : `댓글랭킹`,
            "subTitle" : `전체 댓글수 : ${tot}`
        }        
    }

    async srchCmtBoardRplyRank(param) {
        let result = await this.#statisticsDAO.srchCmtBoardRplyRank(param);
        let tot = 0;
    
        if(result.length > 0) {
            tot = result[0].TOT
        }
    
        return {
            "result" : result,
            "format" : `#{RANK}등 : #{WRITE_USER_NM} / 달린 댓글수 : #{CNT} / 비율 : #{RATE}`,
            "title" : `댓글이 달린 랭킹(유동이 작성 한 게시글, 본인 댓글 제외)`,
            "subTitle" : `달린 댓글수 : ${tot}`
        }
    }

    async srchCmtImoticonRank(param) {
        let result = await this.#statisticsDAO.srchCmtImoticonRank(param);
        let tot = 0;

        if(result.length > 0) {
            tot = result[0].TOT
        }
    
        return {
            "result" : result,
            "format" : `#{RANK}등 : #{WRITE_USER_NM} / 건수 : #{CNT} / 비율 : #{RATE}`,
            "title" : `이모티콘 댓글 랭킹(유동제외)`,
            "subTitle" : `달린 이모티콘수 : ${tot}`
        }        
    }

    async srchCmtRankTypeList(param) {
        let result = await this.#statisticsDAO.srchCmtRankTypeList(param);
        return {
            "result" : result,
            "format" : `#{${param.type}} #{RANK}등 : #{WRITE_USER_NM} / 댓글수 : #{CNT}`,
            "title" : `${CONST.STTS_WORD[param.type]} 상위 ${param.rank}위 통계`,
            "subTitle" : null
        }        
    }

    async srchCmtRankStts(param) {
        let result = await this.#statisticsDAO.srchCmtRankStts(param);
        return {
            "result" : result,
            "format" : `#{${param.type}} : #{CNT}`,
            "title" : `${CONST.STTS_WORD[param.type]} 통계`,
            "subTitle" : null
        }     
    }    
}

module.exports = StatisticsService;