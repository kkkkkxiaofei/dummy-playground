const isFunction = arg => typeof arg === 'function'
const isString = arg => typeof arg === 'string'
const isObject = arg => typeof arg === 'object'
const isArray = arg => Object.prototype.toString.call(arg) === '[object Array]'

const setAttribute = (node, key, value) => {
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

  node.setAttribute(realKey, realValue)

  if (key === 'ref' && isFunction(value)) {
    value(node)
  }

  if (isFunction(value) && key.startsWith('on')) {
    node._handlers = node._handlers || {}
    const eventType = key.slice(2).toLowerCase()
    node.removeEventListener(eventType, node._handlers[eventType])
    node._handlers[eventType] = value
    node.addEventListener(eventType, node._handlers[eventType])
  }

  
}

export const render = (vdom, parentNode) => {
  console.log(vdom)
  const { type, props = {}, children } = vdom
  let node;

  if (isString(vdom)) {
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
      return render(type({ ...props, children }), parentNode)
    }
  }
  
  const result = parentNode ? parentNode.appendChild(node) && node : node
  return result
}
