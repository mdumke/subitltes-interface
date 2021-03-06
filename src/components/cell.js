import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

import { setEndOfContenteditable } from '../utils/utils'
import { UP, DOWN, LEFT, RIGHT } from './constants'

// choose bootstrap alert classes
const colors = {
  default: 'light',
  focussed: 'warning',
  active: 'danger'
}

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
      color: colors.default,
      html: this.props.content
    }
  }

  // helper functions
  setFocus () {
    this.refs.cell.setFocus()
  }

  getPosition () {
    return this.props.position.split(',').map(Number)
  }

  // main cell events
  handleBlur (e) {
    this.setState({
      isEditable: false,
      color: colors.default
    })
  }

  handleFocus (e) {
    this.setState({
      color: colors.focussed
    })
  }

  beginEditing () {
    this.setState({
      isEditable: true,
      color: colors.active
    })

    setEndOfContenteditable(this.refs.cell.htmlEl)
  }

  pauseEditing () {
    this.setState({
      isEditable: false,
      color: colors.focussed
    })
  }

  finalizeCell () {
    this.setState({
      isEditable: false
    }, () => {
      this.props.shiftFocus(DOWN, {
        allowRowInsert: true
      })
    })
  }

  insertRow () {
    this.setState({
      isEditable: false
    })

    this.props.insertRow(this.getPosition()[0])
  }

  handleChange (e) {
    this.setState({
      html: e.target.value
    })

    this.props.propagateChange(this.getPosition(), e.target.value)
  }

  handleClick (e) {
    const [i, j] = this.getPosition()
    this.props.setPosition(i, j)
  }

  handleDoubleClick (e) {
    this.beginEditing()
  }

  handleKeyDown (e) {
    // in navigation mode
    if (!this.state.isEditable) {
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
        e.preventDefault()

        if (e.shiftKey) {
          this.finalizeCell()
        } else if (e.altKey) {
          this.insertRow()
        } else {
          this.beginEditing()
        }
      }

      return
    }

    // switch to navigation mode
    if (e.key === 'Escape') {
      this.pauseEditing()
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      this.finalizeCell()
    }
  }

  render () {
    return (
      <CellContent
        tagName='td'
        tabIndex='-1'
        className={`alert-${this.state.color} ${this.state.isEditable ? 'active' : ''}`}
        ref='cell'
        spellCheck='false'
        html={this.state.html}
        disabled={!this.state.isEditable}
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onClick={this.handleClick.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

export default Cell
