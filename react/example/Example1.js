import DummyReact from '@dummmy/react';

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

export default Example1