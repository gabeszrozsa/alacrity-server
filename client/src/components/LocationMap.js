import React from 'react';
import {GoogleApiWrapper, Map, Polyline, Marker} from 'google-maps-react';
import { GOOGLE_MAPS_API_KEY } from '../config';

class LocationDetailsMap extends React.Component {
  render() {
    const height = this.props.height || '300px';
    const width = this.props.width || '300px';
    const polyline = typeof this.props.polyline !== 'undefined' ? this.props.polyline : true;
    const marker = typeof this.props.marker !== 'undefined' ? this.props.marker : true;
    const zoomOffset = typeof this.props.zoomOffset !== 'undefined' ? this.props.zoomOffset : 0;

    return(
        <Map google={this.props.google}
            style={{width: '100%', height: '100%', position: 'relative'}}
            containerStyle={{
              height: height,
              position: 'relative',
              width: width
            }}
            zoom={this.props.loc.coordinates.zoom + zoomOffset}
            initialCenter={this.props.loc.coordinates.center}>

            { marker && <Marker
              key={this.props.loc._id}
              title={this.props.loc.name}
              position={this.props.loc.coordinates.center} />
            }

            { polyline && <Polyline
              path={this.props.loc.coordinates.routeCoords}
              strokeColor="red"
              strokeOpacity={0.8}
              strokeWeight={3} />
            }

        </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(LocationDetailsMap)
