import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

class CellContent extends ContentEditable {
  setFocus () {
    this.htmlEl.focus()
  }
  render() {
    var { tagName, html, ...props } = this.props;

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref: (e) => this.htmlEl = e,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: html}
      },
      this.props.children);
   }
}

class Cell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isEditable: false,
      html: '<div>Yo</div>'
    }
  }

  setFocus () {
    this.refs.cell.setFocus()
  }

  handleChange (e) {
    this.setState({
      html: e.target.value
    })
  }

  handleKeyDown (e) {
    // in navigation mode
    if (!this.state.isEditable) {
      e.preventDefault()

      if (e.key === 'ArrowDown' || e.key === 'j') {
        this.props.shiftFocus('DOWN')
      }

      if (e.key === 'ArrowUp' || e.key === 'k') {
        this.props.shiftFocus('UP')
      }

      if (e.key === 'Enter') {
        if (e.shiftKey) {
          this.props.shiftFocus('DOWN')
        } else {
          this.setState({
            isEditable: true
          })

          this.setEndOfContenteditable(this.refs.cell.htmlEl)
        }
      }

      return
    }

    console.log(e.key)

    // switch to navigation mode
    if (e.key === 'Escape') {
      this.setState({
        isEditable: false
      })
    }
  }

  setEndOfContenteditable (contentEditableElement) {
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
  }

  render () {
    return (
      <CellContent
        tabIndex='-1'
        ref='cell'
        html={this.state.html}
        disabled={!this.state.isEditable}
        onKeyDown={this.handleKeyDown.bind(this)}
        onChange={this.handleChange.bind(this)}
      />
    )
  }
}

export default Cell
