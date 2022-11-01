const path = require('path');
const CONSTS = {};

function define(name, value) {
    Object.defineProperty(CONSTS, name, {
        value: value,
        enumerable : true,
    });
}

const baseDir = process.cwd();
const dbPath = path.join(baseDir, 'src', 'db') + path.sep;
const queryPath = path.join(baseDir, 'src', 'db', 'query') + path.sep;

define("RUN_TYPE", {"GET": "G", "ALL":"A", "RUN":"R"});
define("DB_PATH", `${dbPath}comment.db`);
define("QUERY_PATH", [`${queryPath}crawler.xml`, `${queryPath}create.xml`, `${queryPath}statistics.xml`]);
define("USER_AGENT", [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Edg/96.0.1054.43',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.62',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.56',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36 Edg/94.0.992.38',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586'
]);
define("BOT_ID", 'COMMENT_BOY');
define("DELAY_NUM", 650);
define("TRY_CNT", 5);
define("DC_URL", 'https://gall.dcinside.com/');
define("MAGER_BOARD_QS", 'board/lists/?id={1}&page={2}&_dcbest=1');
define("MINER_BOARD_QS", 'mgallery/board/lists/?id={1}&page={2}&_dcbest=1');
define("MAGER_PAGE_QS", 'board/view/?id={1}&no={2}&page=1');
define("MINER_PAGE_QS", 'mgallery/board/view/?id={1}&no={2}&page=1');
define("COMMENT_URL", 'board/comment/');
define("GALL_GUBUN", {MAGER : 'MAGER', MINER : 'MINER'});
define("STTS_TYPE", {DATE : 'DATE', HOUR : 'HOUR', WEEK : 'WEEK'});
define("STTS_DB_TYPE", {DATE : '%d', HOUR : '%H', WEEK : '%w'});
define("STTS_WORD", {DATE : '일자별', HOUR : '시간별', WEEK : '요일별'});
define("TIMEOUT", 3000);
define("SERVER_PORT", '8080');
define("ADULT_DATA", `<script type="text/javascript">location.replace("/error/adult/?s_url=`);

module.exports = CONSTS;