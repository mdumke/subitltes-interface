import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Cell from './cell'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentSelection: 0
    }
  }

  componentDidMount () {
    this.refs['cells[0]'].setFocus()
  }

  shiftFocus (direction) {
    let step

    if (direction === 'DOWN') {
      step = this.state.currentSelection < 2 ? 1 : 0
    }

    if (direction === 'UP') {
      step = this.state.currentSelection > 0 ? -1 : 0
    }

    const newSelection = this.state.currentSelection + step

    this.setState({
      currentSelection: newSelection
    })

    this.refs[`cells[${newSelection}]`].setFocus()
  }

  render () {
    return (
      <div>
        <Cell
          shiftFocus={this.shiftFocus.bind(this)}
          content='0'
          ref='cells[0]' />

        <Cell
          shiftFocus={this.shiftFocus.bind(this)}
          content='1'
          ref='cells[1]' />

        <Cell
          shiftFocus={this.shiftFocus.bind(this)}
          content='2'
          ref='cells[2]' />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('.app'))



// class SelectableDiv extends Component {
//   constructor (props) {
//     super(props)
// 
//     this.state = {
//       isEditable: false,
//       html: `<div>${this.props.content}</div>`
//     }
//   }
// 
//   handleKeyPress (e) {
//     if (this.state.isEditable) {
//       if (e.key === 'Enter' && e.shiftKey) {
//         e.preventDefault()
// 
//         this.setState({
//           isEditable: false
//         })
// 
//         this.props.shiftFocus('DOWN')
// 
//         return
//       }
// 
//       this.setState({
//         html: e.target.innerHTML
//       })
// 
//       console.log(e.target.innerHTML)
// 
// //       this.refs.element.blur()
// //       this.refs.element.focus()
//     }
//   }
// 
//   setFocus () {
//     this.refs.element.focus()
//   }
// 
//   render () {
//     return (
//       <div
//         ref='element'
//         id={`div${this.props.content}`}
//         contentEditable={this.state.isEditable}
//         onKeyPress={this.handleKeyPress.bind(this)}
//         onKeyDown={this.handleKeyDown.bind(this)}
//         dangerouslySetInnerHTML={{__html: this.props.content}}
//         tabIndex='-1'>
//       </div>
//     )
//   }
// }
// 
