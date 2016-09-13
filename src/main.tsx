/// <reference path="../typings/index.d.ts" />

interface DebugWindow extends Window {}
declare var window: DebugWindow

import * as React from 'react'
import * as DOM from 'react-dom'
import { loadAudioFile } from './loading'
import { FileHandle } from './File'
import { ISound, play, gainWith } from './AudioSystem'
import { log, push } from './utils'

interface IClock {
  start: number
  current: number
  previous: number
  dT: number
  elapsed: number
  update(now: number): void
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

  update(now: number): void {
    this.previous = this.current
    this.current = now
    this.dT = this.current - this.previous
    this.elapsed += this.dT
  }
}

const rootEl = document.createElement('div')
const networkInbox = [] as FileHandle<AudioBuffer>[]
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

async function update (networkInbox: FileHandle<AudioBuffer>[], state: IState): Promise<IState> {
  const audioFiles = networkInbox.splice(0)

  if ( audioFiles.length ) push(state.playing, audioFiles.map(af => play(state.ac.destination, af.buffer)))

  state.clock.update(Date.now())
  state.playing = state.playing.filter(s => s.playing)
  state.audioFiles.concat(audioFiles)
  DOM.render(<div>{ `Sounds Playing: ${ state.playing.length }` } </div>, state.rootEl)
  return Promise.resolve(state)
}

async function main (networkInbox: FileHandle<AudioBuffer>[], state: IState): Promise<IState> {
  const out = state.ac.destination
  const partialUpdate = (s: IState) => update(networkInbox, s)
  const partialRaf = (s: IState) => raf(partialUpdate, s)
  const fileLoads = [ loadAudioFile(state.ac, 'bg-music1.mp3'), loadAudioFile(state.ac, 'sound1.mp3') ]
  const addFile = (files: FileHandle<AudioBuffer>[]) => networkInbox.push(...files)

  Promise.all(fileLoads).then(addFile)
  return forever(partialRaf, state)
}

document.body.appendChild(rootEl)
main(networkInbox, initialState)
