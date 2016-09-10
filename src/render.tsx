import * as React from 'react'

export class Bar extends React.Component<{ magnitude: number }, null> {
  render() {
    const ratio = this.props.magnitude / 400
    const props = {
      style: {
        backgroundColor: 'red',
        height: '300px',
        transformOrigin: '50% 0%',
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
        display: 'flex'
      }
    }

    for (var i = 0; i < this.props.buffer.byteLength; i++) {
      bars.push(<Bar key={ i } magnitude={ this.props.buffer[i] } />)
    }
    return <div { ...props }>{ bars }</div>
  }
}
