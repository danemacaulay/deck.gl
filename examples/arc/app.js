/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null,
      selectedCounty: null
    };
    this._onClick = this._onClick.bind(this);
    this._onHover = this._onHover.bind(this);

    requestJson('./data/counties.json', (error, response) => {
      if (!error) {
        this.setState({
          data: response.features,
          selectedCounty: response.features.find(f => f.properties.name === 'Los Angeles, CA')
        });
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onClick(info) {
    console.log('clicked', info);
    this.setState({
      selectedCounty: info.object
    });
  }

  _onHover(info) {
    // console.log('hovered', info);
    if (!info.object) {
      return;
    }
    this.setState({
      selectedCounty: info.object
    });
  }

  render() {
    const {viewport, data, selectedCounty} = this.state;

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          selectedFeature={selectedCounty}
          strokeWidth={2}
          onClick={this._onClick}
          onHover={this._onHover}
          />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
