import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

import { setEndOfContenteditable } from '../utils/utils'
import { UP, DOWN, LEFT, RIGHT } from './constants'

class CellContent extends ContentEditable {
  setFocus () {
    this.htmlEl.focus()
  }
}

class Cell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isEditable: false,
      html: this.props.content
    }
  }

  // helper functions
  setFocus () {
    this.refs.cell.setFocus()
  }

  finalizeCell () {
    this.setState({
      isEditable: false
    })

    this.props.shiftFocus(DOWN)
  }

  makeEditable () {
    this.setState({
      isEditable: true
    })

    setEndOfContenteditable(this.refs.cell.htmlEl)
  }

  // handlers
  handleChange (e) {
    this.setState({
      html: e.target.value
    })
  }

  handleDoubleClick (e) {
    this.makeEditable()
  }

  handleBlur (e) {
    this.setState({
      isEditable: false
    })
  }

  handleKeyDown (e) {
    // in navigation mode
    if (!this.state.isEditable) {
      e.preventDefault()

      if (e.key === 'ArrowDown' || e.key === 'j') {
        this.props.shiftFocus(DOWN)
      }

      if (e.key === 'ArrowUp' || e.key === 'k') {
        this.props.shiftFocus(UP)
      }

      if (e.key === 'ArrowLeft' || e.key === 'h') {
        this.props.shiftFocus(LEFT)
      }

      if (e.key === 'ArrowRight' || e.key === 'l') {
        this.props.shiftFocus(RIGHT)
      }

      if (e.key === 'Enter') {
        if (e.shiftKey) {
          this.finalizeCell()
        } else {
          this.makeEditable()
        }
      }

      return
    }

    // switch to navigation mode
    if (e.key === 'Escape') {
      this.setState({
        isEditable: false
      })
    }

    if (e.key === 'Enter') {
      if (e.shiftKey) {
        this.finalizeCell()
      } else {
        e.preventDefault()
      }
    }
  }

  render () {
    return (
      <CellContent
        tabIndex='-1'
        ref='cell'
        html={this.state.html}
        disabled={!this.state.isEditable}
        onBlur={this.handleBlur.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

export default Cell
