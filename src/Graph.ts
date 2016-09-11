export interface IGraph<T> { 
  edges: Map<T, Set<T>>
}

export class EdgePairGraph <T> implements IGraph<T> { 
  edges: Map<T, Set<T>>

  constructor(pairs: Iterable<{ src: T, dest: T }>) {
    const edges = new Map as Map<T, Set<T>>

    for ( const { src, dest } of pairs ) {
      const foundSrc = edges.get(src)
      const foundDest = edges.get(dest)

      if ( foundSrc ) foundSrc.add(dest)
      else            edges.set(src, new Set([ dest ]))

      if ( !foundDest ) edges.set(dest, new Set)
      else              continue
    }
    this.edges = edges
  }
}
