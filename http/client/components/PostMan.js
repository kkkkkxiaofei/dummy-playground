import DummyReact, { Component } from '@dummmy/react'
import http from '../request'

class PostMan extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      profile: null
    }
  }

  handleClick() {
    const { method, url, data } = this.props
    http(method, url, data).then(res => this.setState({ profile: res }))
  }

  renderProfile() {
    if (this.state.profile) {
      const { name, email, mobile } = this.state.profile
      return (
        <div>
          <p>{name}</p>
          <p>{email}</p>
          <p>{mobile}</p>
        </div>
      )
    }
    return (<div>no profile</div>)
  }

  render() {
    const { method, url } = this.props
    return (
      <div>
        <p>{`${method} ${url}`}</p>
        <button onClick={this.handleClick}>send</button>
        {this.renderProfile()}
      </div>
    )
  }
}

export default PostMan