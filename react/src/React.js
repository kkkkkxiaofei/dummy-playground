import Component from './Component'

const createElement = (type, props, ...children) => ({ type, props, children: children  })

export default {
  createElement,
}
  
export {
  Component
}