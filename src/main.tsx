/// <reference path="../typings/index.d.ts" />

interface DebugWindow extends Window {}
declare var window: DebugWindow

import * as React from 'react'
import * as DOM from 'react-dom'
import { loadAudioFile } from './loading'
import { FileHandle } from './File'
import { ISound, play, gainWith } from './AudioSystem'
import { log } from './utils'

interface IClock {
  start: number
  current: number
  previous: number
  dT: number
  elapsed: number
}

interface IState {
  clock: IClock,
  rootEl: HTMLElement
  ac: AudioContext
  playing: ISound[]
  audioFiles: FileHandle<AudioBuffer>[]
}

class Clock implements IClock {
  start: number = Date.now()
  current: number = Date.now()
  previous: number = Date.now()
  dT: number = 0
  elapsed: number = 0
}

const rootEl = document.createElement('div')
const initialState: IState = {
  clock: new Clock,
  rootEl: rootEl,
  ac: new AudioContext,
  playing: [] as ISound[],
  audioFiles: [] as FileHandle<AudioBuffer>[]
}

async function raf<T> (f: (t: T) => Promise<T>, t: T): Promise<T> {
  return new Promise(res => requestAnimationFrame(_ => res(f(t)))) as Promise<T>
}

async function forever<T> (f: (t: T) => Promise<T>, t: T): Promise<T> {
  return await f(t).then(t1 => forever(f, t1))
}

async function update (state: IState): Promise<IState> {
  state.clock.previous = state.clock.current
  state.clock.current = Date.now()
  state.clock.dT = state.clock.current - state.clock.previous
  state.clock.elapsed += state.clock.dT
  state.playing = state.playing.filter(s => s.playing)
  DOM.render(<div>{ `Sounds Playing: ${ state.playing.length }` } </div>, state.rootEl)
  return Promise.resolve(state)
}

async function main (state: IState): Promise<IState> {
  const out = state.ac.destination
  const rafUpdate = raf.bind(null, update)
  const audioFiles = await Promise.all([ 
    loadAudioFile(state.ac, 'bg-music1.mp3'), 
    loadAudioFile(state.ac, 'sound1.mp3')
  ])
  
  state.playing = audioFiles.map(a => play(out, a.buffer))
  state.audioFiles = audioFiles
  return forever(rafUpdate, state)
}

document.body.appendChild(rootEl)
main(initialState)
