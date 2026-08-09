export type AnimConfig = {
  i: number
  size: number
  duration: number
}

/**
 * Ensures that the intervaall delay between items of small lists does not become to long, making the animation feel
 */
export const mapToAnimDelay = ({ i, size, duration }: AnimConfig): number => {
  const intervalDelay = duration / size

  return i * intervalDelay
}
