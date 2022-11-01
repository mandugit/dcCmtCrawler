const use = require('abrequire');
const crawlerDao = use('src/dao/crawlerDao.js');

class CrawlerService {

    #connection;
    #crawlerDao;

    constructor(conn) {
        this.#connection = conn;
        this.#crawlerDao = new crawlerDao(conn);
    }    

    async srchError(param) {
        try {
            return await this.#crawlerDao.srchError(param);
        }
        catch(ex) {
            throw ex;
        }
    }

    async insError(param) {
        let rtn = 0;
        try {
            rtn += await this.#crawlerDao.insError(param);
        }
        catch(ex) {
            throw ex;
        }
        return rtn;
    }

    async updErrorCmpltYn(param) {
        let rtn = 0;
        try {
            rtn = await this.#crawlerDao.updErrorCmpltYn(param);
        }
        catch(ex) {
            throw ex;
        }
        return rtn;
    }
    
    async getCurrId(param) {
        try {
            return await this.#crawlerDao.getCurrId(param);
        }
        catch(ex) {
            throw ex;
        }
    }

    async mrgCurrId(param) {
        let rtn = 0;
        try {
            rtn = await this.#crawlerDao.mrgCurrId(param);
        }
        catch(ex) {
            throw ex;
        }
        return rtn;
    }

    async delCurrId(param) {
        let rtn = 0;
        try {
            rtn += await this.#crawlerDao.delCurrId(param);
        }
        catch(ex) {
            throw ex;
        }
        return rtn;
    }

    async delPage(param) {
        let rtn = 0;
        try {
            await this.#connection.transStart();

            rtn += await this.#crawlerDao.delCmtAll(param);
            rtn += await this.#crawlerDao.delPage(param);

            await this.#connection.commit();
        }
        catch(ex) {
            this.#connection.rollback();
            throw ex;
        }
        return rtn;
    }

    async insPage(page, cmtList) {
        let rtn = 0;
        try {
            await this.#connection.transStart();

            rtn += await this.#crawlerDao.mrgPage(page);

            for(let i=0; i<cmtList.length; i++) {
                rtn += await this.#crawlerDao.mrgCmt(cmtList[i]);
            }

            await this.#connection.commit();
        }
        catch(ex) {
            this.#connection.rollback();
            throw ex;
        }
        return rtn;
    }    
}

module.exports = CrawlerService;