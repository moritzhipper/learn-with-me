import { UserLearnable } from '@shared/types'
import { CardPosition, CardState, CardVM, Dimension, GuessState } from './swiper'

export const cardBaseLayout: Record<CardState, CardPosition> = {
  right: { x: 85, y: -85, rotate: 0 },
  wrong: { x: -85, y: -85, rotate: 0 },
  activeShown: { x: 0, y: 0, rotate: 0 },
  activeHidden: { x: 0, y: 15, rotate: 0 },
  unanswered: { x: 5, y: 85, rotate: -10 }
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
        const shouldHideActiveCard = guessState === 'guessing' && unansweredIndex === 0
        const offset = shouldHideActiveCard ? -25 : 0
        const shouldRotate = unansweredIndex > 0
        const rotate = shouldRotate ? rotationFromCard(card.card) : 0
        position = {
          ...cardBaseLayout.unanswered,
          rotate: cardBaseLayout.unanswered.rotate + rotate,
          y: cardBaseLayout.unanswered.y + offset + unansweredIndex++ * 0.5
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

// used to create a through reactive events unchanched semi random rotation, as it is based on a semistatic value
const rotationFromCard = (card: UserLearnable): number => {
  const charCodeSum = `${card.lexeme}${card.translation}${card.notes}`
    .split('')
    .reduce((prev, char) => prev + char.charCodeAt(0), 0)

  const rotationRange = 12
  const modFactor = 222
  // reduces rotation of percentage affected assuming modulo is 100% random (it isnt though, but for this case its good enough)
  const lowRotPercentage = 0.7

  const lowRotThreshold = modFactor * lowRotPercentage

  const mod = charCodeSum % modFactor

  // make rotation under threshold more subtle, normalize between -1 and 1
  if (mod < lowRotThreshold) {
    const normalized = mod / lowRotThreshold

    // center around 0
    return 1 - normalized * 2
  } else {
    // spread rest in full range around center
    const floorShifted = mod - lowRotThreshold
    const normalized = floorShifted / (modFactor - lowRotThreshold)
    const spread = normalized * rotationRange

    // center around 0
    return spread - rotationRange / 2
  }
}
