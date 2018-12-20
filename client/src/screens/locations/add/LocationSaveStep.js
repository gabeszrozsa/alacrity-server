import React from 'react';
import {GoogleApiWrapper, Map, Polyline} from 'google-maps-react';
import { Steps, Icon } from 'antd';

import LocationForm from '../LocationForm';
import { GOOGLE_MAPS_API_KEY } from '../../../config';

const Step = Steps.Step;

class LocationSaveStep extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Steps size="small" current={2}>
          <Step title="Helyszín" icon={<Icon type="environment" />} />
          <Step title="Útvonal" icon={<Icon type="rise" />} />
          <Step title="Rögzítés" icon={<Icon type="check" />} />
        </Steps>

        <LocationForm
          form={this.props.form}
          handleSubmit={this.props.handleSubmit}
          buttonText={'Rögzítés'}
        />

        <Map google={this.props.google}
            style={{width: '100%', height: '100%', position: 'relative'}}
            containerStyle={{
              height: '600px',
              position: 'relative',
              width: '600px'
            }}
            zoom={13}
            initialCenter={this.props.center}>

            <Polyline
              path={this.props.routeCoords}
              strokeColor="red"
              strokeOpacity={0.8}
              strokeWeight={3} />

        </Map>
      </React.Fragment>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(LocationSaveStep)
