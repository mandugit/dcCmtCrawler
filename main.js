const use = require('abrequire');
const CONST = use('config/const.js');
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const commentCrawler = use('src/routes/commentCrawler.js');
const CrawlerModule = use('src/module/crawlerModule.js');
const StatisticsModule = use('src/module/statisticsModule.js');


async function main() {
    // //정적파일 로드
    // app.use(express.static(__dirname + "/webapps"));    

    // //view에서 요청하는 내용 처리
    // app.use('/comment', commentCrawler);

    // http.listen(CONST.SERVER_PORT, function () {
    //     console.log("SERVER START!!");
    // });

    // let crawler = new CrawlerModule('sdvx', CONST.GALL_GUBUN.MAGER);
    // crawler.setDebug(true);
    // crawler.run();
    
    let stts = new StatisticsModule('sdvx');
    stts.YYYYMM = '202210';
    stts.run();
}

main();