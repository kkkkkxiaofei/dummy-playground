
export const isFunction = arg => typeof arg === 'function'
export const isString = arg => typeof arg === 'string'
export const isObject = arg => typeof arg === 'object'
export const isArray = arg => Object.prototype.toString.call(arg) === '[object Array]'
export const isNumber = arg => Object.prototype.toString.call(arg) === '[object Number]'
