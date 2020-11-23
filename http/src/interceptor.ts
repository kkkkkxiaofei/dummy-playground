import { HandlerInput } from './types'

class Interceptor {
  handlers: Array<Array<(arg: HandlerInput) => void>>
  
  constructor() {
    this.handlers = []
  }

  use(resolve: (arg: HandlerInput) => void, reject: (arg: HandlerInput) => void) {
    this.handlers.push([resolve, reject])
  }
}

export default Interceptor