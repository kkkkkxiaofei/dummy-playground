import DummyReact from '../src/react';

const Example = ({ title, des, btnName }) => (
  <div className='container'>
    <h1 className='bold-font'>{title}</h1>
    <p className='content'>{des}</p>
    <div className='button-wrapper'>
      <button disabled={true}>{btnName}</button>
    </div>
  </div>
)

console.log(<Example title='JSX example' des='jsx' btnName='about me' />)