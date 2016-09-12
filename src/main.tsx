/// <reference path="../typings/index.d.ts" />

interface DebugWindow extends Window {
  ac?: AudioContext
}
declare var window: DebugWindow

import * as React from 'react'
import * as DOM from 'react-dom'
import { loadAudioFile } from './loading'
import { play, gainWith } from './AudioSystem'
import { log } from './utils'

const ROOT_EL = document.createElement('div')
const ac = new AudioContext
const g = gainWith(ac, { volume: 0.1 })
const playBuffer = []

g.connect(ac.destination)
window.ac = ac
Promise.all([
  loadAudioFile(ac, 'bg-music1.mp3'),
  loadAudioFile(ac, 'sound1.mp3')
])
.then(sounds => {
  const playingBuffers = play(g, playBuffer, [ sounds[0].buffer ])

  setTimeout(play, 1000, g, playingBuffers, [ sounds[1].buffer ])
  requestAnimationFrame(render)
})
ROOT_EL.style.height = '100%'
document.body.appendChild(ROOT_EL)

function render () {
  DOM.render(<div>Hello</div>, ROOT_EL)
  requestAnimationFrame(render)
}
