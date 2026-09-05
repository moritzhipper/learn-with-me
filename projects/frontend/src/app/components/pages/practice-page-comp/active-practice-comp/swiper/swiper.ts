import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  linkedSignal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgIcon } from '@ng-icons/core'
import { Guess, PracticeActive, UserLearnable } from '@shared/types'
import { debounceTime, map, Subject } from 'rxjs'
import {
  correctAnswerIcon,
  incorrectAnswerIcon,
  practiceSpeedIcon
} from '../../../../../icon-registry'
import { LearnablesStore } from '../../../../../store/learnables-store'
import { SwiperSummary } from '../swiper-summary/swiper-summary'
import { addPositionsToCards, cardBaseLayout } from './swiper-position-utils'

type PracticeVM = Pick<PracticeActive, 'guessableField' | 'guessableIndex'> & {
  cardVMs: CardVM[]
}

export type CardState =
  'activeHidden' | 'activeShown' | 'unansweredShown' | 'unansweredHidden' | Guess

type VMStats = {
  wrong: number
  right: number
  unanswered: number
}

export type CardVM = {
  card: UserLearnable
  guess: Guess
  state: CardState
  index: number
  position: CardPosition
  stats: VMStats
}

export type Position = {
  x: number
  y: number
}

export type CardPosition = Position & {
  rotate: number
}

export type GuessState = 'guessing' | 'voting' | 'done'

export type Dimension = {
  width: number
  height: number
}

/**
 * Rchitectural patterns
 * - Use vanilla DOM manipulation approach for card and cursor position sync and animations instead of angular signals to reduce calculation overhead and ensure smooth unser interaction
 * - Use angular lifecycle hooks and effects to update card references and template <-> code linking when practice or other related signals change
 * - Guard Click and swipe interaction effect functions inside of the effect callers, not inside off the effects, e.g.: swiping guard in pointerMove, not in setPosition()
 */
@Component({
  selector: 'liz-swiper',
  imports: [NgIcon, SwiperSummary],
  templateUrl: './swiper.html',
  styleUrl: './swiper.scss',
  host: {
    '[attr.casted-guess]': 'castedGuess()'
  }
})
export class Swiper {
  private readonly ls = inject(LearnablesStore)
  protected icons = {
    incorrectAnswerIcon,
    correctAnswerIcon,
    practiceSpeedIcon
  }

  // Animation related -------------------------------------------

  private readonly VOTE_THRESHOLD = 150
  private swiping = false

  // Position of activeCard -> will be synced to active card
  position: Position = {
    x: 0,
    y: 0
  }

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly window = inject(DOCUMENT).defaultView
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
    computation: (practice) => {
      const isDone = practice?.guessableIndex === practice?.guessables.length
      return isDone ? 'done' : 'guessing'
    }
  })

  // Signal / rerender friendly approach to provide the host dimensions reactively
  private readonly calcDimSubj$ = new Subject<void>()
  protected hostDimension = toSignal(
    this.calcDimSubj$.pipe(
      debounceTime(100),
      map(() => ({
        width: this.hostEl.clientWidth,
        height: this.hostEl.clientHeight
      }))
    )
  )

  vm = computed<PracticeVM | undefined>(() => {
    const practice = this.practice()
    const hostDim = this.hostDimension()
    if (!practice || !hostDim) return

    const cards = this.ls.activeBank().learnables
    let cardVMs: Omit<CardVM, 'position'>[] = []
    const guessState = this.guessState()

    const stats: VMStats = {
      right: practice.guessables.filter((g) => g.guess === 'right').length,
      wrong: practice.guessables.filter((g) => g.guess === 'wrong').length,
      unanswered: practice.guessables.filter((g) => g.guess === 'unanswered').length
    }

    practice.guessables.forEach((guessable, index) => {
      const card = cards.find((c) => c.id === guessable.id)
      if (!card) return

      const offset = practice.guessableIndex - index
      const cardState = this.getCardState(offset, guessState, guessable.guess)

      cardVMs.push({
        card,
        index,
        stats,
        state: cardState,
        guess: guessable.guess
      })
    })

    const cardsVMPos = addPositionsToCards(cardVMs, hostDim)

    return {
      cardVMs: cardsVMPos,
      guessableField: practice.guessableField,
      guessableIndex: practice.guessableIndex
    }
  })

  constructor() {
    afterNextRender(() => {
      this.hostEl.addEventListener('pointerup', this.pointerUp)
      this.hostEl.addEventListener('pointermove', this.pointerMove)
      this.hostEl.addEventListener('pointerdown', this.pointerDown)

      this.window?.addEventListener('resize', this.resize)
      this.window?.addEventListener('keydown', this.keydown)

      this.calcDimSubj$.next()
    })

    this.destroyRef.onDestroy(() => {
      this.hostEl.removeEventListener('pointerup', this.pointerUp)
      this.hostEl.removeEventListener('pointermove', this.pointerMove)
      this.hostEl.removeEventListener('pointerdown', this.pointerDown)

      this.window?.removeEventListener('resize', this.resize)
      this.window?.removeEventListener('keydown', this.keydown)
    })

    // Sets ref to active card when a the viewmodel holding it changes
    afterRenderEffect(() => {
      this.swipeableRef = this.hostEl.querySelector<HTMLDivElement>(
        `[card-index="${this.vm()?.guessableIndex ?? 0}"]`
      )
    })
  }

  // fat arrow for event callback to allow remove function memory cleanup unrelated to this class's lifecycle
  private pointerDown = (ev: PointerEvent) => {
    console.log('down')
    if (!this.swiping && this.guessState() === 'voting') {
      this.swiping = true
      this.syncCardPosToLocalPos()
      this.hostEl.setPointerCapture(ev.pointerId)
      // manually add and remove class instead of angulaar template binding
      // because timing and order matters and is hard to sync with mixed vanilla / ng approach
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
    const guessState = this.guessState()
    if (this.swiping && guessState === 'voting') {
      this.swiping = false
      this.hostEl.releasePointerCapture(ev.pointerId)
      this.countGuessIfThreshold()

      // manually add and remove class instead of angulaar template binding
      // because timing and order matters and is hard to sync with mixed vanilla / ng approach
      this.hostEl.classList.remove('swiping')
      this.setPosition(cardBaseLayout.activeShown)
    } else if (guessState === 'guessing') {
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

  private resize = () => {
    this.calcDimSubj$.next()
  }

  // DANGER: High freqnecy call rate, manipulation can have a high performance and lerp smoothness impact
  private setPosition(pos: Position) {
    this.position = pos
    if (!this.swipeableRef) return
    this.swipeableRef.style.setProperty('--x', `${pos.x}px`)
    this.swipeableRef.style.setProperty('--y', `${pos.y}px`)
    // fake rotation coming from card sticking to swiping thumb of user
    this.swipeableRef.style.setProperty('--rotate', `${pos.x * 0.02}deg`)
  }

  finish() {
    this.ls.resetPracticeAndSaveToHistory()
  }

  giveUp() {
    this.ls.endPracticePrematurely()
  }

  castGuessIfThreshold() {
    const guess = this.deductGuessFromOffset(this.position.x)

    // guard like this, because this funcion is called in high freq pointer move and would otherwise
    // set a signal in same frequency, leading to higher angular performance overhead.
    // this approach only casts a guess per state change
    if (guess !== this.castedGuess()) {
      this.castedGuess.set(guess)
    }
  }

  countGuessIfThreshold() {
    if (this.guessState() === 'guessing') return
    const guess = this.deductGuessFromOffset(this.position.x)
    if (guess !== 'unanswered') {
      this.guess(guess)
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
    } else if (offset === -1 && guessState === 'voting') {
      return 'unansweredShown'
    } else if (offset === -1 && guessState === 'guessing') {
      return 'unansweredHidden'
    }
    return 'unanswered'
  }

  private syncCardPosToLocalPos() {
    if (this.swipeableRef) {
      const transform = getComputedStyle(this.swipeableRef).transform
      const matrix = new DOMMatrixReadOnly(transform)
      // e and f are indexes of transform translate x and y
      this.setPosition({ x: matrix.e, y: matrix.f })
    }
  }
}
