import DummyReact from '../src/React'

describe('React', () => {
  it('should create element', () => {
    const element = DummyReact.createElement('div', { name: 'hello' }, 'children 1', 'children 2')

    expect(element).toEqual({
      type: 'div',
      props: {
        name: 'hello'
      },
      children: [
        'children 1',
        'children 2'
      ]
    })
  })
})