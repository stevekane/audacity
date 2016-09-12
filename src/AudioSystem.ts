export interface Sound { 
  buffer: AudioBuffer, 
  startTime?: number
}

export function gainWith (ac: AudioContext, opts: { volume?: number }): GainNode {
  const g = ac.createGain()

  if ( opts.volume ) g.gain.value = opts.volume
  return g
}

export function play (channel: AudioNode, playing: AudioBufferSourceNode[], sounds: Sound[]): AudioBufferSourceNode[] {
  const sources = [] as AudioBufferSourceNode[]

  for ( const { buffer, startTime } of sounds ) {
    const source = channel.context.createBufferSource() 

    source.buffer = buffer
    source.connect(channel)
    source.start(startTime)
    sources.push(source)
  }
  return playing.concat(sources)
}

export function start (channel: AudioNode, playing: AudioBufferSourceNode[], sounds: Sound[]): AudioBufferSourceNode[] {
  for ( const sound of playing ) {
    sound.stop(0) 
  }
  return play(channel, [], sounds)
}
