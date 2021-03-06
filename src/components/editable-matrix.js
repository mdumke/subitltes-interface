import React, { Component } from 'react'
import faker from 'faker'
import md5 from 'md5'

import Cell from './cell'
import { idGenerator } from '../utils/utils'
import { UP, DOWN, LEFT, RIGHT } from './constants'

class EditableMatrix extends Component {
  constructor (props) {
    super(props)

    const numRows = 30
    const numCols = 2

    this.idGenerator = idGenerator(numRows * numCols)

    this.state = {
      currentPosition: [0, 0],
      numRows,
      numCols,
      tableData: this.createTableData(numRows, numCols)
    }

    this.tableHeadings = this.createTableHeadings()
  }

  // lifecycle methods
  componentDidMount () {
    this.updateFocus()
  }

  // helper methods
  updateFocus () {
    const position = this.state.currentPosition.toString()
    this.refs[`position(${position})`].setFocus()
  }

  setPosition (i, j) {
    const pos = this.state.currentPosition

    if (pos[0] !== i || pos[1] !== j) {
      this.setState({
        currentPosition: [i, j]
      })
    }
  }

  // sets the new position on the state
  //
  // @param {Array(number)} step - the direction to go to
  // @param {object} options - specifies behavior after update
  // @param {boolean} options.allowRowInsert - if true, appends row if at the end
  updatePosition (step, options = {}) {
    let [row, col] = this.state.currentPosition

    const appendRow =
      options.allowRowInsert &&
      row === this.state.numRows - 1 &&
      step[0] > 0

    if (appendRow) {
      this.insertRow(row++)
    } else {
      // step as far as possible, but stay within specified ranges
      row += step[0]
      row = Math.min(row, this.state.numRows - 1)
      row = Math.max(row, 0)

      col += step[1]
      col = Math.min(col, this.state.numCols - 1)
      col = Math.max(col, 0)
    }

    this.setState({
      currentPosition: [row, col]
    }, this.updateFocus)
  }

  shiftFocus (direction, options = {}) {
    let step

    switch (direction) {
      case DOWN:
        step = [1, 0]
        break
      case UP:
        step = [-1, 0]
        break
      case LEFT:
        step = [0, -1]
        break
      case RIGHT:
        step = [0, 1]
        break
      default:
        console.warn(`direction ${direction} not recognized`)
        step = [0, 0]
    }

    this.updatePosition(step, options)
  }

  insertRow (rowId) {
    const data = [...this.state.tableData]

    const newRow = []

    for (let i = 0; i < this.state.numCols; i++) {
      newRow.push({
        key: md5(Math.random()),
        text: ''
      })
    }

    data.splice(rowId + 1, 0, newRow)

    this.setState({
      numRows: this.state.numRows + 1,
      tableData: data
    })
  }

  handleChange ([i, j], newText) {
    const newData = [...this.state.tableData]

    newData[i][j].text = newText

    this.setState({
      tableData: newData
    })
  }

  createTableHeadings () {
    const headings = [<th key='-1'></th>]

    for (let i = 0; i < this.state.numCols; i++) {
      headings.push(
        <th key={i}>
          {faker.commerce.productName()}
        </th>
      )
    }

    return headings
  }

  createTableData (numRows, numCols) {
    const data = []

    for (let i = 0; i < numRows; i++) {
      data.push([])

      for (let j = 0; j < numCols; j++) {
        data[i].push({
          key: md5(this.idGenerator.next().value),
          text: faker.hacker.phrase()
        })
      }
    }

    return data
  }

  // renders one row of cells
  renderRow (i) {
    const cells = []

    // the first cell has the row id (correct 0-indexed counting)
    const idCell = <td key={[i, -1].toString()}>{i + 1}</td>
    cells.push(idCell)

    // collect all cells of this rows
    for (let j = 0; j < this.state.numCols; j++) {
      const id = [i, j].toString()

      cells.push(
        <Cell
          key={this.state.tableData[i][j].key}
          position={id}
          setPosition={this.setPosition.bind(this)}
          insertRow={this.insertRow.bind(this)}
          propagateChange={this.handleChange.bind(this)}
          content={this.state.tableData[i][j].text}
          shiftFocus={this.shiftFocus.bind(this)}
          ref={`position(${id})`}
        />
      )
    }

    return cells
  }

  renderRows () {
    const rows = []

    for (let i = 0; i < this.state.numRows; i++) {
      rows.push(
        <tr key={i}>
          {this.renderRow(i)}
        </tr>
      )
    }

    return rows
  }

  render () {
    return (
      <table className='table'>
        <thead>
          <tr>
            {this.tableHeadings}
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }
}

export default EditableMatrix
