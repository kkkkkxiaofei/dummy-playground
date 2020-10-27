class Component {
  constructor(props, updater) {
    this.props = props
    this.updater = updater
  }

  componentWillReceiveProps(nextProps) {
    console.log('=====componentWillReceiveProps=====', 'nextProps:', nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('=====shouldComponentUpdate=====', 'nextProps:', nextProps, 'nextState:', nextState)
    return this.props !== nextProps || this.state !== nextState
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('=====componentWillUpdate=====', 'nextProps:', nextProps, 'nextState:', nextState)
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

  static render(vdom, parentNode, render, update) {
    const { type, props, children } = vdom
    const instance = new type({ ...props, children })
    instance.componentWillMount()
    console.log(instance.render())
    const node = render(instance.render())
    parentNode && parentNode.appendChild(node)
    instance.componentDidMount()
    instance._render = render
    instance._update = update
    node._parentNode = parentNode
    node._instance = instance
    instance._node = node
    return node
  }

  static update(oldNode, newVdom, parentNode, update, render) {
    const newProps = { ...newVdom.props, children: newVdom.children }
    if (oldNode._instance && oldNode._instance.constructor === newVdom.type) {
      oldNode._instance.componentWillReceiveProps(newProps)
      oldNode._instance.props = newProps
      update(oldNode, oldNode._instance.render(), parentNode)
    } else {
      if (Component.isPrototypeOf(newVdom.type)) {
        //class component
        const newNode = Component.render(newVdom, null, render)
        parentNode && parentNode.replaceChild(newNode, oldNode)
      } else {
        //fuction component
        update.update(oldNode, vdom.type(props), parentNode)
      }
    }
  }

  setState(partialState) {
    if (this.shouldComponentUpdate(partialState, this.props)) {
      this.componentWillUpdate(partialState, this.props)
      this.state = { ...partialState }
      const newVdom = this.render()
      const oldNode = this._node
      this._update(oldNode, newVdom, oldNode._parentNode)
      this.componentDidUpdate()
    }
  }
}



export default Component