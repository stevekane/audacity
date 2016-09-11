import * as React from 'react'
import { AudioSystem } from './AudioSystem'

export class Bar extends React.Component<{ magnitude: number }, null> {
  render() {
    const ratio = this.props.magnitude / 400
    const props = {
      style: {
        backgroundColor: `rgb(${ Math.floor(ratio * 255) }, 0, 0)`,
        transform: `scaleY(${ ratio })`,
        flex: '1 1 100%'
      }
    }
    
    return <div { ...props } />
  } 
}

export class Visualizer extends React.Component<{ buffer: Uint8Array }, null> {
  render() {
    const bars = [] as JSX.Element[]
    const props = {
      style: {
        display: 'flex',
        height: '100%'
      }
    }

    for (var i = 0; i < this.props.buffer.byteLength; i++) {
      bars.push(<Bar key={ i } magnitude={ this.props.buffer[i] } />)
    }
    return <div { ...props }>{ bars }</div>
  }
}

export class AudioSystemComponent extends React.Component<{ audioSystem: AudioSystem }, null> {
  render() {
    const props = {
      viewBox: '0 0 800 800',
      style: {
        display: 'flex',
        height: '100%',
        backgroundColor: 'red'
      } 
    }

    return <svg></svg> 
  }
}
