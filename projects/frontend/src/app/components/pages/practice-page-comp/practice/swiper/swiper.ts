import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  linkedSignal
} from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { Guess, PracticeActive, UserLearnable } from '@shared/types'
import {
  collapseIcon,
  correctAnswerIcon,
  incorrectAnswerIcon,
  practiceSpeedIcon
} from '../../../../../icon-registry'
import { ModalService } from '../../../../../services/modal-service'
import { LearnablesStore } from '../../../../../store/learnables-store'
import { LarryBig } from '../../../../shared/larries/larry-big/larry-big'

export type CardVM = {
  card: UserLearnable
  guess: Guess
  offsetToActive: number
}

export type Position = {
  x: number
  y: number
}

export type GuessState = 'guessing' | 'voting' | 'done'

/**
 * Rchitectural patterns
 * - Use vanilla DOM manipulation approach for card and cursor position sync and animations instead of angular signals to reduce calculation overhead and ensure smooth unser interaction
 * - Use angular lifecycle hooks and effects to update card references and template <-> code linking when practice or other related signals change
 * - Guard Click and swipe interaction effect functions inside of the effect callers, not inside off the effects, e.g.: swiping guard in pointerMove, not in setPosition()
 */
@Component({
  selector: 'liz-swiper',
  imports: [NgIcon, LarryBig],
  templateUrl: './swiper.html',
  styleUrl: './swiper.scss',
  host: {
    '[attr.casted-guess]': 'castedGuess()',
    '[attr.guess-state]': 'guessState()'
  }
})
export class Swiper {
  private readonly ls = inject(LearnablesStore)
  protected icons = {
    incorrectAnswerIcon,
    correctAnswerIcon,
    practiceSpeedIcon,
    collapseIcon
  }

  // Animation related -------------------------------------------

  private readonly VOTE_THRESHOLD = 100
  protected swiping = false

  // Position of activeCard -> will be synced to active card
  position: Position = {
    x: 0,
    y: 0
  }

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly window = inject(DOCUMENT).defaultView
  private destroyRef = inject(DestroyRef)
  private modals = inject(ModalService)

  // Component state related -------------------------------------------

  // Larry will never leave the view!
  larryCardIndex = computed(() => {
    const practice = this.practice()
    if (!practice) return 1
    return practice.guessableIndex - practice.guessables.length
  })

  practice = computed(() => this.ls.activeBank().practice.active)

  // Show user when guess on pointer up will be registered
  protected castedGuess = linkedSignal<PracticeActive | null, Guess>({
    source: this.practice,
    computation: () => 'unanswered'
  })

  protected guessState = linkedSignal<PracticeActive | null, GuessState>({
    source: this.practice,
    computation: (practice) => {
      if (practice && !practice.isFinished) return 'guessing'
      return 'done'
    }
  })

  protected cards = computed<CardVM[]>(() => {
    const practice = this.practice()
    if (!practice) return []

    const cards = this.ls.activeBank().learnables
    let cardVMs: Omit<CardVM, 'position'>[] = []

    practice.guessables.forEach((guessable, index) => {
      const card = cards.find((c) => c.id === guessable.id)
      if (!card) return

      const offsetToActive = practice.guessableIndex - index

      cardVMs.push({
        card,
        offsetToActive,
        guess: guessable.guess
      })
    })

    return cardVMs
  })

  constructor() {
    afterNextRender(() => {
      this.hostEl.addEventListener('pointerup', this.pointerUp)
      this.hostEl.addEventListener('pointermove', this.pointerMove)
      this.hostEl.addEventListener('pointerdown', this.pointerDown)

      this.window?.addEventListener('keydown', this.keydown)
    })

    this.destroyRef.onDestroy(() => {
      this.hostEl.removeEventListener('pointerup', this.pointerUp)
      this.hostEl.removeEventListener('pointermove', this.pointerMove)
      this.hostEl.removeEventListener('pointerdown', this.pointerDown)

      this.window?.removeEventListener('keydown', this.keydown)
    })
  }

  // fat arrow for event callback to allow remove function memory cleanup unrelated to this class's lifecycle
  private pointerDown = (ev: PointerEvent) => {
    if (this.guessState() !== 'done') {
      this.hostEl.setPointerCapture(ev.pointerId)
      this.guessState.set('voting')
      this.swiping = true
      this.setPosition(this.cardPosition)
      this.hostEl.classList.add('swiping')
    }
  }

  private pointerMove = (ev: PointerEvent) => {
    if (this.swiping && this.guessState() === 'voting') {
      const newPos = {
        x: this.position.x + ev.movementX,
        y: this.position.y + ev.movementY
      }
      this.setPosition(newPos)
      this.castGuessIfThreshold()
    }
  }

  private pointerUp = (ev: PointerEvent) => {
    if (this.swiping && this.guessState() === 'voting') {
      this.swiping = false
      this.hostEl.releasePointerCapture(ev.pointerId)
      this.countGuessIfThreshold()
      this.hostEl.classList.remove('swiping')
      this.setPosition({ x: 0, y: 0 })
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
    this.hostEl.style.setProperty('--x', `${pos.x}px`)
    this.hostEl.style.setProperty('--y', `${pos.y}px`)
    this.hostEl.style.setProperty('--rotate', `${pos.x * 0.04}deg`)
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

  private guess(guess: Guess) {
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

  private get cardPosition(): Position {
    const ref = this.hostEl.querySelector<HTMLDivElement>(`[offset-to-active="0"]`)
    if (ref) {
      const transform = getComputedStyle(ref).transform
      const matrix = new DOMMatrixReadOnly(transform)
      // e and f are indexes of transform translate x and y
      return { x: matrix.e, y: matrix.f }
    }

    return { x: 0, y: 0 }
  }
}
