import React from 'react'
import { Divider, Icon, message, Form } from 'antd';
import { EventService, LocationService } from '../../api';
import { LoadingBar } from '../../components';
import EventForm from './EventForm';

class AddEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      locations: []
    };
  }

  componentDidMount() {
    LocationService.getAllLocations().then(locations => this.setState({
      isFetching: false,
      locations: locations
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'date': fieldsValue['date'].toISOString(),
        };

        EventService.addNewEvent(values).then(id => {
          const redirectUrl = `/events/${id}`;
          message.info('Esemény létrehozva!');
          this.props.history.push(redirectUrl);
        });
      }
    });
  }

  render() {
    if (this.state.isFetching) {
      return (<LoadingBar text="Betöltés..."/>);
    } else {
      return (
        <React.Fragment>
          <Divider>
            <Icon type="schedule" theme="outlined" style={{marginRight: '5px'}}/>
            Esemény szervezése
          </Divider>

          <EventForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            locations={this.state.locations}
            buttonText={'Létrehozás'}
          />

        </React.Fragment>
      );
    }
  }
}
const AddEventForm = Form.create()(AddEvent);
export default AddEventForm;
