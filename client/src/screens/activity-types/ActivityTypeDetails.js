import React from 'react'

import { ActivityTypeService } from '../../api';
import { LoadingBar } from '../../components/';

export default class ActivityTypeDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activityType: null
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    ActivityTypeService.getActivityType(id).then(activityType => this.setState({
      isFetching: false,
      activityType: activityType
    }));
  }

  renderActivityType() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Sportág betöltése..."/>);
    } else {
      // TODO: empty text msg
      content =
        <p key={this.state.activityType._id}>
          {this.state.activityType.name}
        </p>;
    }
    return content;
  }

  render () {
    const Loc = this.renderActivityType();

    return (Loc);
  }
}
