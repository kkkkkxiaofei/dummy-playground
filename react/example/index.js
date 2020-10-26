import DummyReact from '../src/react'
import { render } from '../src/ReactDom'
import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'

const Example = () => {
  return (
    <div>
      <Example1 title='JSX example1' des='made by function component' btnName='about me'>
        <div>this is children</div>  
      </Example1>
      <Example2 title='JSX example2' des='made by class component' btnName='about me'>
        <div>this is children1</div>  
        <div>this is children2</div>  
      </Example2>
      <Example3 />
    </div>
  )
}

render(
  <Example />, 
  document.getElementById('root')
)