import React from 'react'
import { Divider, Icon, message } from 'antd';
import { ActivityService, ActivityTypeService, LocationService } from '../../api';
import { LoadingBar } from '../../components';
import ActivityForm from './ActivityForm';
import { convertDurationToSeconds } from './../../utils/';

export default class AddActivity extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      locations: [],
      activityTypes: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const durationInSeconds = convertDurationToSeconds(values.durationHours, values.durationMinutes, values.durationSeconds);
        const { activityType_id, date, distanceInMeters, location_id } = values;
        const activityData = { activityType_id, date, distanceInMeters, location_id };
        if (durationInSeconds > 0) {
          activityData.durationInSeconds = durationInSeconds;
        }

        ActivityService.addNewActivity(activityData).then(id => {
          const redirectUrl = `/activity/${id}`;
          message.info('Tevékenység hozzáadva!');
          this.props.history.push(redirectUrl);
        });
      }
    });
  }

  componentDidMount() {
    Promise.all([
      this.fetchActivityTypes(),
      this.fetchLocations()
    ]).then(res => {
      this.setState({ isFetching: false });
      this.fillDefaultDuration();
    })
  }

  fillDefaultDuration = () => {
    this.props.form.setFieldsValue({
      durationHours: 0,
      durationMinutes: 0,
      durationSeconds: 0,
    })
  }

  fetchLocations = () => {
    LocationService.getAllLocations().then(locations => {
      this.setState({
        locations: locations
      });
    });
  }

  fetchActivityTypes = () => {
    ActivityTypeService.getAllActivityTypes().then(activityTypes => {
      this.setState({ activityTypes: activityTypes });
    });
  }

  render() {
    if (this.state.isFetching) {
      return (<LoadingBar text="Tevékenység betöltése..."/>);
    } else {
      return (
        <React.Fragment>
          <Divider>
            <Icon type="crown" theme="outlined" style={{marginRight: '5px'}}/>
            Tevékenység rögzítése
          </Divider>

          <ActivityForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            buttonText={'Hozzáadás'}
            activityTypes={this.state.activityTypes}
            locations={this.state.locations}
          />

        </React.Fragment>
      );
    }
  }
}
