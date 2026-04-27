const MATCH_THRESHOLD = 0.65

export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2
  }
  return Math.sqrt(sum)
}

export function isFaceMatch(a: number[], b: number[]): boolean {
  return euclideanDistance(a, b) < MATCH_THRESHOLD
}
