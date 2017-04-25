// @flow
import React, { Component } from 'react'
import update from 'react/lib/update'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { name } from 'faker'
import Card from './Card'

const style = {
  width: 400
}

class Container extends Component {
  state = {
    cardsById: {},
    cardsByIndex: []
  }

  constructor (props) {
    super(props)

    const { cardsById, cardsByIndex } = this.state

    for (let i = 0; i < 1000; i += 1) {
      const card = { id: i, text: name.findName() }
      cardsById[card.id] = card
      cardsByIndex[i] = card
    }
  }

  moveCard (id, afterId) {
    const { cardsById, cardsByIndex } = this.state

    const card = cardsById[id]
    const afterCard = cardsById[afterId]

    const cardIndex = cardsByIndex.indexOf(card)
    const afterIndex = cardsByIndex.indexOf(afterCard)

    this.scheduleUpdate({
      cardsByIndex: {
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card]
        ]
      }
    })
  }

  moveCard = this.moveCard.bind(this)

  pendingUpdateFn = null

  requestedFrame = 0

  componentWillUnmount () {
    if (0 !== this.requestedFrame) {
      cancelAnimationFrame(this.requestedFrame)
    }
  }

  
  scheduleUpdate (updateFn) {
    this.pendingUpdateFn = updateFn

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame)
    }
  }

  drawFrame () {
    const nextState = update(this.state, this.pendingUpdateFn)
    this.setState(nextState)

    this.pendingUpdateFn = null
    this.requestedFrame = 0
  }

  drawFrame = this.drawFrame.bind(this)

  render () {
    const { cardsByIndex } = this.state

    return (
      <div style={style}>
        {cardsByIndex.map(card => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
          />
        ))}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Container)
