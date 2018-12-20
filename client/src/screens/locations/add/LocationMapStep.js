import React from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import { Steps, Icon, Button } from 'antd';

import { GOOGLE_MAPS_API_KEY } from '../../../config';

const Step = Steps.Step;

class Contents extends React.Component {
  state = {
    position: null,
  }

  componentDidMount() {
    this.renderAutoComplete();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps.map) this.renderAutoComplete();
  }

  renderAutoComplete() {
    const { google, map } = this.props;

    if (!google || !map) return;

    const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }

      this.setState({ position: place.geometry.location });
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  stepToRoute = () => {
    const pos = this.getPosition();
    if (!pos) {
      return false;
    }
    this.props.onGetLocation(pos);
  }

  getPosition = () => {
    const { position } = this.state;

    if (position && position.lat() && position.lng()) {
      return { lat: position.lat(), lng: position.lng() };
    } else {
      return false;
    }
  }

  render() {
    const { position } = this.state;

    return(
      <React.Fragment>
        <form onSubmit={this.onSubmit} style={{marginTop: '30px'}}>
          <input
            className="ant-input"
            placeholder="Add meg a helyszín nevét"
            ref={ref => (this.autocomplete = ref)}
            type="text"
          />
        </form>

        <Button
          type="primary"
          icon="rise"
          style={{marginTop: '30px', marginBottom: '30px'}}
          disabled={!this.getPosition()}
          onClick={this.stepToRoute}>
          Tovább az útvonal rajzoláshoz
        </Button>

        <Map
          {...this.props}
          center={position}
          centerAroundCurrentLocation={false}
          containerStyle={{
            height: '450px',
            position: 'relative',
            width: '450px'
          }}>
          <Marker position={position} />
        </Map>
      </React.Fragment>
    )
  }
}

const LocationMapStep = props => (
  <React.Fragment>
    <Steps size="small" current={0}>
      <Step title="Helyszín" icon={<Icon type="environment" />} />
      <Step title="Útvonal" icon={<Icon type="rise" />} />
      <Step title="Rögzítés" icon={<Icon type="check" />} />
    </Steps>

    <Map className="map" google={props.google} visible={false}>
      <Contents {...props} />
    </Map>
  </React.Fragment>
);


export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(LocationMapStep)
