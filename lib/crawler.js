let rq = require('request-promise');
let cheerio = require('cheerio');
let jschardet = require('jschardet');
let iconvLite = require('iconv-lite');

let options = {
    uri: 'http://www.juzimi.com/',
    transform: function(body){
        // console.log(getEncoding(body));
        return cheerio.load(getEncoding(body));
    }
}

rq(options).then(function($){
    console.log($('#navbar ul li').text())
}).catch(function(err){
    console.log('请求出错:', err);
})

/**
 * 转换编码格式，预防中文乱码现象
 * @param {String} body 请求响应的主体
 */
function getEncoding(body){
    let detected = jschardet.detect(body)
    if (detected && detected.encoding) {
        console.log(detected.encoding)
        // if (debug) {
        //     console.log(
        //         'Detected charset ' + detected.encoding +
        //         ' (' + Math.floor(detected.confidence * 100) + '% confidence)'
        //     );
        // }
        if (detected.encoding !== 'utf-8' && detected.encoding !== 'ascii') {
            body = detected.encoding === 'windows-1252' ? iconvLite.encode(body, 'utf-8') : iconvLite.decode(body, detected.encoding);
        } else if (typeof body !== 'string') {
            body = body.toString();
        }
    } else {
        body = body.toString('utf8'); //hope for the best
    }
    return body;
}