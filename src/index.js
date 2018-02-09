import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import SnippetMatrix from './components/snippet-matrix'

class App extends Component {
  render () {
    return (
      <SnippetMatrix />
    )
  }
}

ReactDOM.render(<App />, document.querySelector('.app'))
