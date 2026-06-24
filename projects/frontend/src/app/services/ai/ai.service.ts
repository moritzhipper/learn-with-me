import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import {
  LearnableFromAiListSchema,
  LearnableFromAiWithTypeListSchema,
  LearnableTypeEnumCategorizationSchema
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
import { SettingsStore } from '../../store/settings-store'
import { LearnableCreationConfig, TranslateFastConfig } from '../../types/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import { mapPhrasesFromInputToChunks } from './ai-utils'
import {
  getCategorizeCardPrompt,
  getMagicTranslatePrompt,
  getQuickTranslatePrompt
} from './prompts/prompts'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly model: ChatModel = 'gpt-5.4'
  private readonly settingsStore = inject(SettingsStore)

  private oAi = computed(
    () =>
      new OpenAI({
        apiKey: this.settingsStore.apiKey(),
        dangerouslyAllowBrowser: true
      })
  )

  async createLearnables(config: LearnableCreationConfig): Promise<LearnableBase[]> {
    const systemPrompt = getMagicTranslatePrompt(config)
    const promises: Promise<LearnableBase[]>[] = []

    if (config.sourceType === 'text') {
      promises.push(this.extractFromText(config, systemPrompt))
    } else if (config.sourceType === 'image') {
      promises.push(this.extractFromImage(config, systemPrompt))
    } else if (config.sourceType === 'prompt') {
      promises.push(this.createFromUserPrompt(config, systemPrompt))
    }

    const cardsLists = await Promise.all(promises)

    return cardsLists.flat(1)
  }

  // warning: chunking can introduces duplicate cards
  async extractFromText(
    config: LearnableCreationConfig,
    systemPrompt: string
  ): Promise<LearnableBase[]> {
    const cardType = config.cardType
    const chunks = mapPhrasesFromInputToChunks(config.source, 1000)

    if (cardType === 'both') {
      const responses = await Promise.all(
        chunks.map((chunk) =>
          this.createStructuredOutput(systemPrompt, chunk, LearnableFromAiWithTypeListSchema)
        )
      )

      return responses.flatMap((r) => r.cards)
    } else {
      const responses = await Promise.all(
        chunks.map((chunk) =>
          this.createStructuredOutput(systemPrompt, config.source, LearnableFromAiListSchema)
        )
      )

      return responses
        .flatMap((r) => r.cards)
        .map((c) => ({
          ...c,
          type: cardType
        }))
    }
  }

  async extractFromImage(
    config: LearnableCreationConfig,
    systemPrompt: string
  ): Promise<LearnableBase[]> {
    const userMessageContent: ResponseInputMessageContentList = [
      {
        type: 'input_image',
        detail: 'high',
        image_url: config.source
      }
    ]

    const cardType = config.cardType
    if (cardType === 'both') {
      const response = await this.createStructuredOutput(
        systemPrompt,
        userMessageContent,
        LearnableFromAiWithTypeListSchema
      )
      return response.cards
    } else {
      const response = await this.createStructuredOutput(
        systemPrompt,
        userMessageContent,
        LearnableFromAiListSchema
      )
      return response.cards.map((c) => ({
        ...c,
        type: cardType
      }))
    }
  }

  async createFromUserPrompt(
    config: LearnableCreationConfig,
    systemPrompt: string
  ): Promise<LearnableBase[]> {
    const cardType = config.cardType

    if (cardType === 'both') {
      const response = await this.createStructuredOutput(
        systemPrompt,
        config.source,
        LearnableFromAiWithTypeListSchema
      )
      return response.cards
    } else {
      const response = await this.createStructuredOutput(
        systemPrompt,
        config.source,
        LearnableFromAiListSchema
      )

      return response.cards.map((c) => ({
        ...c,
        type: cardType
      }))
    }
  }

  async categorizeCard(card: Omit<LearnableFromAI, 'notes'>): Promise<LearnableBase['type']> {
    const cardString = `lexeme: ${card.lexeme}\ntranslation: ${card.translation}`
    const response = await this.createStructuredOutput(
      getCategorizeCardPrompt(),
      cardString,
      LearnableTypeEnumCategorizationSchema
    )
    return response.type
  }

  private async createStructuredOutput<T>(
    systemPrompt: string,
    userContent: EasyInputMessage['content'],
    zodSchema: z.ZodType<T>
  ): Promise<T> {
    const response = await this.oAi().responses.parse({
      model: this.model,
      text: {
        format: zodTextFormat(zodSchema, 'response_type')
      },
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })

    this.settingsStore.addTokensUsed(response.usage?.total_tokens ?? 0)

    if (!response.output_parsed) throw new Error('An error occured calling AI service.')

    return response.output_parsed
  }

  translateFastStream$(config: TranslateFastConfig): Observable<ResponseStreamEvent> {
    return defer(() => {
      const controller = new AbortController()

      return from(
        this.oAi().responses.create(
          {
            model: this.model,
            input: [
              {
                role: 'system',
                content: getQuickTranslatePrompt(config.language.learning, config.tone)
              },
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
