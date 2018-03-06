let rq = require('request-promise');
let cheerio = require('cheerio');
let jschardet = require('jschardet');
let iconvLite = require('iconv-lite');
let async = require('async');
let path = require('path');
const { URL } = require('url');

const URI = 'http://www.juzimi.com';
let options = {
    uri: URI,
    transform: function(body){
        // console.log(getEncoding(body));
        return {uri: this.uri, body: cheerio.load(getEncoding(body))};
    }
}

/**
 * 统一请求方法
 * @param {Object} config url请求配置
 * @param {*} cb 请求成功回调
 */
function sendRequest(config, cb){
    rq(options).then(function(respone){
        let $ = respone.body;
        let uri = new URL(respone.uri);
        cb(uri.pathname, $);
    }).catch(function(err){
        console.log('请求出错:', err);
    })
}

sendRequest(options, function(uri, $){
    let navList = getNavItem($, $('#navbar ul .xqrvmenu'));
    mapRequest(navList)
})

/**
 * 遍历请求
 * @param {Array} arr 需要发起请求的数组
 */
function mapRequest(arr){
    arr.forEach(element => {
        if(element.children){
            element.children.map(function(child){
                options.uri = URI + child.tag
                sendRequest(options, function(uri, $){
                    parseHtmlByUri($, uri);
                })
            })
        }
    });
    // async.mapLimit(arr, 5, async function(element) {
    //     options.uri = URI + element.tag
    //     let body = promiseRequest(options);
    //     return body
    // }, (err, $) => {
    //     if (err) throw err
    //     console.log($.html())
    // })
}

/**
 * 解析页面
 * @param {Object} $ 页面的html
 * @param {*} uri 当前请求的url
 */
function parseHtmlByUri($, uri){
    if($('.fullpage').length <= 0) return;
    let page = $('.item-list ul.pager')
    let pageItem = page.children('li.pager-item');
    // console.log($(page).children('li.pager-current').length)
    console.log(pageItem.text().isArray());
    console.log(uri)
}

/**
 * 异步请求方法
 * @param {Object} options 
 */
function promiseRequest(options){
    return new Promise(function(resolve, reject){
        rq(options).then(function($){
            resolve($)
        }).catch(function(err){
            reject(err)
        })
    })
}

/**
 * 递归生成对象
 * @param {Array} arr 
 */
function getNavItem($, arr){
    let navs = [];
    arr.map(function(index, elme){
        let ch = [];
        $(elme).find('.vmenulist a').map(function(vindex, velem){
            ch.push({
                tag: $(velem).attr('href') || '',
                name: $(velem).text() || ''
            })
        })
        navs.push({
            tag: $(elme).find('.xqrrrel').parent('a').attr('href') || '',
            name: $(elme).find('.xqrrrel').text() || '',
            children: ch
        })
    })
    return navs;
}

/**
 * 转换编码格式，预防中文乱码现象
 * @param {String} body 请求响应的主体
 */
function getEncoding(body){
    let detected = jschardet.detect(body)
    if (detected && detected.encoding) {
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