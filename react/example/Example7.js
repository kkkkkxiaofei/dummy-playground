import DummyReact, { Component } from '../src/React'

class DeepInner extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(`============${this.props.title} did mount =========`)
  }

  componentWillUnmount() {
    console.log(`============${this.props.title} will unmount =========`)
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
      </div>
    ) 
  }
}

class Inner extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(`============${this.props.title} did mount =========`)
  }

  componentWillUnmount() {
    console.log(`============${this.props.title} will unmount =========`)
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <DeepInner title='deep inner' />
      </div>
    ) 
  }
}

class Outer extends Component {
  constructor(props) {
    super(props)
    this.state = { visible: true }
    this.change = this.change.bind(this)
  }

  change() {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    return (
      <div>
        <h1>Example7</h1>
        <button onClick={this.change}>change</button>
        {this.state.visible && <Inner title='inner1' />}
      </div>
    )
  }
}

export default Outer