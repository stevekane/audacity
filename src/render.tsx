import * as React from 'react'
import { AudioSystem, GraphNode, IGain, IAnalyser, IDestination } from './AudioSystem'

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

export class GainNode extends React.Component<{ gain: GraphNode }, null> {
  render() {
    const { x, y } = this.props.gain.position
    const gProps = {
      id: this.props.gain.id.toString(),
      transform: `translate(${ x }, ${ y })`
    }
    const tProps = {
      textAnchor: 'middle',
      children: 'Gain'
    }
    const cProps = {
      r: 30,
      stroke: 'blue',
      fill: 'none'
    }

    return (
      <g { ...gProps } >
        <text { ...tProps } />
        <circle { ...cProps } />
      </g>
    )
  }
}

export class AudioSystemGraph extends React.Component<AudioSystem, null> {
  render() {
    const props = {
      viewBox: '-320 -240 640 480',
      style: {
        display: 'flex',
        height: '100%',
        border: '1px solid blue'
      } 
    }
    const nodes = [] as JSX.Element[]

    for (var node of this.props.edges.keys() ) {
      if      ( node.kind === 'Gain' )        nodes.push(<GainNode gain={ node } key={ node.id } />)
      else if ( node.kind === 'Analyser' )    nodes.push(<GainNode gain={ node } key={ node.id } />)
      else if ( node.kind === 'Destination' ) nodes.push(<GainNode gain={ node } key={ node.id } />)
      else if ( node.kind === 'Source' ) nodes.push(<GainNode gain={ node } key={ node.id } />)
      else continue
    }
    return <svg { ...props }>{ nodes }</svg> 
  }
}
