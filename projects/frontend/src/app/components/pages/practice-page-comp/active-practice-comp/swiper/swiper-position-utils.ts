import { UserLearnable } from '@shared/types'
import { CardPosition, CardState, CardVM, Dimension } from './swiper'

export const cardBaseLayout: Record<CardState, CardPosition> = {
  right: { x: 110, y: 50, rotate: -5 },
  wrong: { x: -110, y: 50, rotate: 5 },
  activeShown: { x: 0, y: 0, rotate: 0 },
  activeHidden: { x: 0, y: 15, rotate: 0 },
  unansweredHidden: { x: 5, y: 50, rotate: -8 },
  unansweredShown: { x: 5, y: 90, rotate: -14 },
  unanswered: { x: 35, y: 98, rotate: -4 }
}
// TODO
// cool v view on end
// better vis unanswered hiding
// last card?
export const addPositionsForOngoingPractice = (
  cards: Omit<CardVM, 'position'>[],
  hostDimension: Dimension
): CardVM[] => {
  const CARD_STACK_OFFSET = 0.4

  let rightIndex = 0
  let wrongIndex = 0
  let unansweredIndex = 0

  return cards.map((card) => {
    let position: CardPosition = cardBaseLayout.unanswered

    if (card.state === 'activeHidden' || card.state === 'activeShown') {
      position = cardBaseLayout[card.state]
    } else if (card.state === 'right') {
      const { x, y, rotate } = cardBaseLayout.right
      position = {
        x,
        y: y + rightIndex * -CARD_STACK_OFFSET,
        rotate: rotate + rotationFromCard(card.card)
      }
      rightIndex -= 1
    } else if (card.state === 'wrong') {
      const { x, y, rotate } = cardBaseLayout.wrong
      position = {
        x,
        y: y + wrongIndex * -CARD_STACK_OFFSET,
        rotate: rotate + rotationFromCard(card.card)
      }
      wrongIndex -= 1
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
        y: y + unansweredIndex * CARD_STACK_OFFSET
      }
    }

    return {
      ...card,
      position: toRelPercent(position, hostDimension)
    }
  })
}

export const addPositionsForDonePractice = (
  cards: Omit<CardVM, 'position'>[],
  hostDimension: Dimension
): CardVM[] => {
  const MAX_ROTATION = 50
  const MAX_X_OFFSET = 40

  const len = cards.length
  const isOdd = len % 2

  const leftSideCardsCount = Math.ceil(len / 2)
  const rightSideCardsCount = len - leftSideCardsCount

  const leftStepSizeY = 100 / leftSideCardsCount
  const rightStepSizeY = 100 / rightSideCardsCount

  const leftStepSizeRotation = (MAX_ROTATION / leftSideCardsCount) * -1
  const rightStepSizeRotation = MAX_ROTATION / rightSideCardsCount

  const leftStepSizeX = MAX_X_OFFSET / leftSideCardsCount
  const rightStepSizeX = MAX_X_OFFSET / rightSideCardsCount

  let leftIndex = 0
  let rightIndex = 0

  return cards.map((card) => {
    let position: CardPosition = {
      x: 0,
      y: 0,
      rotate: 0
    }

    if (leftIndex <= leftSideCardsCount) {
      position = {
        x: -100 + leftIndex * leftStepSizeX,
        y: leftIndex * leftStepSizeY,
        rotate: 2 + leftIndex * leftStepSizeRotation
      }
      leftIndex += 1
    } else {
      position = {
        x: 100 - rightIndex * rightStepSizeX,
        y: rightIndex * rightStepSizeY,
        rotate: -2 + rightIndex * rightStepSizeRotation
      }
      rightIndex += 1
    }
    return {
      ...card,
      position: toRelPercent(position, hostDimension)
    }
  })
}

// Placement helpers
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
