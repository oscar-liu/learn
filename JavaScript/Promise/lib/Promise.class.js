/**
 * 手写Promise
 */
class Promise {
  // 构造器
  constructor(executor) {
    // 添加实例属性
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.callbacks = []
    const self = this

    function resolve(data) {
      if (self.PromiseState !== 'pending') return
      // 1. 修改对象的状态 PromiseState
      self.PromiseState = 'fulfilled'
      // 2. 设置对象的结果值 PromiseResult
      self.PromiseResult = data
      setTimeout(() => {
        self.callbacks.forEach(item => {
          item.onResoved(data)
        })
      })
    }

    function reject(data) {
      if (self.PromiseState !== 'pending') return
      self.PromiseState = 'rejected'
      self.PromiseResult = data
      setTimeout(() => {
        self.callbacks.forEach(item => {
          item.onRejected(data)
        })
      })
    }

    try {
      // 周步调用 执行函数
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  /**
   * then方法 
   * @param {Function} onResoved 成功
   * @param {Function} onRejected 失败
   * @returns 
   */
  then(onResoved, onRejected) {
    const self = this
    // 判断回调函数是否存在
    if (typeof onResoved !== 'function') {
      onResoved = function (reson) {
        return reson
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = function (reson) {
        throw reson
      }
    }
    return new Promise((resolve, reject) => {
      function callback(fn) {
        try {
          // 获取回调函数的执行结果
          let result = fn(self.PromiseResult)
          // 判断执行结果是否为promise
          if (result instanceof Promise) {
            // 如果是Promise对象
            result.then(v => {
              resolve(v)
            }, r => {
              reject(r)
            })
          } else {
            // 结果为成功直接返回
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }
      // 调用回调函数
      if (this.PromiseState === 'fulfilled') {
        setTimeout(() => {
          callback(onResoved)
        });
      }
      if (this.PromiseState === 'rejected') {
        setTimeout(() => {
          callback(onRejected)
        })
      }
      if (this.PromiseState === 'pending') {
        // 保存回调函数
        this.callbacks.push({
          onResoved: function () {
            callback(onResoved)
          },
          onRejected: function () {
            callback(onRejected)
          }
        })
      }
    })
  }

  // catch 方法
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  // resolve方法
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(v => {
          resolve(v)
        }, r => {
          reject(r)
        })
      } else {
        resolve(value)
      }
    })
  }

  // reject方法
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  // all方法
  static all(promise) {
    return new Promise((resolve,reject) => {
      // 成功变量计数器
      let count = 0
      let values = []
      for(let i =0; i<promise.length ; i++) {
        promise[i].then( v=> {
          // 如果执行这里就是成功
          count ++
          values[i] = v
          // 都成功
          if(count === promise.length) {
            resolve(values)
          }
        }, r=> {
          // 如果执行这里就是失败
          reject(r)
        })
      }
    })
  }

  static race(promise) {
    return new Promise((resolve, reject) => {
      for(let i =0; i<promise.length ; i++) {
        promise[i].then( v=> {
          // 修改返回对象的状态为成功
          resolve(v)
        }, r=> {
          // 如果执行这里就是失败
          reject(r)
        })
      }
    })
  }

}