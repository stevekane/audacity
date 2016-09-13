export interface ISound { 
  node: AudioBufferSourceNode
  playing: boolean
}

export class Sound implements ISound {
  constructor(public node: AudioBufferSourceNode, public playing: boolean = true) {}
}

export function gainWith (ac: AudioContext, opts: { volume?: number }): GainNode {
  const g = ac.createGain()

  if ( opts.volume ) g.gain.value = opts.volume
  return g
}

export function play (channel: AudioNode, buffer: AudioBuffer, startTime: number = 0): ISound {
  const source = channel.context.createBufferSource() 
  const sound = new Sound(source)

  source.buffer = buffer
  source.connect(channel)
  source.start(startTime || 0)
  source.onended = _ => sound.playing = false
  return sound
}
