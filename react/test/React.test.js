import DummyReact from '../src/React'

describe('React JSX', () => {
  it('should create element', () => {

    const Detail = ({ name, age, title }) => (
      <div className="details">
        <p>{name}</p>
        <p>{age}</p>
        <p>{title}</p>
      </div>
    )

    const NestedComponent = ({ description, children }) => (
      <div className="container">
        <h1>{description}</h1>
        {children}
      </div>
    )

    expect(
      <NestedComponent description="nested component">
        <div className="content">
            <Detail name="kelvin" age="35" title="PO" />
          </div>
      </NestedComponent>
    ).toEqual({
      type: NestedComponent,
      props: {
        description: 'nested component'
      },
      children: [
        {
          type: 'div',
          props: {
            className: 'content'
          },
          children: [
            {
              type: Detail,
              props: {
                name: 'kelvin',
                age: '35',
                title: 'PO'
              },
              children: []
            }
          ]
        }
      ]
    })
  })
})