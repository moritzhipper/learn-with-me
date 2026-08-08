export type AnimConfig = { i: number; duration?: number } & ({ size: number } | { list: unknown[] })

const DURATION_DEFAULT = 0.2
const INTERVAL_DELAY_MAX = 0.03

/**
 * Ensures that the intervaall delay between items of small lists does not become to long, making the animation feel
 */
export const mapToAnimDelay = (conf: AnimConfig): number => {
  const size = 'size' in conf ? conf.size : conf.list.length
  const i = conf.i
  const duration = conf.duration ?? DURATION_DEFAULT
  const intervalDelay = Math.min(duration / size, INTERVAL_DELAY_MAX)

  return i * intervalDelay
}
