import DummyReact, { render } from '@dummmy/react'
import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'
import Example4 from './Example4'
import Example5 from './Example5'
import Example6 from './Example6'
import Example7 from './Example7'

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
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
    </div>
  )
}

render(
  <Example />, 
  document.getElementById('root')
)