export function gainWith (ac: AudioContext, opts: { volume?: number }): GainNode {
  const g = ac.createGain()

  if ( opts.volume ) g.gain.value = opts.volume
  return g
}

export function play (channel: AudioNode, playing: AudioBufferSourceNode[], buffers: AudioBuffer[]): AudioBufferSourceNode[] {
  const sources = [] as AudioBufferSourceNode[]

  for ( const buffer of buffers ) {
    const source = channel.context.createBufferSource() 

    source.buffer = buffer
    source.connect(channel)
    source.start(0)
    sources.push(source)
  }
  for ( const sound of playing ) {
    console.log(sound)
    sound.stop(0) 
    sound.disconnect(channel)
  }
  return sources
}
