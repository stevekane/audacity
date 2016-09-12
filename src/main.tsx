/// <reference path="../typings/index.d.ts" />
interface DebugWindow extends Window {
  audioSystem?: AudioSystem
}
declare var window: DebugWindow

import * as React from 'react'
import * as DOM from 'react-dom'
import { loadAudioFile } from './loading'
import { AudioSystemGraph } from './render'
import { AudioSystem, Gain, Analyser, Destination, play } from './AudioSystem'
import { log } from './utils'

const ROOT_EL = document.createElement('div')
const ac = new AudioContext
const g = new Gain(ac, { x: 0, y: 200 }, { volume: 0.1 })
const a = new Analyser(ac, { x: 0, y: 100 }, { fftSize: 256 })
const d = new Destination(ac, { x: 0, y: 0 })
const audioSystem = new AudioSystem(ac, [
  { src: g, dest: a }, 
  { src: a, dest: d }
])

loadAudioFile(ac, 'bg-music1.mp3')
.then(bgMusic => {
  window.audioSystem = audioSystem
  play(g.node, bgMusic.buffer)
  requestAnimationFrame(render)
})
ROOT_EL.style.height = '100%'
document.body.appendChild(ROOT_EL)

function render () {
  a.node.getByteFrequencyData(a.frequencyData)
  DOM.render(<AudioSystemGraph { ...audioSystem } />, ROOT_EL)
  requestAnimationFrame(render)
}
