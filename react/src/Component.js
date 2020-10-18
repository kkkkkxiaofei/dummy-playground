class Component {
  constructor(props) {
    this.props = props
  }

  componentWillMount() {
    console.log('=====componentWillMount=====')
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
    return node
  }
}

export default Component