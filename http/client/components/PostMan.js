import DummyReact, { Component } from '@dummmy/react'
import { http, axios } from '../request'

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
    http[method](url, data).then(res => {
      this.setState({ profile: res.data })
      console.log(res, '=======res=======')
    })
  }

  renderProfile() {
    if (this.state.profile) {
      const { name, email, mobile, views = 0 } = this.state.profile
      return (
        <div>
          <p>{name}</p>
          <p>{email}</p>
          <p>{mobile}</p>
          <p>{views}</p>
        </div>
      )
    }
    return (<div>no profile</div>)
  }

  render() {
    const { title, method, url } = this.props
    return (
      <div>
        <h1>{title}</h1>
        <p>{`${method.toUpperCase()} ${url}`}</p>
        <button onClick={this.handleClick}>send</button>
        {this.renderProfile()}
      </div>
    )
  }
}

export default PostMan