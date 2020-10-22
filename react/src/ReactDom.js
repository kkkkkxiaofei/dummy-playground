import { Component } from './React';
import {
  isFunction,
  isString,
  isObject,
  isArray,
  isNumber,
} from './util'

const setAttribute = (node, key, value) => {
  if (key === 'ref' && isFunction(value)) {
    value(node)
  } else if (isFunction(value) && key.startsWith('on')) {
    node._handlers = node._handlers || {}
    const eventType = key.slice(2).toLowerCase()
    node.removeEventListener(eventType, node._handlers[eventType])
    node._handlers[eventType] = value
    node.addEventListener(eventType, node._handlers[eventType])
  } else {
    let realKey = key, realValue = value
    if (key === 'className') {
      realKey = 'class'
    }

    if (key === 'disabled') {
      if (value !== true) {
        return 
      } 
      realValue = ''
    }
    if (key === 'key') {
      realKey = '_key'
    }
    node.setAttribute(realKey, realValue)
  }
}

export const render = (vdom, parentNode) => {
  const { type, props = {}, children } = vdom
  let node;

  if (isString(vdom) || isNumber(vdom)) {
    node = document.createTextNode(vdom)
  }

  if (isArray(vdom)) {
    vdom.forEach(_vdom => render(_vdom, parentNode))
    return parentNode
  }

  if (isObject(vdom)) {
    if (isString(type)) {
      const _parentNode = document.createElement(type)
      children.forEach(vdom => render(vdom, _parentNode))
      Object.entries(props || {}).forEach(([key, value]) => setAttribute(_parentNode, key, value))
      node = _parentNode
    }
  
    if (isFunction(type)) {
      //class component
      if (Object.getPrototypeOf(type) === Component) {
        return Component.render(vdom, parentNode, render)
      } 
      //function component
      return render(type({ ...props, children }), parentNode)
    }
  }
  console.log(node, vdom)
  
  const result = parentNode ? parentNode.appendChild(node) && node : node
  return result
}