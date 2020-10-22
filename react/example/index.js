import DummyReact, { Component, render } from '../src/react';

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
    this.handleClick = this.handleClick.bind(this)
    this.state = { value: 0 }
  }

  handleClick() {
    this.setState({ value: this.state.value + 1 })
  }

  bindRef(node) {
    this.containerRef = node
    this.containerRef.style.background = 'green'
  }

  render() {
    const { title, des, btnName, children } = this.props
    const { value } = this.state
    console.log(value, '======value======')
    return (
      <div className='container' ref={this.bindRef}>
        <h1 className='bold-font'>{title}</h1>
        <p className='content'>{des}</p>
        <div className='button-wrapper'>
          <span>{value}</span>
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
    <div>this is children1</div>  
    <div>this is children2</div>  
  </Example2>
  , 
  document.getElementById('root')
)