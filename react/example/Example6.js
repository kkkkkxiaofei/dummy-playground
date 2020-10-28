import DummyReact, { Component } from '@dummmy/react'

class InnerComponent extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { id, deleteItem } = this.props
    deleteItem(id)
  }

  render() {
    const { id, name } = this.props
    return (
      <div key={id}>
        <span>{name}</span>
        <button onClick={this.handleClick}>delete</button>
      </div>
    )
  }
}

class SimpleComponent extends Component {
  constructor(props) {
    super(props)
    this.bindRef = this.bindRef.bind(this)
    this.addItem = this.addItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.state = { items: [] }
  }

  bindRef(node) {
    this.inputRef = node
  }

  addItem() {
    const { items } = this.state
    this.setState({
      items: items.concat({
        id: `id-${items.length}`,
        name: this.inputRef.value
      })
    })
    this.inputRef.value = ''
  }

  deleteItem(deleteId) {
    const { items } = this.state
    const newItems = items.filter(({ id }) => id !== deleteId)
    this.setState({
      items: newItems
    })
  }

  render() {
    const { items } = this.state
    
    return (
      <div>
        <h1>Example6</h1>
        <div> 
          <input type="text" ref={this.bindRef}/>
          <button onClick={this.addItem}>add</button>
        </div>
        <div>
          <h4>items:</h4>
          {items.map(item => (
            <InnerComponent {...item} deleteItem={this.deleteItem} />
          ))}
        </div>
      </div>
    )
  }
}

export default SimpleComponent