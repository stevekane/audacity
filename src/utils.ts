export const log = console.log.bind(console)
export const last = <A>(ar: A[]): A => ar[ar.length - 1]
export const push = <A>(a: A[], b: A[]): A[] => {
  a.push(...b)
  return a
}
