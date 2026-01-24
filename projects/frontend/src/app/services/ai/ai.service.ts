import { computed, inject, Injectable } from '@angular/core'
import OpenAI from 'openai'
// reimport when zod v4 + openai compatibility bug is fixed
// until then use helper function zodTextFormat from utils/genaral-utils
// import { zodTextFormat } from 'openai/helpers/zod'
import { LearnablesFromAiSchema } from '@shared/schemas'
import { LearnableBase, LearnableFromAI } from '@shared/types'
import {
  EasyInputMessage,
  ResponseInputMessageContentList
} from 'openai/resources/responses/responses.mjs'
import { ChatModel } from 'openai/resources/shared.mjs'
import { SettingsStore } from '../../store/settingsStore'
import {
  LearnableCreationConfig,
  LearnableFromImageCreationConfig,
  LearnableFromTextCreationConfig
} from '../../types_and_schemas/types'
import { zodTextFormat } from '../../utils/genaral-utils'
import { mapPhrasesFromInputToChunks } from './ai-utils'
import { getImageBasePrompt, getPhrasesPrompt, getWordsPrompt } from './prompt'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly model: ChatModel = 'gpt-5.1'
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

    // when both, do call phrase and cards, if one of them, call one of them
    // chatgpt skips a lot of input when doing both at once
    if (config.type === 'phrases' || config.type === 'both') {
      const prompt = getPhrasesPrompt(config.language)
      cardPromises.push(this._createCardsFromText(config.text, prompt, 'phrase'))
    }
    if (config.type === 'words' || config.type === 'both') {
      const prompt = getWordsPrompt(config.language)
      cardPromises.push(this._createCardsFromText(config.text, prompt, 'word'))
    }

    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  async createLearnablesFromImage(
    config: LearnableFromImageCreationConfig
  ): Promise<LearnableBase[]> {
    const userMessageContent: ResponseInputMessageContentList = [
      {
        type: 'input_image',
        detail: 'high',
        image_url: config.image
      }
    ]

    const cardPromises: Promise<LearnableBase[]>[] = []

    if (config.type === 'phrases' || config.type === 'both') {
      const prompt = getPhrasesPrompt(config.language) + getImageBasePrompt('phrases')
      cardPromises.push(this._createCardsFromImage(userMessageContent, prompt, 'phrase'))
    }

    if (config.type === 'words' || config.type === 'both') {
      const prompt = getWordsPrompt(config.language) + getImageBasePrompt('words')
      cardPromises.push(this._createCardsFromImage(userMessageContent, prompt, 'word'))
    }
    const cardLists = await Promise.all(cardPromises)
    const cards = cardLists.flat(1)

    return cards
  }

  private async _createCardsFromText(
    text: string,
    prompt: string,
    type: 'word' | 'phrase'
  ): Promise<LearnableBase[]> {
    // the chunking reduces input length per request
    // bacause ai models become less accurate with longer inputs
    // increasing batchsize improves speed, but reduce accuracy
    // reducing it increases accuracy, but reduces speed  through the system prompts beeing sent per every request
    const maxChunkSize = 1000
    const chunks = mapPhrasesFromInputToChunks(text, maxChunkSize)
    const chunkPromises = chunks.map((chunk) => this._extractCards(chunk, prompt))

    const cardsLists = await Promise.all(chunkPromises)

    return cardsLists.flat(1).map((c) => ({
      ...c,
      notes: '',
      type
    }))
  }

  private async _createCardsFromImage(
    imageContent: ResponseInputMessageContentList,
    prompt: string,
    type: 'word' | 'phrase'
  ): Promise<LearnableBase[]> {
    const cards = await this._extractCards(imageContent, prompt)

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
}
