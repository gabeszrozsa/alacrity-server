import React from 'react'
import { message } from 'antd';

import { LocationService } from '../../../api';
import LocationMapStep from './LocationMapStep';
import LocationMapRoute from './LocationMapRoute';
import LocationSaveStep from './LocationSaveStep';

export default class AddLocationContainer extends React.Component {
  state = {
    step: 'map',
    center: null,
    zoom: 15,
    routeCoords: []
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { center, zoom, routeCoords } = this.state;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newLocation = {
          name: values.name,
          coordinates: {
            center,
            routeCoords,
            zoom
          }
        };

        LocationService.addNewLocation(newLocation).then(id => {
          const redirectUrl = `/locations/${id}`;
          message.info('Helyszín hozzáadva!');
          this.props.history.push(redirectUrl);
        });
      }
    });
  }

  handleGetLocation = (center) => {
    const step = 'route';
    this.setState({ step, center });
  }

  handleGetRoute = (routeCoords) => {
    const step = 'finish';
    this.setState({ step, routeCoords });
  }

  render() {
    const { step, center, routeCoords, zoom } = this.state;
    return (
      <React.Fragment>

        {step === 'map' && <LocationMapStep zoom={15} onGetLocation={this.handleGetLocation}/>}

        {step === 'route' && <LocationMapRoute zoom={15} center={center} onGetRoute={this.handleGetRoute}/>}

        {step === 'finish' && <LocationSaveStep
          zoom={15}
          form={this.props.form}
          handleSubmit={this.handleSubmit}
          center={center}
          routeCoords={routeCoords}
          />}

      </React.Fragment>
    );
  }
}
