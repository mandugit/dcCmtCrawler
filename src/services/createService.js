const use = require('abrequire');
const createDAO = use('src/dao/createDAO.js');

class CreateService {

    #createDAO;

    constructor(conn) {
        this.#createDAO = new createDAO(conn);
    }
    
    async createTable() {
        try {
            await this.#createDAO.createErrorTable();
            await this.#createDAO.createPageTable();
            await this.#createDAO.createPageIdx();
            await this.#createDAO.createCmtTable();
            await this.#createDAO.createCmtIdx();
            await this.#createDAO.createCurrIdTable();
            await this.#createDAO.createCommCdTable();
        }
        catch(ex) {
            throw ex;
        }
    }

    async dropTable() {
        try {
            await this.#createDAO.dropErrorTable();
            await this.#createDAO.dropPageable();
            await this.#createDAO.dropCmtTable();
            await this.#createDAO.dropCurrIdTable();
            await this.#createDAO.dropCommCdTable();      
        }
        catch(ex) {
            throw ex;
        }
    }
}

module.exports = CreateService;