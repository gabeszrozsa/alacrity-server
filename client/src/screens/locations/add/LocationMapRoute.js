import React from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import { Steps, Icon, Button } from 'antd';

import { GOOGLE_MAPS_API_KEY } from '../../../config';

const Step = Steps.Step;

class LocationMapRoute extends React.Component {
  zoom = 15;

  state = {
    coords: []
  }

  onMapClicked = (mapProps, map, clickEvent) => {
    const latLng = clickEvent.latLng;
    const coords = this.state.coords;
    coords.push({ lat: latLng.lat(), lng: latLng.lng() });

    this.setState({ coords });
  }

  stepToFinish = () => {
    const { coords } = this.state;
    this.props.onGetRoute(coords);
  }

  render() {
    const Markers = this.state.coords.map((pos, idx) => (
        <Marker
          key={idx}
          title={idx + '. csomópont'}
          position={{lat: pos.lat, lng: pos.lng}} />
    ));

    return(
      <React.Fragment>
        <Steps size="small" current={1}>
          <Step title="Helyszín" icon={<Icon type="environment" />} />
          <Step title="Útvonal" icon={<Icon type="rise" />} />
          <Step title="Rögzítés" icon={<Icon type="check" />} />
        </Steps>

        <Button
          type="primary"
          icon="rise"
          style={{marginTop: '30px', marginBottom: '30px'}}
          onClick={this.stepToFinish}>
          Tovább a rögzítéshez
        </Button>

        <Map google={this.props.google}
            ref="map"
            style={{width: '100%', height: '100%', position: 'relative'}}
            containerStyle={{
              height: '600px',
              position: 'relative',
              width: '600px'
            }}
            zoom={this.props.zoom}
            initialCenter={this.props.center}
            onClick={this.onMapClicked}
            >

            {Markers}
        </Map>
      </React.Fragment>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(LocationMapRoute)
