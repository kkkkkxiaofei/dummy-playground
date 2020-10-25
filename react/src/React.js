import Component from './Component'
import { render } from './ReactDom'

const createElement = (type, props, ...children) => ({ type, props, children: children  })

export default {
  createElement,
}
  
export {
  Component,
  render
}