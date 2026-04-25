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

export const calculateAverageConfidencePercent = (learnables: UserLearnable[]): number => {
  const allGuesses = learnables.flatMap((l) => [...l.guesses.lexeme, ...l.guesses.translation])

  if (allGuesses.length === 0) return 0

  const trueGuesses = allGuesses.filter(Boolean).length
  const confidencePercent = trueGuesses / allGuesses.length

  return Math.round(confidencePercent * 100)
}

export const removeDuplicates = (array: string[]): string[] => {
  return Array.from(new Set(array))
}

export const pluralize = (count: number, unit: string): string => {
  const pluralS = count !== 1 ? 's' : ''
  return `${count} ${unit}${pluralS}`
}

// staggered animation helpers

export const staggerDelays = (count: number, timeSpread: number = 0.3): number[] => {
  // ensures  that smaller lists dont have too long delays
  const maxStep = 0.1
  const step = Math.min(timeSpread / count, maxStep)
  return Array.from({ length: count }, (_, i) => i * step)
}

export type StaggerVM<T> = Array<{
  item: T
  animDelay: number
}>

export const mapToStaggerVM = <T>(items: T[], timeSpread: number = 0.3): StaggerVM<T> => {
  const delays = staggerDelays(items.length, timeSpread)
  return items.map((item, i) => ({ item, animDelay: delays[i] }))
}

// time utils

export const calcDaysAgo = (now: Date, date: Date): number => {
  const msInDay = 1000 * 60 * 60 * 24
  return (now.getTime() - date.getTime()) / msInDay
}
