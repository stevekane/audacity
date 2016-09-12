/// <reference path="../typings/index.d.ts" />

interface DebugWindow extends Window {
  ac?: AudioContext
}
declare var window: DebugWindow

import * as React from 'react'
import * as DOM from 'react-dom'
import { loadAudioFile } from './loading'
import { start, play, gainWith } from './AudioSystem'
import { log } from './utils'

const ROOT_EL = document.createElement('div')
const ac = new AudioContext
const g = gainWith(ac, { volume: 0.1 })

g.connect(ac.destination)
window.ac = ac
Promise.all([
  loadAudioFile(ac, 'bg-music1.mp3'),
  loadAudioFile(ac, 'sound1.mp3')
])
.then(afs => {
  const playingBuffers = start(g, [], [ { buffer: afs[0].buffer }])

  setTimeout(play, 5000, g, playingBuffers, [ { buffer: afs[1].buffer } ])
  requestAnimationFrame(render)
})
ROOT_EL.style.height = '100%'
document.body.appendChild(ROOT_EL)

function render () {
  DOM.render(<div>Hello</div>, ROOT_EL)
  requestAnimationFrame(render)
}
