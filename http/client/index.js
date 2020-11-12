import DummyReact, { render } from '@dummmy/react'
import PostMan from './components/PostMan'

const requests = [
  {
    title: 'Basic Cookie',
    method: 'get',
    url: 'http://localhome:8081/basic-cookie',
  },
  {
    title: 'Basic Cookie',
    method: 'post',
    url: 'http://localhome:8081/basic-cookie',
  },
  {
    title: 'Cookie Session',
    method: 'get',
    url: 'http://localhome:8081/cookie-session',
  },
  {
    title: 'Express Session',
    method: 'get',
    url: 'http://localhome:8081/express-session',
  },
  {
    title: 'Cancel Request',
    method: 'get',
    url: 'http://localhome:8081/cancel',
    cancelable: true
  }
]


const Entry = () => {
  return (
    <div>
      {requests.map(request => <PostMan {...request} />)}
    </div>
  )
}

render(
  <Entry />, 
  document.getElementById('root')
)