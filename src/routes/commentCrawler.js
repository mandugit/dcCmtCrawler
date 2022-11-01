const use = require('abrequire');
const express = require('express');
const CONST = use('config/const.js');
const crawlerModule = use('src/module/crawlerModule.js');
const router = express.Router();

let CrawlerModule = new crawlerModule('');

router.get('/setGallId', (req, res) => {
    if(req.query?.gallId !== undefined) {
        CrawlerModule.setGallId(req.query.gallId);
    }
    res.send('success');
});

router.get('/setGallGubun', (req, res) => {
    if(req.query?.gallGubun !== undefined) {
        CrawlerModule.setGallGubun(req.query.gallGubun);
    }
    res.send('success');
});

router.get('/setDebug', (req, res) => {
    if(req.query?.debug !== undefined) {
        CrawlerModule.setDebug(req.query.debug);
    }
    res.send('success');
});

router.get('/runCrawler', (req, res) => {
    CrawlerModule.run();
    res.send('success');
});

router.get('/stopCrawler', (req, res) => {
    CrawlerModule.stop();
    res.send('success');
});

router.get('/setGallCurrId', (req, res) => {
    if(req.query?.gallCurrId !== undefined) {
        CrawlerModule.setDebug(req.query.debug);
    }    
    res.send('success');
});

router.get('/getGallCurrId', (req, res) => {
    res.send('success');
});
  
module.exports = router;