import { IGraph, Edges, vertices } from './Graph'

export class AudioSystem implements IGraph<GraphNode> {
  edges: Edges<GraphNode>
  vertices: GraphNode[]

  constructor(pairs: { src: GraphNode, dest?: GraphNode }[]) {
    const edges = new Map as Map<GraphNode, Set<GraphNode>>

    for ( const { src, dest } of pairs ) {
      const foundSrc = edges.get(src)

      if      ( dest )               src.node.connect(dest.node)
      if      ( foundSrc && dest )   foundSrc.add(dest) 
      else if ( !foundSrc && dest )  edges.set(src, new Set([ dest ]))
      else if ( !foundSrc && !dest ) edges.set(src, new Set)
      else                           continue
    }
    this.edges = edges
    this.vertices = vertices(this)
  }
}

interface IVec2<T> { x: T, y: T }
interface GraphNode { position: IVec2<number>, node: AudioNode }
interface IGain extends GraphNode { node: GainNode }
interface IAnalyser extends GraphNode { node: AnalyserNode, frequencyData: Uint8Array }
interface IBufferSource extends GraphNode { node: AudioBufferSourceNode }
interface IDestinationNode extends GraphNode { node: AudioDestinationNode }

export class Gain implements IGain {
  node: GainNode
  position: IVec2<number>
  constructor(ac: AudioContext, position: IVec2<number>, opts: { volume?: number }) {
    this.position = position
    this.node = ac.createGain()
    if ( opts.volume ) this.node.gain.value = opts.volume
  }
}

export class Analyser implements IAnalyser { 
  node: AnalyserNode 
  position: IVec2<number>
  frequencyData: Uint8Array
  constructor(ac: AudioContext, position: IVec2<number>, opts: { fftSize?: number }) {
    this.position = position
    this.node = ac.createAnalyser()
    if ( opts.fftSize ) this.node.fftSize = opts.fftSize
    this.frequencyData = new Uint8Array(this.node.frequencyBinCount)
  }
}

export class Destination implements IDestinationNode {
  node: AudioDestinationNode
  position: IVec2<number>
  constructor(ac: AudioContext, position: IVec2<number>) {
    this.position = position
    this.node = ac.destination 
  }
}

export function play (channel: AudioNode, buffer: AudioBuffer): AudioBufferSourceNode {
  const source = channel.context.createBufferSource()

  source.buffer = buffer
  source.connect(channel)
  source.start(0)
  return source
}
