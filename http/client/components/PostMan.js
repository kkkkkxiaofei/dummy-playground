import DummyReact, { Component } from '@dummmy/react'
import http from '../request'

class PostMan extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { method, url, data } = this.props
    http(method, url, data)
  }

  render() {
    const { method, url } = this.props
    return (
      <div>
        <p>{`${method} ${url}`}</p>
        <button onClick={this.handleClick}>send</button>
      </div>
    )
  }
}

export default PostMan