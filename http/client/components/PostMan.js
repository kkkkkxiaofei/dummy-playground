import DummyReact, { Component } from '@dummmy/react'
import { http, axios } from '../request'

class PostMan extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    
    this.state = {
      profile: null,
      error: null
    }
    if (this.props.cancelable) {
      this.state.source = http.CancelToken.source()
    }
  }

  handleClick() {
    const { method, url, data } = this.props
    const { source } = this.state
    
    http[method](url, source ? {
      cancelToken: source.token
    } : null).then(res => {
      this.setState({ profile: res.data })
    }).catch(error => this.setState({ error }))
      .finally(() => this.setState({ ...this.state, source: http.CancelToken.source() }))
  }

  handleCancel() {
    const { source } = this.state
    source && source.cancel('pursue wants to cancel this call!')
  }

  renderProfile() {
    const { profile, error } = this.state
    if (profile) {
      const { name, email, mobile, views = 0, date } = profile
      return (
        <div>
          <p>{name}</p>
          <p>{email}</p>
          <p>{mobile}</p>
          <p>{views}</p>
          <p>{date}</p>
        </div>
      )
    }

    if (error) {
      return (
        <div>
          <p>{error.toString()}</p>
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
        <button onClick={this.handleCancel}>cancel</button>
        {this.renderProfile()}
      </div>
    )
  }
}

export default PostMan