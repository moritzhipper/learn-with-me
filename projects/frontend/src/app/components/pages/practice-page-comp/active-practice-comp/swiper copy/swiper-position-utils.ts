import { CardState, CardVM, Dimension, GuessState, Position } from './swiper'

export const cardPositions: Record<CardState, Position> = {
  right: { x: 85, y: -85 },
  wrong: { x: -85, y: -85 },
  activeShown: { x: 0, y: 0 },
  activeHidden: { x: 0, y: 15 },
  unanswered: { x: 0, y: 65 }
}
// TODO
// cool v view on end
// better vis unanswered hiding
// last card?
export const addPositionsToCards = (
  cards: Omit<CardVM, 'position'>[],
  guessableIndex: number,
  guessState: GuessState,
  hostDimension: Dimension
): CardVM[] => {
  let rightIndex = 0
  let wrongIndex = 0
  let unansweredIndex = 0

  return cards.map((card) => {
    if (card.state !== 'unanswered') {
      const position = toRelPercent(cardPositions[card.state], hostDimension)
      return { ...card, position }
    }

    // spread unanswered cards in direction bottom
    const guessStateMultiplier = guessState === 'guessing' ? 0 : 10

    const pos = {
      x: cardPositions.unanswered.x,
      y: (guessableIndex - card.index + 1) * -2 + guessStateMultiplier + cardPositions.unanswered.y
    }
    const position = toRelPercent(pos, hostDimension)

    return {
      ...card,
      position
    }
  })
}

export const toRelPercent = ({ x, y }: Position, hostDimension: Dimension): Position => ({
  x: x * 0.01 * hostDimension.width,
  y: y * 0.01 * hostDimension.height
})

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
