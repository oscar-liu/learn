const fs = require('fs')
const util = require('util')
const mineReadFile = util.promisify(fs.readFile)

async function main() {
    try {
        let data1 = await mineReadFile('./1.txt')
        let data2 = await mineReadFile('./2.txt')
        console.log(data1+data2)
    } catch(err) {
        console.warn(err)
    }
}

main()