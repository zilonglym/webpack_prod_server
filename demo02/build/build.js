// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
// -------------- 每次启动项目之前，先清除上一次打包压缩的生产包
rm('-rf', config.build.assetsRoot)
mkdir('-p', config.build.assetsRoot)
// cp('-R', 'static/*', assetsPath)

// 这里就是所有打包编译完生成包的，回调---------------------说明所有打包工作已经完成
webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
    // 根据npm script(TEST_PROD=true)判断是否是启动生成测试服务器
    if (process.env.TEST_PROD && process.env.TEST_PROD.trim() == 'yes') {
        cd('web');
        mkdir('-p', 'web/static')
        cp('-R', 'static/*', 'web/static')
        rm('-rf', 'static');
    };
})