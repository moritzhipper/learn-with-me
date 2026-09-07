import { UserLearnable } from '@shared/types'
import { CardPosition, CardState, CardVM, Dimension } from './swiper'

export const cardBaseLayout: Record<CardState, CardPosition> = {
  right: { x: 120, y: 20, rotate: 15 },
  wrong: { x: -120, y: 20, rotate: -15 },
  activeShown: { x: 0, y: 0, rotate: 0 },
  activeHidden: { x: 0, y: 15, rotate: 0 },
  unansweredHidden: { x: 5, y: 50, rotate: -8 },
  unansweredShown: { x: 5, y: 90, rotate: -14 },
  unanswered: { x: 10, y: 95, rotate: -5 }
}
// TODO
// cool v view on end
// better vis unanswered hiding
// last card?
export const addPositionsForOngoingPractice = (
  cards: Omit<CardVM, 'position'>[],
  hostDimension: Dimension
): CardVM[] => {
  return cards.map((card) => {
    let position: CardPosition = cardBaseLayout.unanswered
    const stackedStates: CardState[] = ['right', 'wrong', 'unanswered']

    if (stackedStates.includes(card.state)) {
      const { x, y, rotate } = cardBaseLayout[card.state]
      position = {
        x,
        y,
        rotate: rotate + rotationFromCard(card.card)
      }
    } else {
      position = cardBaseLayout[card.state]
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
  const MAX_ROTATION = 60
  const MAX_X_OFFSET = 35
  const SPREAD_X = 60

  const len = cards.length

  const leftSideCardsCount = Math.ceil(len / 2)
  const rightSideCardsCount = len - leftSideCardsCount

  const leftStepSizeY = SPREAD_X / leftSideCardsCount
  const rightStepSizeY = SPREAD_X / rightSideCardsCount

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
        rotate: 3 + leftIndex * leftStepSizeRotation
      }
      leftIndex += 1
    } else {
      position = {
        x: 100 - rightIndex * rightStepSizeX,
        y: rightIndex * rightStepSizeY,
        rotate: -3 + rightIndex * rightStepSizeRotation
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
  const highRotationRange = 17
  // Reduces rotation of this percentage of cards (not completely right as this approach is not completely random, but enough fir this case)
  const lowRotPercentage = 0.9

  const modFactor = 222

  const lowRotThreshold = modFactor * lowRotPercentage
  const mod = charCodeSum % modFactor

  if (mod < lowRotThreshold) {
    return projectAndCenter(mod, lowRotThreshold, lowRotationRange)
  } else {
    return projectAndCenter(mod - lowRotThreshold, modFactor - lowRotThreshold, highRotationRange)
  }
}
