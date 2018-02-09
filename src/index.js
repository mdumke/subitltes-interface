import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import EditableMatrix from './components/editable-matrix'

class App extends Component {
  render () {
    return (
      <EditableMatrix />
    )
  }
}

ReactDOM.render(<App />, document.querySelector('.app'))
