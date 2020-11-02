import DummyReact, { render } from '@dummmy/react'
import PostMan from './components/PostMan'

const requests = [
  {
    title: 'Basic Cookie',
    method: 'get',
    url: 'http://localhost:8081/basic-cookie',
  },
  {
    title: 'Cookie Session',
    method: 'get',
    url: 'http://localhost:8081/cookie-session',
  }
]

const Entry = () => {
  return (
    <div>
      <PostMan {...requests[0]} />
      <PostMan {...requests[1]} />
    </div>
  )
}

render(
  <Entry />, 
  document.getElementById('root')
)