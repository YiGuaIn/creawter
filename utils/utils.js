/**
 * 请求方法
 * @param {Object} conf 请求配置对象 
 */
function fetch(conf) {
    return {};
}

/**
 * 解析页面方法
 * @param {Object} conf 解析页面的配置
 */
function getResource(conf) {
    return {};
}

/**
 * 获取Promise的方法
 * @param {Function} cb 需要执行的方法 
 */
function getPromiseFunc(cb) {
    return new Promise(function(resolve, reject){
        cd(resolve, reject);
    })
}

