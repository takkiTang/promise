class Promise {
  value: unknown
  status: String
  fulfilledcallbacks: Array<any>
  rejectcallbacks: Array<any>
  constructor(executor) {
    this.value = undefined
    this.status = 'pending'
    this.fulfilledcallbacks = []
    this.rejectcallbacks = []
    executor(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(value) {
    if (this.status === 'pending') {
      this.value = value
      this.status = 'fulfilled'
      this.fulfilledcallbacks.forEach(fn => fn())
    }
  }
  reject(reason) {
    if (this.status === 'pending') {
      this.value = reason
      this.status = 'rejected'
      this.rejectcallbacks.forEach(fn => fn())
    }
  }
  then(onfulfilled, onrejected?) {
    return new Promise((resolve, reject) => {
      switch (this.status) {
        case 'pending': {
          this.fulfilledcallbacks.push(() => {
            let res = onfulfilled(this.value)
            if (res instanceof Promise) {
              res.then(resolve)
            } else {
              resolve(res)
            }
          })
          this.rejectcallbacks.push(() => {
            let res = onrejected(this.value)
            if (res instanceof Promise) {
              res.then(resolve)
            } else {
              resolve(res)
            }
          })
        }
          break
        case 'fulfilled': {
          this.fulfilledcallbacks.push(() => {
            let res = onfulfilled(this.value)
            if (res instanceof Promise) {
              res.resolve(reject)
            } else {
              reject(res)
            }
          })
        }
          break
        case 'rejected': {
          this.rejectcallbacks.push(() => {
            let res = onfulfilled(this.value)
            if (res instanceof Promise) {
              res.reject(reject)
            } else {
              reject(res)
            }
          })
        }
          break
      }
    })
  }
}

export default Promise