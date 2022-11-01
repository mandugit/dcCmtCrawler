class CrawlerDAO {
    
    #connection;
    #namespace = 'crawler';

    constructor(conn) {
        this.#connection = conn;
    }
    
    async insError(param) {
        return await this.#connection.update(this.#namespace, 'insError', param);
    }

    async srchError(param) {
        return await this.#connection.selectList(this.#namespace, 'srchError', param);
    }
    
    async updErrorCmpltYn(param) {
        return await this.#connection.update(this.#namespace, 'updErrorCmpltYn', param);
    }   
    
    async getCurrId(param) {
        return await this.#connection.selectOne(this.#namespace, 'getCurrId', param);
    }
    
    async mrgCurrId(param) {
        return await this.#connection.update(this.#namespace, 'mrgCurrId', param);
    }  
    
    async delCurrId(param) {
        return await this.#connection.delete(this.#namespace, 'delCurrId', param);
    }  
    
    async insPage(param) {
        return await this.#connection.insert(this.#namespace, 'insPage', param);
    } 
    
    async mrgPage(param) {
        return await this.#connection.update(this.#namespace, 'mrgPage', param);
    }
    
    async delPage(param) {
        return await this.#connection.delete(this.#namespace, 'delPage', param);
    }
    
    async insCmt(param) {
        return await this.#connection.insert(this.#namespace, 'insCmt', param);
    }
    
    async mrgCmt(param) {
        return await this.#connection.update(this.#namespace, 'mrgCmt', param);
    }
    
    async delCmt(param) {
        return await this.#connection.delete(this.#namespace, 'delCmt', param);
    }    

    async delCmtAll(param) {
        return await this.#connection.delete(this.#namespace, 'delCmtAll', param);
    }        
}

module.exports = CrawlerDAO;