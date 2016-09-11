export type Edges<T> = Map<T, Set<T>>

export interface IGraph<T> { 
  edges: Map<T, Set<T>>
}

export function vertices<T> (g: IGraph<T>): T[] {
  return [ ...g.edges.keys() ]
}
