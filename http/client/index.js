import DummyReact, { render } from '@dummmy/react'
import PostMan from './components/PostMan'

const requests = [
  {
    method: 'GET',
    url: 'http://localhost:8081/profile',
  }
]

const Entry = () => {
  return (
    <div>
      <PostMan {...requests[0]} />
    </div>
  )
}

render(
  <Entry />, 
  document.getElementById('root')
)