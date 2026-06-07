import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import {
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
} from './prompts/magic-translate-prompts'
import { categorizeCardPrompt, getQuickTranslatePrompt } from './prompts/quick-translate-prompts'

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
  // const chunks = mapPhrasesFromInputToChunks(text, chunkSize)
  async extractFromText(text: string, config: LearnableCreationConfig): Promise<LearnableBase[]> {
    const systemPrompt = getExtractFromTextPrompt(config)
    const cardType = config.cardType

    if (cardType === 'both') {
      const cards = await this.createStructuredOutput(
        systemPrompt,
        text,
        z.array(LearnableFromAiWithTypeSchema)
      )

      return cards.map((c) => ({
        type: c.type,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    } else {
      const cards = await this.createStructuredOutput(
        systemPrompt,
        text,
        z.array(LearnableFromAiSchema)
      )

      return cards.map((c) => ({
        type: cardType,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    }
  }

  async extractFromImage(image: string, config: LearnableCreationConfig): Promise<LearnableBase[]> {
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
      const cards = await this.createStructuredOutput(
        systemPrompt,
        userMessageContent,
        z.array(LearnableFromAiWithTypeSchema)
      )
      return cards.map((c) => ({
        type: c.type,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    } else {
      const cards = await this.createStructuredOutput(
        systemPrompt,
        userMessageContent,
        z.array(LearnableFromAiSchema)
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
    config: LearnableCreationConfig
  ): Promise<LearnableBase[]> {
    const systemPrompt = getCreateFromUserPromptPrompt(config)
    const cardType = config.cardType

    if (cardType === 'both') {
      const cards = await this.createStructuredOutput(
        systemPrompt,
        userPrompt,
        z.array(LearnableFromAiWithTypeSchema)
      )
      return cards.map((c) => ({
        type: c.type,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    } else {
      const cards = await this.createStructuredOutput(
        systemPrompt,
        userPrompt,
        z.array(LearnableFromAiSchema)
      )

      return cards.map((c) => ({
        type: cardType,
        lexeme: c.lexeme,
        translation: c.translation,
        notes: ''
      }))
    }
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

  async categorizeCard(card: LearnableFromAI): Promise<string> {
    const cardString = `lexeme: ${card.lexeme}\ntranslation: ${card.translation}`
    return this.createStructuredOutput(categorizeCardPrompt, cardString, LearnableTypeEnum)
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
