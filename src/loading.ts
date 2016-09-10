import { FileHandle } from './File'
import { last } from './utils'

export function loadAudioFile (ac: AudioContext, uri: string): Promise<FileHandle<AudioBuffer>> {
  const toFileHandle = (buffer: AudioBuffer): FileHandle<AudioBuffer> => ({
    name: last(uri.split('/')),
    uri: uri,
    buffer: buffer
  })

  return loadXhr(uri, 'arraybuffer').then(d => ac.decodeAudioData(d)).then(toFileHandle)
}

export function loadXhr (uri: string, responseType: string): Promise<ArrayBuffer> {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest

    xhr.onload = _ => res(xhr.response)
    xhr.onerror = _ => rej(`Could not load ${ uri }`)
    xhr.responseType = responseType
    xhr.open('GET', uri)
    xhr.send()
  })
}
