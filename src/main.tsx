/// <reference path="../typings/index.d.ts" />

import * as React from 'react'
import * as DOM from 'react-dom'
import { FileHandle } from './File'
import { loadAudioFile } from './loading'
import { Visualizer } from './render'
import { log } from './utils'

interface Silence {
  duration: number
}

interface IConnection { 
  from: AudioNode
  to: AudioNode
}
interface IAudioSystem { 
  nodes: AudioNode[]
  connections: IConnection[]
}

type WaveForm = Silence | FileHandle<AudioBuffer>

function play (channel: AudioNode, fh: FileHandle<AudioBuffer>): AudioBufferSourceNode {
  const source = channel.context.createBufferSource()

  source.buffer = fh.buffer
  source.connect(channel)
  source.start(0)
  return source
}

function loop (channel: AudioNode, fh: FileHandle<AudioBuffer>): AudioBufferSourceNode {
  const source = play(channel, fh)

  source.loop = true
  return source
}

const ROOT_EL = document.createElement('div')
const cache: Map<string, FileHandle<AudioBuffer>> = new Map
const VIS_SIZE = 128
const ac = new AudioContext
const channels = [ ac.createGain(), ac.createGain() ]
const analysers = [ ac.createAnalyser(), ac.createAnalyser() ]
channels.forEach((c, i) => c.connect(analysers[i]))
analysers.forEach(a => {
  a.connect(ac.destination)
  a.fftSize = VIS_SIZE * 2
})
channels[0].gain.value = 0.01
document.body.appendChild(ROOT_EL)

Promise.all([
  loadAudioFile(ac, 'bg-music1.mp3'),
  loadAudioFile(ac, 'musicbox.mp3')
])
.then(afs => {
  afs.forEach(af => cache.set(af.name, af))

  const bgMusic = cache.get('bg-music1.mp3')

  if ( bgMusic != null ) loop(channels[0], bgMusic)
  requestAnimationFrame(render)
})

const visBuffers = [ 
  new Uint8Array(analysers[0].frequencyBinCount),
  new Uint8Array(analysers[1].frequencyBinCount)
]

function render () {
  analysers.forEach((a, i) => a.getByteFrequencyData(visBuffers[i])   )
  DOM.render(<Visualizer buffer={ visBuffers[0] } />, ROOT_EL)
  requestAnimationFrame(render)
}
