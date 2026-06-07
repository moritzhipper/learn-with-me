import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import {
  LearnableBaseSchema,
  LearnableFromAiSchema,
  LearnableFromAiWithTypeSchema,
  LearnableTypeEnum
} from '@shared/schemas'
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
import z from 'zod'
import { SettingsStore } from '../../store/settingsStore'
import { LearnableCreationConfig, TranslateFastConfig } from '../../types/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import {
  getCreateFromUserPromptPrompt,
  getExtractFromImagePrompt,
  getExtractFromTextPrompt
} from './pompt-new'
import { getPrompt, getQuickTranslatePrompt } from './prompt'

type AICallConfigProxy = Omit<LearnableCreationConfig, 'source' | 'sourceType'>

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
    const prompt = getPrompt(config)
    const promises: Promise<LearnableBase[]>[] = []

    if (config.sourceType === 'text') {
      promises.push(this.extractFromText(config.source, config))
    } else if (config.sourceType === 'image') {
      promises.push(this.extractFromImage(config.source, config))
    } else if (config.sourceType === 'prompt') {
      promises.push(this.createFromUserPrompt(config.source, config))
    }

    const cardsLists = await Promise.all(promises)

    return cardsLists.flat(1)
  }

  // todo: add chunking back
  //  const chunks = mapPhrasesFromInputToChunks(text, chunkSize)

  async extractFromText(text: string, config: AICallConfigProxy): Promise<LearnableBase[]> {
    const systemPrompt = getExtractFromTextPrompt(config)
    const cardType = config.cardType

    if (cardType === 'both') {
      const cards = await this.createCardsWithAI(systemPrompt, text, LearnableFromAiWithTypeSchema)
      return cards.map((c) => ({
        type: c.type,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    } else {
      const cards = await this.createCardsWithAI(systemPrompt, text, LearnableFromAiSchema)
      return cards.map((c) => ({
        type: cardType,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    }
  }

  async extractFromImage(image: string, config: AICallConfigProxy): Promise<LearnableBase[]> {
    const systemPrompt = getExtractFromImagePrompt(config)
    const userMessageContent: ResponseInputMessageContentList = [
      {
        type: 'input_image',
        detail: 'high',
        image_url: image
      }
    ]

    const cardType = config.cardType
    if (cardType === 'both') {
      const cards = await this.createCardsWithAI(
        systemPrompt,
        userMessageContent,
        LearnableFromAiWithTypeSchema
      )
      return cards.map((c) => ({
        type: c.type,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    } else {
      const cards = await this.createCardsWithAI(
        systemPrompt,
        userMessageContent,
        LearnableFromAiSchema
      )
      return cards.map((c) => ({
        type: cardType,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    }
  }

  async createFromUserPrompt(
    userPrompt: string,
    config: AICallConfigProxy
  ): Promise<LearnableBase[]> {
    const systemPrompt = getCreateFromUserPromptPrompt(config)
    return this.createCardsWithAI(systemPrompt, userPrompt, LearnableBaseSchema)
  }

  async createCardsWithAI<T>(
    systemPrompt: string,
    userContent: EasyInputMessage['content'],
    zodSchema: z.ZodType<T>
  ): Promise<T[]> {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(z.array(zodSchema), 'learnable_cards')
      },
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)

    return response.output_parsed ?? []
  }

  // keep those
  async categorizeCard(card: LearnableFromAI): Promise<string> {
    // add correct prompt
    const systemPrompt = ''
    const cardString = String(card)
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(LearnableTypeEnum, 'learnable_cards')
      },
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: cardString }
      ]
    })

    const type = response.output_parsed

    return type ?? 'word'
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
