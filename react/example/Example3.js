import DummyReact, { Component } from '@dummmy/react'

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
      return (<InnerComponent description='this is inner component' />)
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