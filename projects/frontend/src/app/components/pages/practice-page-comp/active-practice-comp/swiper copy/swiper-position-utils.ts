import { CardPosition, CardState, CardVM, Dimension, GuessState } from './swiper'

export const cardBaseLayout: Record<CardState, CardPosition> = {
  right: { x: 85, y: -85, rotate: 0 },
  wrong: { x: -85, y: -85, rotate: 0 },
  activeShown: { x: 0, y: 0, rotate: 0 },
  activeHidden: { x: 0, y: 15, rotate: 0 },
  unanswered: { x: 17, y: 60, rotate: -10 }
}
// TODO
// cool v view on end
// better vis unanswered hiding
// last card?
export const addPositionsToCards = (
  cards: Omit<CardVM, 'position'>[],
  guessState: GuessState,
  hostDimension: Dimension
): CardVM[] => {
  let rightIndex = 0
  let wrongIndex = 0
  let unansweredIndex = 0

  return cards
    .map((card) => {
      let position: CardPosition = cardBaseLayout.unanswered

      if (card.state === 'activeHidden' || card.state === 'activeShown') {
        position = { ...cardBaseLayout[card.state] }
      } else if (card.state === 'right') {
        position = cardBaseLayout.right
      } else if (card.state === 'wrong') {
        position = cardBaseLayout.wrong
      } else {
        const guessStateMultiplier = guessState === 'guessing' ? 0 : 10

        position = {
          ...cardBaseLayout.unanswered,
          y: cardBaseLayout.unanswered.y + guessStateMultiplier + unansweredIndex++ * 1
        }
      }

      return {
        ...card,
        position
      }
    })
    .map((card) => ({
      ...card,
      position: toRelPercent(card.position, hostDimension)
    }))
}

export const toRelPercent = (
  { x, y, rotate }: CardPosition,
  hostDimension: Dimension
): CardPosition => ({
  rotate,
  x: x * 0.01 * hostDimension.width,
  y: y * 0.01 * hostDimension.height
})

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
