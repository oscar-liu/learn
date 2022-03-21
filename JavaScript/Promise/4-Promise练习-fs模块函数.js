/**
 * 封闭一个函数readFile 读取文件内容
 */

function readFile(path) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(path, (err, data) => {
            // 错误处理
            if(err) reject(err)
            // 成功
            resolve(data)
        })

    })
}

readFile('./3-Promise练习-Ajax.html').then( res=> {
    console.log(res.toString())
}, err=> {
    console.error(err)
})