import { Component } from './react';
import {
  isFunction,
  isString,
  isObject,
  isArray,
  isNumber,
  isBoolean,
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
      children.forEach(childVdom => render(childVdom, _parentNode))
      Object.entries(props || {}).forEach(([key, value]) => setAttribute(_parentNode, key, value))
      node = _parentNode
    }
  
    if (isFunction(type)) {
      //class component
      if (Object.getPrototypeOf(type) === Component) {
        return Component.render(vdom, parentNode, render, update)
      } 
      //function component
      return render(type({ ...props, children }), parentNode)
    }
  }
  
  const result = parentNode ? parentNode.appendChild(node) && node : node
  return result
}

const deepUnmount = instance => {
  if (instance) {
    instance.componentWillUnmount()
    if (instance._node && instance._node.childNodes.length > 0) {
      instance._node.childNodes.forEach(node => {
        deepUnmount(node._instance)
      })
    }
  }
}


const update = (oldNode, newVdom, parentNode=oldNode.parentNode) => {
  if ((isString(newVdom) || isNumber(newVdom)) && oldNode instanceof Text) {
     oldNode.textContent != newVdom && parentNode.replaceChild(document.createTextNode(newVdom), oldNode)
  } else if (isObject(newVdom) && newVdom.type !== oldNode.nodeName.toLowerCase()) {
    if (isFunction(newVdom.type)) {
      Component.update(oldNode, newVdom, parentNode, update, render)
    } else {
      deepUnmount(oldNode._instance)
      parentNode.replaceChild(render(newVdom), oldNode)
    }
  } else if (isObject(newVdom) && newVdom.type === oldNode.nodeName.toLowerCase()) {

      const existingChildNodes = {};
      [...oldNode.childNodes].forEach((childNode, index) => {
          const key = childNode._key || `__index_${index}`;
          existingChildNodes[key] = childNode;
      });
      [...newVdom.children]
        .flat()
        .filter($ => !isBoolean($))
        .forEach((childVdom, index) => {
            const key = childVdom.props && childVdom.props.key || `__index_${index}`;
            if (existingChildNodes[key]) {
              update(existingChildNodes[key], childVdom)
            } else {
              render(childVdom, oldNode)
            }
            delete existingChildNodes[key];
        });
      for (const key in existingChildNodes) {
          const instance = existingChildNodes[key]._instance;
          if (instance) deepUnmount(instance);
          existingChildNodes[key].remove();
      }
      for (const attr of oldNode.attributes) oldNode.removeAttribute(attr.name);
      for (const prop in newVdom.props) setAttribute(oldNode, prop, newVdom.props[prop]);

  } else {
    console.log('can not update', newVdom, oldNode.nodeName)
  }
}
