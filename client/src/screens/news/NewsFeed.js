import React from 'react';
import { Card, Row, Col, Progress, Avatar, Icon, Divider } from 'antd';
import { Link } from 'react-router-dom'

import { LoadingBar, IconText, UserAvatar } from '../../components';
import { EventService, ActivityService } from '../../api';
import EventThumbnail from './../events/EventThumbnail';
import { formatDistance, formatDuration, formatDate } from '../../utils';
const { Meta } = Card;

const ActivityThumbnail = (props) => {
  const durationText = props.activity.durationInSeconds ? formatDuration(props.activity.durationInSeconds) : '-';
  const distanceText = props.activity.distanceInMeters ? formatDistance(props.activity.distanceInMeters) : '-';

  return (
    <Card className="activity-thumbnail"
      title={props.activity.location_id.name}
      extra={<UserAvatar displayName={props.activity.createdBy.displayName}/>}
      actions={[
        <Link to={'/activity/' + props.activity._id}><Icon type="eye" /> Részletek</Link>,
        <Link to={'/activity/' + props.activity._id}><Icon type="like" /> {props.activity.likes.length}</Link>,
        <Link to={'/activity/' + props.activity._id}><Icon type="message" /> {props.activity.comments.length}</Link>,
      ]}
    >
      <Meta
        title={formatDate(props.activity.date)}
        description={
          <React.Fragment>
            {props.activity.activityType_id.name}
            <br/>
            <IconText type="rise" text={distanceText} />
            <span className="divider">|</span>
            <IconText type="dashboard" text={durationText} />
          </React.Fragment>
        }
      />
    </Card>
  )
}

export default class NewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activities: [],
      events: []
    }
  }

  componentDidMount() {
    Promise.all([
      ActivityService.getAllActivities(),
      EventService.getRecentEvents()
    ])
    .then(result => this.setState({
      isFetching: false,
      activities: result[0],
      events: result[1]
    }));
  }

  renderEvents() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Helyszínek betöltése..."/>);
    } else {

      if (this.state.events.length > 0) {
        content = this.state.events.map(ev => (
            <EventThumbnail details attendees key={ev._id} ev={ev}/>
        ));
      } else {
        content = <p>Még senki sem szervezett eseményt.</p>
      }
    }
    return content;
  }

  renderActivities() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Tevékenységek betöltése..."/>);
    } else {

      if (this.state.activities.length > 0) {
        content = this.state.activities.map(activity => (
          <ActivityThumbnail key={activity._id} activity={activity}/>
        ));
      } else {
        content = <p>Nincs rögzített sporttevékenység.</p>
      }
    }
    return content;
  }

  render () {
    const Events = this.renderEvents();
    const Activities = this.renderActivities();
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <Divider className="news-header-divider">
              <Icon type="trophy" />
              Legfrissebb sporttevékenységek
            </Divider>
          </Col>
          <Col span={24}>
            { Activities }
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Divider className="news-header-divider">
              <Icon type="schedule" />
              Közelgő események
            </Divider>
          </Col>
          <Col span={24}>
            { Events }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
