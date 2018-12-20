import React from 'react'
import moment from 'moment'
import { Divider, Icon, message, Form } from 'antd';

import { LoadingBar } from '../../components';
import { EventService, LocationService } from '../../api';
import EventForm from './EventForm';

class EditEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      locations: [],
      evt: null
    };
  }

  componentDidMount() {
    Promise.all([
      this.fetchEvent(),
      this.fetchLocations()
    ]).then(res => this.setState({ isFetching: false }))
  }

  fetchLocations = () => {
    LocationService.getAllLocations().then(locations => {
      this.setState({
        locations: locations
      });
    });
  }

  fetchEvent = () => {
    const id = this.props.match.params.id;
    EventService.getEvent(id).then(evt => {
      this.setState({ evt: evt });
      this.props.form.setFieldsValue({
        name: evt.name,
        date: moment(evt.date),
        location_id: evt.location._id,
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        EventService.updateEvent(id, data)
          .then(result => {
            const redirectUrl = `/events/${id}`;
            message.success('Esemény frissítve!');
            this.props.history.push(redirectUrl);
          });
      }
    });
  }

  render() {
    if (this.state.isFetching) {
      return (<LoadingBar text="Esemény betöltése..."/>);
    } else {
      return (
        <React.Fragment>
          <Divider>
            <Icon type="schedule" theme="outlined" style={{marginRight: '5px'}}/>
            Esemény szerkesztése
          </Divider>

          <EventForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            locations={this.state.locations}
            buttonText={'Mentés'}
          />

        </React.Fragment>
      );
    }
  }
}
const EditEventForm = Form.create()(EditEvent);
export default EditEventForm;
