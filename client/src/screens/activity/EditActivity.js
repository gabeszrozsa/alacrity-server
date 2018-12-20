import React from 'react';
import moment from 'moment';
import { Divider, Icon, message } from 'antd';

import { LoadingBar } from '../../components';
import { ActivityService, ActivityTypeService, LocationService } from '../../api';
import ActivityForm from './ActivityForm';
import { splitDurationInSeconds, convertDurationToSeconds } from './../../utils/';

export default class EditActivity extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activity: null,
      locations: [],
      activityTypes: []
    };
  }

  fetchActivity = () => {
    const id = this.props.match.params.id;
    ActivityService.getActivity(id).then(activity => {
        this.setState({ activity });

        const { durationHours, durationMinutes, durationSeconds } = splitDurationInSeconds(activity.durationInSeconds);
        this.props.form.setFieldsValue({
          date: moment(activity.date),
          location_id: activity.location_id._id,
          activityType_id: activity.activityType_id._id,
          distanceInMeters: activity.distanceInMeters,
          durationHours,
          durationMinutes,
          durationSeconds,
        })
    });
  }

  fetchLocations = () => {
    LocationService.getAllLocations().then(locations => {
      this.setState({ locations: locations });
    });
  }

  fetchActivityTypes = () => {
    ActivityTypeService.getAllActivityTypes().then(activityTypes => {
      this.setState({ activityTypes: activityTypes });
    });
  }

  componentDidMount() {
    Promise.all([
      this.fetchActivity(),
      this.fetchActivityTypes(),
      this.fetchLocations()
    ]).then(res => this.setState({ isFetching: false }))
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const durationInSeconds = convertDurationToSeconds(values.durationHours, values.durationMinutes, values.durationSeconds);
        const { activityType_id, date, distanceInMeters, location_id } = values;
        const activityData = { activityType_id, date, distanceInMeters, location_id };
        if (durationInSeconds > 0) {
          activityData.durationInSeconds = durationInSeconds;
        }

        ActivityService.updateActivity(id, activityData)
          .then(result => {
            const redirectUrl = `/activity/${id}`;
            message.success('Tevékenység frissítve!');
            this.props.history.push(redirectUrl);
          });
      }
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
            Tevékenység szerkesztése
          </Divider>

          <ActivityForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            buttonText={'Mentés'}
            activityTypes={this.state.activityTypes}
            locations={this.state.locations}
          />

        </React.Fragment>
      );
    }
  }
}
