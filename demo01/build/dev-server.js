var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var env = process.env.NODE_ENV.trim();
var webpackConfig = env === 'testing'? require('./webpack.prod.conf'):require('./webpack.dev.conf');


// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(function(name) {
    webpackConfig.entry[name] = ['./build/dev-client'].concat(webpackConfig.entry[name])
})

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());


// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware

var server = express()
var compiler = webpack(webpackConfig);
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

var context = config.dev.context
var proxypath = config.dev.proxypath

var options = {
    target: proxypath,
    changeOrigin: true,
}
if (context.length) {
    server.use(proxyMiddleware(context, options))
}
/*

server.use(proxyMiddleware('/yzlpms', {
    //target: 'http://192.168.7.18',
    // target:'http://dev.inzlink.com',
    target:'http://dev.inzlink.com',
    changeOrigin: true,
}))
*/


// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')())

// serve webpack bundle output
server.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
server.use(hotMiddleware)

// 如果server不会自动打开浏览器，可以用此打开
// 表示所有编译工作已经完成....
devMiddleware.waitUntilValid(function(){
    console.log('编译完成.....');
    var uri = 'http://localhost:' + port + '/web/search';
    opn(uri);
});

// serve pure static assets
// express.static('static')只对真实目录有用，对虚拟内存目录无用(即对dev的server无用)
// 因此，这部分可删除
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
server.use(staticPath, express.static('static'))

module.exports = server.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    /*var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')

    // when env is testing, don't need open it
    if (process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }*/
})
