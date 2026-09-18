import { Guess, PracticeConfig } from '@shared/types'

export type PracticeSummary = {
  type: PracticeConfig['type']
  createdAt: Date
  // Each card can be guessed multiple times, while each Summary holds n guesses for n cards in set -> Allows repetition of not right guesses to improve practice rating
  guesses: Record<Guess, number>
  // Kept for statistical reasons, not to be displayed in direct practice summary
  swipeCount: number
}
