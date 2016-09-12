import { IGraph, EdgePairGraph } from './Graph'

export class AudioSystem extends EdgePairGraph<GraphNode> {
  edges: Map<GraphNode, Set<GraphNode>>
  vertices: GraphNode[]
  context: AudioContext

  constructor(context: AudioContext, pairs: Iterable<{ src: GraphNode, dest: GraphNode }>) {
    super(pairs)
    for ( const e of this.edges.entries() ) {
      e[1].forEach(dest => e[0].node.connect(dest.node))  
    }
    this.context = context
  }
}

export interface IVec2<T> { x: T, y: T }

export interface INode {
  position: IVec2<number>
  id: number
}
export interface IGain extends INode { 
  kind: 'Gain', 
  node: GainNode 
}
export interface IAnalyser extends INode { 
  kind: 'Analyser', 
  node: AnalyserNode, 
  frequencyData: Uint8Array 
}
export interface IBufferSource extends INode { 
  kind: 'BufferSource', 
  node: AudioBufferSourceNode 
}
export interface IDestination extends INode { 
  kind: 'Destination', 
  node: AudioDestinationNode
}

export type GraphNode = IGain | IAnalyser | IBufferSource | IDestination

export class Gain implements IGain {
  id: number
  kind: 'Gain' = 'Gain'
  node: GainNode
  position: IVec2<number>
  constructor(ac: AudioContext, position: IVec2<number>, opts: { volume?: number }) {
    this.id = Math.floor(Math.random() * 10000)
    this.position = position
    this.node = ac.createGain()
    if ( opts.volume ) this.node.gain.value = opts.volume
  }
}

export class Analyser implements IAnalyser { 
  id: number
  kind: 'Analyser' = 'Analyser'
  node: AnalyserNode 
  position: IVec2<number>
  frequencyData: Uint8Array
  constructor(ac: AudioContext, position: IVec2<number>, opts: { fftSize?: number }) {
    this.id = Math.floor(Math.random() * 10000)
    this.position = position
    this.node = ac.createAnalyser()
    if ( opts.fftSize ) this.node.fftSize = opts.fftSize
    this.frequencyData = new Uint8Array(this.node.frequencyBinCount)
  }
}

export class Destination implements IDestination {
  id: number
  kind: 'Destination' = 'Destination'
  node: AudioDestinationNode
  position: IVec2<number>
  constructor(ac: AudioContext, position: IVec2<number>) {
    this.id = Math.floor(Math.random() * 10000)
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
