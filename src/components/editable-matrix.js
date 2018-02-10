import React, { Component } from 'react'
import faker from 'faker'
import md5 from 'md5'

import Cell from './cell'
import { idGenerator } from '../utils/utils'
import { UP, DOWN, LEFT, RIGHT } from './constants'

class EditableMatrix extends Component {
  constructor (props) {
    super(props)

    const numRows = 20
    const numCols = 3

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

  updatePosition (step) {
    const newPosition = this.state.currentPosition

    // step as far as possible, but stay within specified ranges
    newPosition[0] += step[0]
    newPosition[0] = Math.min(newPosition[0], this.state.numRows - 1)
    newPosition[0] = Math.max(newPosition[0], 0)

    newPosition[1] += step[1]
    newPosition[1] = Math.min(newPosition[1], this.state.numCols - 1)
    newPosition[1] = Math.max(newPosition[1], 0)

    this.setState({
      currentPosition: newPosition
    })
  }

  shiftFocus (direction) {
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

    this.updatePosition(step)
    this.updateFocus()
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
  renderCells (i) {
    const cells = []

    // the first cell has the row id
    const idCell = <td key={[i, -1].toString()}>{i}</td>
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
          {this.renderCells(i)}
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
