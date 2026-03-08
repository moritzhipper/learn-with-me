import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import { LearnablesFromAiSchema } from '@shared/schemas'
import { LearnableBase, LearnableFromAI } from '@shared/types'
import {
  EasyInputMessage,
  ResponseInputMessageContentList,
  ResponseStreamEvent
} from 'openai/resources/responses/responses.mjs'
import { ChatModel } from 'openai/resources/shared.mjs'
import {
  catchError,
  defer,
  EMPTY,
  finalize,
  from,
  Observable,
  switchMap,
  tap,
  throwError
} from 'rxjs'
import { SettingsStore } from '../../store/settingsStore'
import {
  LearnableCreationConfig,
  LearnableFromImageCreationConfig,
  LearnableFromTextCreationConfig,
  TranslateFastConfig
} from '../../types_and_schemas/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import { mapPhrasesFromInputToChunks } from './ai-utils'
import { getPrompt, getQuickTranslatePrompt } from './prompt'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly model: ChatModel = 'gpt-5.2'
  private readonly settingsStore = inject(SettingsStore)

  private oAi = computed(
    () =>
      new OpenAI({
        apiKey: this.settingsStore.apiKey(),
        dangerouslyAllowBrowser: true
      })
  )

  async createLearnables(config: LearnableCreationConfig): Promise<LearnableBase[]> {
    if (config.source === 'image') {
      return this.createLearnablesFromImage(config)
    } else {
      return this.createLearnablesFromString(config)
    }
  }

  async createLearnablesFromString(
    config: LearnableFromTextCreationConfig
  ): Promise<LearnableBase[]> {
    const cardPromises: Promise<LearnableBase[]>[] = []
    const text = config.text

    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'phrase' || config.type === 'both') {
      const prompt = getPrompt(config.language, 'phrase', config.source)
      cardPromises.push(this._createCardsFromText(text, prompt, 'phrase'))
    }
    if (config.type === 'word' || config.type === 'both') {
      const prompt = getPrompt(config.language, 'word', config.source)
      cardPromises.push(this._createCardsFromText(text, prompt, 'word', 300))
    }

    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  async createLearnablesFromImage(
    config: LearnableFromImageCreationConfig
  ): Promise<LearnableBase[]> {
    const cardPromises: Promise<LearnableBase[]>[] = []
    const image = config.image

    if (config.type === 'phrase' || config.type === 'both') {
      const prompt = getPrompt(config.language, 'phrase', 'image')
      cardPromises.push(this._createCardsFromImage(image, prompt, 'phrase'))
    }

    if (config.type === 'word' || config.type === 'both') {
      const prompt = getPrompt(config.language, 'word', 'image')
      cardPromises.push(this._createCardsFromImage(image, prompt, 'word'))
    }
    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  private async _createCardsFromText(
    text: string,
    prompt: string,
    type: 'word' | 'phrase',
    chunkSize = 1000
  ): Promise<LearnableBase[]> {
    // the chunking reduces input length per request
    // bacause ai models become less accurate with longer inputs
    // increasing batchsize improves speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed  through the system prompts beeing sent per every request
    const chunks = mapPhrasesFromInputToChunks(text, chunkSize)
    const chunkPromises = chunks.map((chunk) => this._extractCards(chunk, prompt))

    const cardsLists = await Promise.all(chunkPromises)

    return cardsLists.flat(1).map((c) => ({
      ...c,
      notes: '',
      type
    }))
  }

  private async _createCardsFromImage(
    image: string,
    prompt: string,
    type: 'word' | 'phrase'
  ): Promise<LearnableBase[]> {
    const userMessageContent: ResponseInputMessageContentList = [
      {
        type: 'input_image',
        detail: 'high',
        image_url: image
      }
    ]
    const cards = await this._extractCards(userMessageContent, prompt)

    return cards.map((c) => ({
      ...c,
      notes: '',
      type
    }))
  }

  private async _extractCards(
    userMessageContent: EasyInputMessage['content'],
    prompt: string
  ): Promise<LearnableFromAI[]> {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnablesFromAiSchema, 'learnable_cards')
      },
      input: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content: userMessageContent
        }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)
    const cards = response.output_parsed?.cards || []
    return cards.map((c) => ({
      lexeme: c.lexeme,
      translation: c.translation
    }))
  }

  async translateFast(config: TranslateFastConfig, abortSignal: AbortSignal): Promise<string> {
    const response = await this.oAi().responses.create(
      {
        model: this.model,
        input: [
          { role: 'system', content: getQuickTranslatePrompt(config.language, config.tone) },
          {
            role: 'user',
            content: config.text
          }
        ]
      },
      { signal: abortSignal }
    )

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)
    return response.output_text
  }

  translateFastStream$(config: TranslateFastConfig): Observable<ResponseStreamEvent> {
    return defer(() => {
      const controller = new AbortController()

      return from(
        this.oAi().responses.create(
          {
            model: this.model,
            input: [
              { role: 'system', content: getQuickTranslatePrompt(config.language, config.tone) },
              { role: 'user', content: config.text }
            ],
            stream: true
          },
          { signal: controller.signal }
        )
      ).pipe(
        switchMap((stream) => from(stream)),
        tap((event) => {
          if (event.type === 'response.completed' && event.response.usage) {
            this.settingsStore.addTokensUsed(event.response.usage.total_tokens)
          }
        }),
        finalize(() => controller.abort()),
        catchError((err) => {
          if (err.name === 'AbortError' || err.name === 'APIUserAbortError') {
            return EMPTY
          }
          return throwError(() => err)
        })
      )
    })
  }
}
