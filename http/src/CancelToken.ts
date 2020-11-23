import { CancelExecutor } from './types'

class CancelToken {
  promise: Promise<string>

  constructor(executor: CancelExecutor) {
    let _resolve: (arg: string) => void;
    this.promise = new Promise(function(resolve) {
      _resolve = resolve
    })
    
    executor(function cancel(reason) {
      _resolve(reason)
    })  
  }

  static source() {
    let cancel
    const token = new CancelToken(function(c) {
      cancel = c
    })
    return {
      token,
      cancel
    }
  }
}

export default CancelToken