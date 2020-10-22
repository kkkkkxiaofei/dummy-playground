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
  console.log(node, `isNode: ${node instanceof Node}`, vdom)
  
  const result = parentNode ? parentNode.appendChild(node) && node : node
  return result
}


const update = (oldNode, newVdom, parentNode=oldNode.parentNode) => {
  if ((isString(newVdom) || isNumber(newVdom)) && oldNode instanceof Text) {
     oldNode.textContent != newVdom && parentNode.replaceChild(document.createTextNode(newVdom), oldNode)
  } else if (isObject(newVdom) && newVdom.type !== oldNode.nodeName.toLowerCase()) {
    if (isFunction(newVdom.type)) {
      Component.update(oldNode, newVdom, parentNode)
    } else {
      // console.log(oldNode, newVdom)
      // parentNode.replaceChild(oldNode, oldNode)
      render(newVdom, parentNode)
    }
  } else if (isObject(newVdom) && newVdom.type === oldNode.nodeName.toLowerCase()) {

      const pool = {};
      [...oldNode.childNodes].forEach((childNode, index) => {
          const key = childNode._key || `__index_${index}`;
          pool[key] = childNode;
      });
      [...newVdom.children].flat().forEach((childVdom, index) => {
          const key = childVdom.props && childVdom.props.key || `__index_${index}`;
          if (pool[key]) {
            update(pool[key], childVdom)
          } else {
            render(childVdom, oldNode)
          }
          delete pool[key];
      });
      console.log('pool,====', pool)
      for (const key in pool) {
          const instance = pool[key]._instance;
          if (instance) instance.componentWillUnmount();
          pool[key].remove();
      }
      for (const attr of oldNode.attributes) oldNode.removeAttribute(attr.name);
      for (const prop in newVdom.props) setAttribute(oldNode, prop, newVdom.props[prop]);

  } else {
    console.log('can not update', newVdom, oldNode.nodeName)
  }
}

class Component {
  constructor(props) {
    this.props = props
  }

  shouldComponentUpdate() {
    console.log('=====shouldComponentUpdate=====')
    return true
  }

  componentWillUpdate() {
    console.log('=====componentWillUpdate=====')
  }

  componentDidUpdate() {
    console.log('=====componentDidUpdate=====')
  } 

  componentWillMount() {
    console.log('=====componentWillMount=====')
  }

  componentWillUnmount() {
    console.log('=====componentWillUnmount=====')
  }

  componentDidMount() {
    console.log('=====componentDidMount=====')
  }

  static render(vdom, parentNode, toNode) {
    const { type, props, children } = vdom
    const instance = new type({ ...props, children })
    instance.componentWillMount()
    const node = toNode(instance.render())
    parentNode && parentNode.appendChild(node)
    instance.componentDidMount()
    instance._toNode = toNode
    node._parentNode = parentNode
    node._instance = instance
    instance._node = node
    return node
  }

  static update(oldNode, newVdom, parentNode) {
    const newProps = { ...newVdom.props, children: newVdom.children }
    if (oldNode._instance) {
      oldNode._instance.componentWillReceiveProps(newProps)
      oldNode._instance.props = newProps
      update(oldNode, oldNode._instance.render(), parentNode)
    } else {
      if (Component.isPrototypeOf(newVdom.type)) {
        //class component
        parentNode.replaceChild(Component.render(newVdom, null, oldNode._instance._toNode), oldNode)
      } else {
        //fuction component
        update(oldNode, vdom.type(props), parentNode)
      }
    }
  }

  setState(partialState, callback) {
    if (this.shouldComponentUpdate()) {
      this.componentWillUpdate()
      this.state = { ...partialState }
      const newVdom = this.render()
      const oldNode = this._node
      update(oldNode, newVdom, oldNode._parentNode)
      this.componentDidUpdate()
    }
  }
}



export default Component