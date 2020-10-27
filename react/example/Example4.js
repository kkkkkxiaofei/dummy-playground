import DummyReact, { Component } from '../src/React'

class InnerComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <p>{this.props.description}</p>
    )
  }
}

class SimpleComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { content: 'Example3'}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ content: 'string2'})
  }

  render() {
    const { content } = this.state
    if (content === 'string2') {
      return (
        <a>
          <InnerComponent description='this is inner component' />
        </a>
      )
    }
    return (
      <div>
        <h1>{content}</h1>
        <button onClick={this.handleClick}>update</button>
      </div>
    )
  }
}

export default SimpleComponent