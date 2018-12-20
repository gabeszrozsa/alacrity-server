import React from 'react'
import { Divider, Icon, message } from 'antd';

import { LoadingBar } from '../../components';
import { LocationService } from '../../api';
import LocationForm from './LocationForm';

export default class EditLocation extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      loc: null
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    LocationService.getLocation(id).then(loc => {
        this.setState({
          isFetching: false,
          loc: loc
        });

        this.props.form.setFieldsValue({
          name: loc.name,
          coordinates: loc.coordinates
        })
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        LocationService.updateLocation(id, data)
          .then(result => {
            const redirectUrl = `/locations/${id}`;
            message.success('Helyszín frissítve!');
            this.props.history.push(redirectUrl);
          });
      }
    });
  }

  render() {
    if (this.state.isFetching) {
      return (<LoadingBar text="Fetching location..."/>);
    } else {
      return (
        <React.Fragment>
          <Divider>
            <Icon type="pushpin" theme="outlined" style={{marginRight: '5px'}}/>
            Helyszín szerkesztése
          </Divider>

          <LocationForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            buttonText={'Mentés'}
          />

        </React.Fragment>
      );
    }
  }
}
