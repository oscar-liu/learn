
const fs = require('fs')

// 回调函数
// fs.readFile('./体验.html', (err, data) => {
//     if(err) throw err;
//     // 输出文件内容
//     console.log(data.toString())
// })

// Promise实现
let p = new Promise((resolve, reject) => {
    fs.readFile('./体验.html', (err, data) => {
        // Err
        if(err) reject(err)
        // success
        resolve(data)
    })
})

p.then( res=> {
    console.log( res.toString())
}, err=> {
    console.error(err)
})