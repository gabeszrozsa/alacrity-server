import React from 'react'
import { Button } from 'antd';
import { Link } from 'react-router-dom'

import { ActivityService } from '../../../api';
import { LoadingBar } from './../../../components/';
import ActivityTable from './ActivityTable';

export default class ActivityList extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activities: []
    }
  }

  componentDidMount() {
    ActivityService.getMyActivities().then(activities => this.setState({
      isFetching: false,
      activities: activities
    }));
  }

  renderActivities() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Tevékenységek betöltése..."/>);
    } else {

      if (this.state.activities.length > 0) {
        content = <ActivityTable data={this.state.activities} history={this.props.history}/>;
      } else {
        content = <h2>Még nem rögzítettél egy tevékenységet sem.</h2>
      }
    }
    return content;
  }

  render () {
    const Activities = this.renderActivities();

    return (
      <React.Fragment>
        <Link to="/activity/add">
          <Button className='add-button' type="primary" icon="crown" size='large'>
            Tevékenység rögzítése
          </Button>
        </Link>

        { Activities }

      </React.Fragment>
    )
  }
}
