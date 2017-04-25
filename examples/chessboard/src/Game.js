// @flow
let knightPosition = [1, 7]
let observer = null

function emitChange () {
  if (null != observer) {
    observer(knightPosition)
  }
}

export function observe (o: (Array<number>) => void) {
  if (observer) {
    throw new Error('Multiple observers not implemented.')
  }

  observer = o
  emitChange()

  return () => {
    observer = null
  }
}

export function canMoveKnight (toX: number, toY: number) {
  const [x, y] = knightPosition
  const dx = toX - x
  const dy = toY - y

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2)
}

export function moveKnight (toX: number, toY: number) {
  knightPosition = [toX, toY]
  emitChange()
}
