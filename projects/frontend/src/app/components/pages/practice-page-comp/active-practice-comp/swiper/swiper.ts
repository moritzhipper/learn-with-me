import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  linkedSignal
} from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { Guess, PracticeActive, UserLearnable } from '@shared/types'
import { correctAnswerIcon, incorrectAnswerIcon } from '../../../../../icon-registry'
import { LearnablesStore } from '../../../../../store/learnables-store'

type PracticeVM = Pick<PracticeActive, 'guessableField' | 'guessableIndex'> & {
  cards: CardVM[]
}

type CardState = 'activeHidden' | 'activeShown' | Guess

type CardVM = {
  card: UserLearnable
  guess: Guess
  state: CardState
  index: number
  position: Position
}

type Position = {
  x: number
  y: number
}

// eigentlicht reichen diese hier aus als state
const cardPositions: Record<CardState, Position> = {
  right: { x: 200, y: -200 },
  wrong: { x: -200, y: -200 },
  activeHidden: { x: 0, y: 100 },
  activeShown: { x: 0, y: 0 },
  unanswered: { x: 0, y: 150 }
}

type Dimensions = {
  height: number
  width: number
}

type GuessState = 'guessing' | 'voting'

/**
 * Rchitectural patterns
 * - Use vanilla DOM manipulation approach for card and cursor position sync and animations instead of angular signals to reduce calculation overhead and ensure smooth unser interaction
 * - Use angular lifecycle hooks and effects to update card references and template <-> code linking when practice or other related signals change
 * - Guard Click and swipe interaction effect functions inside of the effect callers, not inside off the effects, e.g.: swiping guard in pointerMove, not in setPosition()
 */

@Component({
  selector: 'liz-swiper',
  imports: [NgIcon],
  templateUrl: './swiper.html',
  styleUrl: './swiper.scss'
})
export class Swiper {
  private readonly ls = inject(LearnablesStore)
  protected icons = {
    incorrectAnswerIcon,
    correctAnswerIcon
  }

  // Animation related -------------------------------------------

  private readonly LERP_SPEED_FACTOR = 0.1
  private readonly VOTE_THRESHOLD = 150
  private swiping = false
  private lerping = false
  private animationFrameID = 0

  // Position of activeCard -> will be synced to active card
  position: Position = {
    x: 0,
    y: 0
  }

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private destroyRef = inject(DestroyRef)
  protected swipeableRef: HTMLDivElement | null = null

  // Component state related -------------------------------------------

  practice = computed(() => this.ls.activeBank().practice.active)

  // Show user when guess on pointer up will be registered
  protected castedGuess = linkedSignal<PracticeActive | null, Guess>({
    source: this.practice,
    computation: () => 'unanswered'
  })

  guessState = linkedSignal<PracticeActive | null, GuessState>({
    source: this.practice,
    computation: () => 'guessing'
  })

  vm = computed<PracticeVM | undefined>(() => {
    const practice = this.practice()
    if (!practice) return

    const cards = this.ls.activeBank().learnables
    let cardsVM: CardVM[] = []

    practice.guessables.forEach((guessable, index) => {
      const card = cards.find((c) => c.id === guessable.id)
      if (!card) return
      const offset = practice.guessableIndex - index
      const state = this.getCardState(offset, this.guessState(), guessable.guess)

      cardsVM.push({
        card,
        index,
        state,
        guess: guessable.guess,
        position: this.getCardPosition(state, offset)
      })
    })

    return {
      cards: cardsVM,
      guessableField: practice.guessableField,
      guessableIndex: practice.guessableIndex
    }
  })

  // used as hook to update the active card ref
  private readonly guessIndex = computed(() => {
    const practice = this.practice()
    if (!practice) return 0
    return practice.guessableIndex
  })

  constructor() {
    afterNextRender(() => {
      this.hostEl.addEventListener('pointerup', this.pointerUp)
      this.hostEl.addEventListener('pointermove', this.pointerMove)
      this.hostEl.addEventListener('pointerdown', this.pointerDown)
      this.document.addEventListener('keydown', this.keydown)
    })

    this.destroyRef.onDestroy(() => {
      this.hostEl.removeEventListener('pointerup', this.pointerUp)
      this.hostEl.removeEventListener('pointermove', this.pointerMove)
      this.hostEl.removeEventListener('pointerdown', this.pointerDown)
      this.document.removeEventListener('keydown', this.keydown)

      this.cancelLerpLoop()
    })

    // Sets ref to active card when a new card becomes active after a vote was counted
    afterRenderEffect(() => {
      this.swipeableRef = this.hostEl.querySelector<HTMLDivElement>(
        `[card-index="${this.guessIndex()}"]`
      )
    })

    // Syncs the local cardRefPointer to the real active card position
    effect(() => {
      const activeCardPos = this.vm()?.cards.find((c) => c.state === 'activeShown')?.position
      if (!activeCardPos) return
      this.setPosition(activeCardPos)
    })

    // 'guessing' -> 'voting': Animates active card into revealead position using manual lerp so it can be interrupted by the user through vote or drag
    // 'voting' -> 'guessing': Stops manual lerp to hand over the animation to guessed card stack to browser renderer
    effect(() => {
      const state = this.guessState()

      if (state === 'voting') {
        this.lerpTo(cardPositions.activeShown)
      } else {
        this.cancelLerpLoop()
      }
    })
  }

  private pointerDown = (ev: PointerEvent) => {
    console.log('down')
    if (!this.swiping && this.guessState() === 'voting') {
      this.hostEl.setPointerCapture(ev.pointerId)
      this.cancelLerpLoop()
      this.swiping = true
      this.hostEl.classList.add('swiping')
    }
  }

  private pointerMove = (ev: PointerEvent) => {
    if (this.swiping && this.guessState() === 'voting' && this.swipeableRef) {
      const newPos = {
        x: this.position.x + ev.movementX,
        y: this.position.y + ev.movementY
      }

      this.setPosition(newPos)
      this.castGuessIfThreshold()
    }
  }

  private pointerUp = (ev: PointerEvent) => {
    console.log('up')
    if (this.swiping && this.guessState() === 'voting') {
      this.swiping = false
      this.hostEl.releasePointerCapture(ev.pointerId)
      this.countGuessIfThreshold()
      this.hostEl.classList.remove('swiping')
    } else {
      this.guessState.set('voting')
    }
  }

  private keydown = (ev: KeyboardEvent) => {
    const state = this.guessState()
    if (ev.key === 'ArrowUp' && state === 'guessing') {
      this.guessState.set('voting')
    } else if (ev.key === 'ArrowLeft' && state === 'voting') {
      this.guess('wrong')
    } else if (ev.key === 'ArrowRight' && state === 'voting') {
      this.guess('right')
    }
  }

  // DANGER: High freqnecy call rate, manipulation can have a high performance and lerp smoothness impact
  private setPosition(pos: Position) {
    this.position = pos
    if (!this.swipeableRef) return
    this.swipeableRef.style.setProperty('--x', `${pos.x}px`)
    this.swipeableRef.style.setProperty('--y', `${pos.y}px`)
  }

  // Cancel loop and apply goal when position is reached
  // Offset is applied as pixel value -> end when applying goal woud not create UI flicker
  private lerpLoop(pos: Position) {
    const offset = Math.abs(this.position.x - pos.x + this.position.y - pos.y)

    if (offset < 0.1) {
      this.setPosition(pos)
      this.lerping = false
      console.log('lerp done')
    } else {
      const newPos: Position = {
        x: this.lerp(this.position.x, pos.x),
        y: this.lerp(this.position.y, pos.y)
      }
      this.setPosition(newPos)
      this.animationFrameID = requestAnimationFrame(() => this.lerpLoop(pos))
    }
  }
  private cancelLerpLoop() {
    cancelAnimationFrame(this.animationFrameID)
  }

  private lerpTo(pos: Position) {
    if (this.lerping) {
      console.log('lerp interrupted')
      this.cancelLerpLoop()
    }
    console.log('lerp start')

    this.lerping = true
    this.lerpLoop(pos)
  }

  private lerp(start: number, end: number): number {
    return start + (end - start) * this.LERP_SPEED_FACTOR
  }

  quit() {
    this.ls.resetPracticeAndSaveToHistory()
  }

  castGuessIfThreshold() {
    const guess = this.deductGuessFromOffset(this.position.x)
    this.castedGuess.set(guess)
  }

  countGuessIfThreshold() {
    if (this.guessState() === 'guessing') return
    const guess = this.deductGuessFromOffset(this.position.x)
    if (guess !== 'unanswered') {
      this.guess(guess)
    } else {
      this.lerpTo(cardPositions.activeShown)
    }
  }

  guess(guess: Guess) {
    this.ls.setGuessToPractice(guess)
  }

  private deductGuessFromOffset(xOffset: number): Guess {
    if (xOffset > this.VOTE_THRESHOLD) {
      return 'right'
    } else if (xOffset < this.VOTE_THRESHOLD * -1) {
      return 'wrong'
    } else {
      return 'unanswered'
    }
  }

  private getCardState(offset: number, guessState: GuessState, guess: Guess): CardState {
    if (guess === 'right') {
      return 'right'
    } else if (guess === 'wrong') {
      return 'wrong'
    } else if (offset === 0 && guessState === 'guessing') {
      return 'activeHidden'
    } else if (offset === 0 && guessState === 'voting') {
      return 'activeShown'
    }
    return 'unanswered'
  }

  private getCardPosition(state: CardState, offset: number): Position {
    if (state !== 'unanswered' && state !== 'activeShown') {
      return cardPositions[state]
    } else if (state === 'activeShown' && this.swipeableRef) {
      // reads realtime transform values applied by browser, also returns correct values if animation ongoing
      const transform = getComputedStyle(this.swipeableRef).transform
      const matrix = new DOMMatrixReadOnly(transform)

      // e and f are indexes of transform translate x and y
      return { x: matrix.e, y: matrix.f }
    }

    // spread unanswered cards in direction bottom
    const { x, y } = cardPositions.unanswered

    return {
      x,
      y: y + offset * -20 + 100
    }
  }
}
