import DummyReact, { Component } from '../src/react';
import { render } from '../src/ReactDom'

const Example1 = ({ title, des, btnName, children }) => {
  const handleClick = () => alert('button click')
  let containerRef;
  return (
    <div className='container' ref={node => {
      containerRef = node
      console.log('containerRef', containerRef)
    }}>
      <h1 className='bold-font'>{title}</h1>
      <p className='content'>{des}</p>
      <div className='button-wrapper'>
        <button disabled={false} onClick={handleClick}>{btnName}</button>
      </div>
      {children}
    </div>
  )
}

class Example2 extends Component {
  constructor(props) {
    super(props)
    this.containerRef = null
    this.bindRef = this.bindRef.bind(this)
  }

  handleClick() {
    alert('button click')
  }

  bindRef(node) {
    this.containerRef = node
    this.containerRef.style.background = 'red'
  }

  render() {
    const { title, des, btnName, children } = this.props
    return (
      <div className='container' ref={this.bindRef}>
        <h1 className='bold-font'>{title}</h1>
        <p className='content'>{des}</p>
        <div className='button-wrapper'>
          <button disabled={false} onClick={this.handleClick}>{btnName}</button>
        </div>
        {children}
      </div>
    )
  }
}

render(
  <Example1 title='JSX example1' des='made by function component' btnName='about me'>
    <div>this is children</div>  
  </Example1>
  , 
  document.getElementById('root')
)

render(
  <Example2 title='JSX example2' des='made by class component' btnName='about me'>
    <div>this is children</div>  
  </Example2>
  , 
  document.getElementById('root')
)