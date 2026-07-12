import { UserLearnable } from '@shared/types'
import { AutoParseableTextFormat, makeParseableTextFormat } from 'openai/lib/parser.mjs'
import { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses.mjs'
import z from 'zod'

/**
 *
 * necessary to use zod with openai responses. zod 4 introduces a bug with. the openai helper package which is not fixed yet.
 * https://github.com/openai/openai-node/issues/1576#issuecomment-3056734414
 */
export function zodTextFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<ResponseFormatTextJSONSchemaConfig, 'schema' | 'type' | 'strict' | 'name'>
): AutoParseableTextFormat<z.infer<ZodInput>> {
  return makeParseableTextFormat(
    {
      type: 'json_schema',
      ...props,
      name,
      strict: true,
      schema: z.toJSONSchema(zodObject, { target: 'draft-7' })
    },
    (content) => zodObject.parse(JSON.parse(content))
  )
}

export type ConfidenceAggregate = {
  translation: number
  lexeme: number
  all: number
}

export const calculateAverageConfidencePercent = (
  learnables: UserLearnable[]
): ConfidenceAggregate => {
  const allTranslationGuesses = learnables.flatMap((l) => l.guesses.translation)
  const allLexemeGuesses = learnables.flatMap((l) => l.guesses.lexeme)
  const allGuesses = [...allTranslationGuesses, ...allLexemeGuesses]

  const getAvg = (guesses: boolean[]): number => {
    if (guesses.length === 0) return 0
    const trueGuesses = guesses.filter(Boolean).length
    const confPerc = trueGuesses / guesses.length
    return Math.round(confPerc * 100)
  }

  return {
    translation: getAvg(allTranslationGuesses),
    lexeme: getAvg(allLexemeGuesses),
    all: getAvg(allGuesses)
  }
}

export const removeDuplicates = (array: string[]): string[] => {
  return Array.from(new Set(array))
}

export const pluralize = (count: number, unit: string): string => {
  const pluralS = count !== 1 ? 's' : ''
  return `${count} ${unit}${pluralS}`
}

// time utils

export const calcDaysDifference = (date1: Date | number, date2: Date | number): number => {
  const nowDate = new Date(date1)
  const dateObj = new Date(date2)
  const msInDay = 1000 * 60 * 60 * 24
  return (nowDate.getTime() - dateObj.getTime()) / msInDay
}

export const convertToDayPrecisionUTCDate = (date: Date | number): number => {
  const dateStartOfDay = new Date(date)
  dateStartOfDay.setHours(0, 0, 0, 0)

  // convert to number to allow Map to do its lookup thing
  return dateStartOfDay.getTime()
}

export const isSameDay = (date1: Date | number, date2: Date | number): boolean =>
  convertToDayPrecisionUTCDate(date1) === convertToDayPrecisionUTCDate(date2)
