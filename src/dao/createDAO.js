class CreateDAO {

    #namespace = 'create';
    #connection;

    constructor(conn) {
        this.#connection = conn;
    }

    async createErrorTable() {
        return await this.#connection.update(this.#namespace, 'createErrorTable');
    }

    async createPageTable() {
        return await this.#connection.update(this.#namespace, 'createPageTable');
    }
    
    async createPageIdx() {
        return await this.#connection.update(this.#namespace, 'createPageIdx');
    }
    
    async createCmtTable() {
        return await this.#connection.update(this.#namespace, 'createCmtTable');
    }
    
    async createCmtIdx() {
        return await this.#connection.update(this.#namespace, 'createCmtIdx');
    }
    
    async createCurrIdTable() {
        return await this.#connection.update(this.#namespace, 'createCurrIdTable');
    }  
    
    async createCommCdTable() {
        return await this.#connection.update(this.#namespace, 'createCommCdTable');
    }

    async dropErrorTable() {
        return await this.#connection.update(this.#namespace, 'dropErrorTable');
    }    

    async dropPageable() {
        return await this.#connection.update(this.#namespace, 'dropPageable');
    }    
    
    async dropCmtTable() {
        return await this.#connection.update(this.#namespace, 'dropCmtTable');
    }    
    
    async dropCurrIdTable() {
        return await this.#connection.update(this.#namespace, 'dropCurrIdTable');
    }
    
    async dropCommCdTable() {
        return await this.#connection.update(this.#namespace, 'dropCommCdTable');
    }
}

module.exports = CreateDAO;