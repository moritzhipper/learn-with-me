import { UserLearnable } from '@shared/types'
import { CardPosition, CardState, CardVM, Dimension, GuessState } from './swiper'

export const cardBaseLayout: Record<CardState, CardPosition> = {
  right: { x: 85, y: -85, rotate: 0 },
  wrong: { x: -85, y: -85, rotate: 0 },
  activeShown: { x: 0, y: 0, rotate: 0 },
  activeHidden: { x: 0, y: 15, rotate: 0 },
  unansweredHidden: { x: 5, y: 50, rotate: -8 },
  unansweredShown: { x: 5, y: 90, rotate: -14 },
  unanswered: { x: 35, y: 98, rotate: -8 }
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
        position = cardBaseLayout[card.state]
      } else if (card.state === 'right') {
        const { x, y, rotate } = cardBaseLayout.right
        position = { x, y, rotate: rotationFromCard(card.card) }
      } else if (card.state === 'wrong') {
        position = cardBaseLayout.wrong
      } else if (card.state === 'unansweredHidden') {
        position = cardBaseLayout.unansweredHidden
        unansweredIndex += 1
      } else if (card.state === 'unansweredShown') {
        position = cardBaseLayout.unansweredShown
        unansweredIndex += 1
      } else {
        const { x, y, rotate } = cardBaseLayout.unanswered
        unansweredIndex += 1
        position = {
          x,
          rotate: rotate + rotationFromCard(card.card),
          y: y + unansweredIndex * 0.4
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

// Assumes in value is positive
// Projects value to another range and centers it around 0
// E.g.: value 2 of range 10 projects to value 3 of range 15 and will be returned as value 1.5 because we center the out range around 0
const projectAndCenter = (value: number, inValueRange: number, outValueRange: number): number => {
  return (value / (inValueRange - 1)) * outValueRange - outValueRange / 2
}

// Create a through reactive events unchanched semi random rotation, as it is based on a semistatic value
const rotationFromCard = (card: UserLearnable): number => {
  const charCodeSum = `${card.lexeme}${card.translation}${card.notes}`
    .split('')
    .reduce((prev, char) => prev + char.charCodeAt(0), 0)

  const lowRotationRange = 2
  const highRotationRange = 14
  // Reduces rotation of this percentage of cards (not completely right as this approach is not completely random, but enough fir this case)
  const lowRotPercentage = 0.8

  const modFactor = 222

  const lowRotThreshold = modFactor * lowRotPercentage
  const mod = charCodeSum % modFactor

  if (mod < lowRotThreshold) {
    return projectAndCenter(mod, lowRotThreshold, lowRotationRange)
  } else {
    return projectAndCenter(mod - lowRotThreshold, modFactor - lowRotThreshold, highRotationRange)
  }
}
