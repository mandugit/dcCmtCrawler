function delay(timeToDelay) {
    return new Promise(function(resolve) {
        setTimeout(resolve, timeToDelay);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function empty2Null(obj) {
    let rtn = null;
    if(obj !== "" || typeof(obj) == 'number') {
        rtn = obj;
    }
    return rtn;
}

function replaceParam(str) {
    let rtn = str;
    if(arguments.length > 1) {
        for(let i=1; i<arguments.length; i++) {
            rtn = rtn.replace(`{${i}}`, arguments[i]);
        }
    }

    return rtn;
}

function getBetweenDate(YYYYMM) {
    const sdf = require('date-and-time');
    let tmpStr = YYYYMM.substr(0, 4) + '-' + YYYYMM.substr(4, 2) + '-' + '01' + ' 00:00:00'
    let tmpDate = new Date(tmpStr);
    let startDate = sdf.format(tmpDate, 'YYYY-MM-DD HH:mm:ss');

    tmpDate = new Date(tmpDate.setMonth(tmpDate.getMonth() + 1));
    tmpDate = new Date(tmpDate.setSeconds(-1));

    let endDate = sdf.format(tmpDate, 'YYYY-MM-DD HH:mm:ss');

    return {
        startDate, endDate
    }
}

module.exports = {
    'delay' : delay,
    'getRandomInt' : getRandomInt,
    'empty2Null' : empty2Null,
    'replaceParam' : replaceParam,
    'getBetweenDate' : getBetweenDate
}