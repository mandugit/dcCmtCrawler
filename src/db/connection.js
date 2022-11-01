const use = require('abrequire');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const mybatisMapper = require('mybatis-mapper');
const CONSTS = use('config/const.js');
const DBError = use('src/exception/dbError.js');

let DBConn = 
(
    function () {
        let connection = null;
        let transYn = false;
        let debugYn = false;

        function getConnection() {
            return connection;
        } 

        function isConnected() {
            return connection !== null;
        }

        function isTrans() {
            return transYn;
        }

        function setDebug(d) {
            debugYn = d;
        }

        async function on(path, mapper) {
            connection = await open({
                filename: path,
                driver: sqlite3.Database
            });  

            //mybatis open
            if(mapper !== undefined) {
                if(Array.isArray(mapper)) {
                    mybatisMapper.createMapper(mapper);
                }
                else {
                    mybatisMapper.createMapper([mapper]);
                }
            }
            else {
                throw new DBError('mapper is required');          
            }
        }

        async function close() {
            if(!isConnected()) {
                throw new DBError('db not connected');
            }            

            await connection.close();
            connection = null;
        }

        async function runQueryByXml(namespace, id, param, type) {
            let rtn = null;

            if(!isConnected()) {
                throw new DBError('db not connected');
            }            

            if(id === undefined) {
                throw new DBError('id is required');
            }

            if(namespace === undefined) {
                throw new DBError('namespace is required');
            }

            let _param = typeof(param) === 'undefined' ? {} : param;
            let query = mybatisMapper.getStatement(namespace, id, _param);
            if(debugYn) {
                console.log(`query id : ${namespace}.${id}`);
                console.log(query);
                console.log(_param);
            }

            try {
                if(type == CONSTS.RUN_TYPE.GET) {
                    rtn = await connection.get(query);
                }
                else if(type == CONSTS.RUN_TYPE.ALL) {
                    rtn = await connection.all(query);
                }
                else if(type == CONSTS.RUN_TYPE.RUN) {
                    rtn = await connection.run(query);
                }
            }
            catch(ex) {
                console.error(ex);
                throw new DBError(ex.message);
            }

            return rtn;
        }

        async function runQuery(query) {
            if(!isConnected()) {
                throw new DBError('db not connected');
            }
            
            if(debugYn) {
                console.log(query);
            }  

            try {
                return await connection.run(query);
            }
            catch(ex) {
                console.error(ex);
                throw new DBError(ex.message);
            }
        }

        async function selOne(namespace, id, param) {
            return await runQueryByXml(namespace, id, param, CONSTS.RUN_TYPE.GET);
        }

        async function selList(namespace, id, param) {
            return await runQueryByXml(namespace, id, param, CONSTS.RUN_TYPE.ALL);
        }   
        
        async function ins(namespace, id, param) {
            return await runQueryByXml(namespace, id, param, CONSTS.RUN_TYPE.RUN);
        }           

        async function upd(namespace, id, param) {
            return await runQueryByXml(namespace, id, param, CONSTS.RUN_TYPE.RUN);
        }      
        
        async function del(namespace, id, param) {
            return await runQueryByXml(namespace, id, param, CONSTS.RUN_TYPE.RUN);
        }  
        
        async function runDDL(query) {
            return await runQuery(query);
        }    

        async function transStart() {
            let tmp = await runQuery('BEGIN;');
            transYn = true;
            return tmp;
        }

        async function commit() {
            let tmp = await runQuery('COMMIT;');
            transYn = false;
            return tmp;
        }

        async function rollback() {
            let tmp = await runQuery('ROLLBACK;');
            transYn = false;
            return tmp;
        }        

        return {
            "getConnection" : getConnection,
            "open" : on,
            "close" : close,
            "isConn" : isConnected,
            "isTrans" : isTrans,
            "setDebug" : setDebug,
            "selectOne" : selOne,
            "selectList" : selList,
            "insert" : ins,
            "update" : upd,
            "delete" : del,
            "runDDL" : runDDL,
            "transStart" : transStart,
            "commit" : commit,
            "rollback" : rollback
        }
    }
)();

module.exports = DBConn;