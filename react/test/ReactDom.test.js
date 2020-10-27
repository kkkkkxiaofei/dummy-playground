import DummyReact, { Component } from '../src/React'
import { render } from '../src/ReactDom'

describe('ReactDom', () => {

  describe('Render', () => {

    it('should render basic class component', () => {
      class BasicClassComponent extends Component {
        constructor(props) {
          super(props)
        }

        render() {
          const { className, name, age, title } = this.props
          return (
            <div className={className}>
              <p>{name}</p>
              <span>{age}</span>
              <a>{title}</a>
            </div>
          )  
        }
      }

      const node = render(<BasicClassComponent className='test-class' name='kelvin' age={35} title='PO' />)
      
      expect(node.getAttribute('class')).toEqual('test-class')
      expect(node.childNodes.length).toEqual(3)
      expect(node.childNodes[0].textContent).toEqual('kelvin')
      expect(node.childNodes[0].nodeName).toEqual('P')
      expect(node.childNodes[1].textContent).toEqual('35')
      expect(node.childNodes[1].nodeName).toEqual('SPAN')
      expect(node.childNodes[2].textContent).toEqual('PO')
      expect(node.childNodes[2].nodeName).toEqual('A')
    })
    
    it('should render nested class compoent', () => {

      class Detail extends Component {
        constructor(props) {
          super(props)
        }

        render() {
          const { className, name, age, title } = this.props
          return (
            <div className={className}>
              <p>{name}</p>
              <span>{age}</span>
              <a>{title}</a>
            </div>
          )  
        }
      }

      class NestedClassComponent extends Component {
        constructor(props) {
          super(props)
        }

        render() {
          const { description, children } = this.props
          return (
            <div className="container">
              <h1>{description}</h1>
              {children}
            </div>
          )
        }
      }

      const node = render(
        <NestedClassComponent description="nested component">
          <div className="content">
            <Detail name="kelvin" age="35" title="PO" className="detail-container" />
          </div>
        </NestedClassComponent>
      )

      expect(node.getAttribute('class')).toEqual('container')
      expect(node.childNodes.length).toEqual(2)
      expect(node.childNodes[0].textContent).toEqual('nested component')
      expect(node.childNodes[0].nodeName).toEqual('H1')
      expect(node.childNodes[1].getAttribute('class')).toEqual('content')
      expect(node.childNodes[1].nodeName).toEqual('DIV')
      expect(node.childNodes[1].childNodes.length).toEqual(1)
      expect(node.childNodes[1].childNodes[0].getAttribute('class')).toEqual('detail-container')
      expect(node.childNodes[1].childNodes[0].childNodes.length).toEqual(3)
    })

    it('should call lifecycle hooks correctly when render nested class compoent', () => {
      const args = []

      class Detail extends Component {
        constructor(props) {
          super(props)
        }

        componentWillMount() {
          args.push({
            component: 'Detail',
            name: 'componentWillMount'
          })
        }
        componentDidMount() {
          args.push({
            component: 'Detail',
            name: 'componentDidMount'
          })
        }

        render() {
          const { className, name, age, title } = this.props
          return (
            <div className={className}>
              <p>{name}</p>
              <span>{age}</span>
              <a>{title}</a>
            </div>
          )  
        }
      }

      class NestedClassComponent extends Component {
        constructor(props) {
          super(props)
        }

        componentWillMount() {
          args.push({
            component: 'NestedClassComponent',
            name: 'componentWillMount'
          })
        }
        componentDidMount() {
          args.push({
            component: 'NestedClassComponent',
            name: 'componentDidMount'
          })
        }
        

        render() {
          const { description, children } = this.props
          return (
            <div className="container">
              <h1>{description}</h1>
              {children}
            </div>
          )
        }
      }

      render(
        <NestedClassComponent description="nested component">
          <div className="content">
            <Detail name="kelvin" age="35" title="PO" className="detail-container" />
          </div>
        </NestedClassComponent>
      )

      expect(args.length).toEqual(4)
      expect(args[0]).toEqual({
        component: 'NestedClassComponent',
        name: 'componentWillMount'
      })
      expect(args[1]).toEqual({
        component: 'Detail',
        name: 'componentWillMount'
      })
      expect(args[2]).toEqual({
        component: 'Detail',
        name: 'componentDidMount'
      })
      expect(args[3]).toEqual({
        component: 'NestedClassComponent',
        name: 'componentDidMount'
      })
      
    })

    it('should render basic function component', () => {

      const BasicFunctionComponent = ({ className, name, age, title }) => (
        <div className={className}>
          <p>{name}</p>
          <span>{age}</span>
          <a>{title}</a>
        </div>
      )

      const node = render(<BasicFunctionComponent className='test-class' name='kelvin' age={35} title='PO' />)
      
      expect(node.getAttribute('class')).toEqual('test-class')
      expect(node.childNodes.length).toEqual(3)
      expect(node.childNodes[0].textContent).toEqual('kelvin')
      expect(node.childNodes[0].nodeName).toEqual('P')
      expect(node.childNodes[1].textContent).toEqual('35')
      expect(node.childNodes[1].nodeName).toEqual('SPAN')
      expect(node.childNodes[2].textContent).toEqual('PO')
      expect(node.childNodes[2].nodeName).toEqual('A')
    })
    
    it('should render nested function compoent', () => {

      const Detail = ({ className, name, age, title }) => (
        <div className={className}>
          <p>{name}</p>
          <span>{age}</span>
          <a>{title}</a>
        </div>
      )  

      const NestedClassComponent = ({ description, children }) => (
        <div className="container">
          <h1>{description}</h1>
          {children}
        </div>
      )

      const node = render(
        <NestedClassComponent description="nested component">
          <div className="content">
            <Detail name="kelvin" age="35" title="PO" className="detail-container" />
          </div>
        </NestedClassComponent>
      )

      expect(node.getAttribute('class')).toEqual('container')
      expect(node.childNodes.length).toEqual(2)
      expect(node.childNodes[0].textContent).toEqual('nested component')
      expect(node.childNodes[0].nodeName).toEqual('H1')
      expect(node.childNodes[1].getAttribute('class')).toEqual('content')
      expect(node.childNodes[1].nodeName).toEqual('DIV')
      expect(node.childNodes[1].childNodes.length).toEqual(1)
      expect(node.childNodes[1].childNodes[0].getAttribute('class')).toEqual('detail-container')
      expect(node.childNodes[1].childNodes[0].childNodes.length).toEqual(3)
    })

  })

  describe('Update', () => {

    it('should update when oldNode is Text and newVdom is string or number', () => {
        class SimpleComponent extends Component {
          constructor(props) {
            super(props)
            this.state = { content: 'string1'}
          }

          render() {
            const { content } = this.state
            return (<div>{content}</div>)
          }
        }

        const node = render(<SimpleComponent />)

        node._instance.setState({ content: 'string2' })

        expect(node.childNodes[0].textContent).toEqual('string2')

    })

    it('should update when newVdom is object and type is function', () => {
      class InnerComponent extends Component {
        constructor(props) {
          super(props)
        }

        render() {
          return (
            <p>{this.props.description}</p>
          )
        }
      }

      class SimpleComponent extends Component {
        constructor(props) {
          super(props)
          this.state = { content: 'string1'}
        }

        render() {
          const { content } = this.state
          if (content === 'string2') {
            return (<InnerComponent description='this is inner component' />)
          }
          return (<div>{content}</div>)
        }
      }
      const root = document.createElement('div')
      const node = render(<SimpleComponent />, root)

      node._instance.setState({ content: 'string2' })

      expect(root.childNodes[0].nodeName).toEqual('P')
      expect(root.childNodes[0].childNodes[0].textContent).toEqual('this is inner component')

    })

    it('should update when newVdom is object and type is not function', () => {
      class InnerComponent extends Component {
        constructor(props) {
          super(props)
        }

        render() {
          return (
            <p>{this.props.description}</p>
          )
        }
      }

      class SimpleComponent extends Component {
        constructor(props) {
          super(props)
          this.state = { content: 'string1'}
        }

        render() {
          const { content } = this.state
          if (content === 'string2') {
            return (
              <a>
                <InnerComponent description='this is inner component' />
              </a>
            )
          }
          return (<div>{content}</div>)
        }
      }
      const root = document.createElement('div')
      const node = render(<SimpleComponent />, root)

      node._instance.setState({ content: 'string2' })

      expect(root.childNodes[0].nodeName).toEqual('A')
      expect(root.childNodes[0].childNodes[0].nodeName).toEqual('P')
      expect(root.childNodes[0].childNodes[0].childNodes[0].textContent).toEqual('this is inner component')

    })

  })

})