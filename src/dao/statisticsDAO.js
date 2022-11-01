class StatisticsDAO {
    #connection;
    #namespace = 'statistics';

    constructor(conn) {
        this.#connection = conn;
    }

    async srchCmtRank(param) {
        return await this.#connection.selectList(this.#namespace, 'srchCmtRank', param);
    }
    
    async srchCmtBoardRplyRank(param) {
        return await this.#connection.selectList(this.#namespace, 'srchCmtBoardRplyRank', param);
    }  
    
    async srchCmtImoticonRank(param) {
        return await this.#connection.selectList(this.#namespace, 'srchCmtImoticonRank', param);
    }
    
    async srchCmtRankTypeList(param) {
        return await this.#connection.selectList(this.#namespace, 'srchCmtRankTypeList', param);
    }
    
    async srchCmtRankStts(param) {
        return await this.#connection.selectList(this.#namespace, 'srchCmtRankStts', param);
    }    
}

module.exports = StatisticsDAO;