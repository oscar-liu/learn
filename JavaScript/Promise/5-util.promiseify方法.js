/**
 * nodejs util.promisify 方法
 */

const util = require('util');
const fs = require('fs');

// 使用util.promiseify返回一个promise对象
let mineReadFile = util.promisify(fs.readFile)

mineReadFile('./Promisew介绍.md').then( res=> {
    console.log(res.toString())
}, err=> {
    console.error(err)
})