import React from 'react'
import { message, Icon, Row, Col, Divider } from 'antd';

import { EventService, AuthService } from '../../../api';
import { LoadingBar, LocationMap } from '../../../components/';
import EventDetailsPane from './EventDetailsPane';
import EventDetailsFooter from './EventDetailsFooter';
import EventDetailsAttendees from './EventDetailsAttendees';
import EventInviteUsers from './EventInviteUsers';

import './event-details.css'

export default class EventDetailsContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      isAttending: false,
      evt: null,
      attendees: [],
      users: []
    }
  }

  componentDidMount() {
    this.fetchEvent();
    this.fetchAttendees();
    this.fetchUsers();
  }

  fetchEvent = () => {
    const id = this.props.match.params.id;
    EventService.getEvent(id)
      .then(evt => this.setState({ evt, isFetching: false }));
  }

  fetchAttendees = () => {
    const id = this.props.match.params.id;
    EventService.getAttendees(id).then(attendees => this.updateStateWithAttendees(attendees));
  }

  fetchUsers = () => {
    AuthService.getAll().then(users => this.setState({ users }));
  }

  updateStateWithAttendees = (attendees) => {
    const currentUser = AuthService.currentUser()._id;
    const isAttending = attendees.find(attendee => currentUser === attendee._id);

    this.setState({ attendees, isAttending });
  }

  handleDeleteEvent = () => {
    EventService.deleteEvent(this.state.evt._id)
      .then(res => {
        message.success('Esemény törölve!');
        this.props.history.push('/events');
      })
  }

  handleCancel = (user) => {
    const id = this.props.match.params.id;
    EventService.cancelEvent(id, { attendee: user})
      .then(attendees => this.updateStateWithAttendees(attendees))
  }

  handleInvite = (users) => {
    const id = this.props.match.params.id;
    EventService.inviteUsers(id, { attendees: users })
      .then(attendees => this.updateStateWithAttendees(attendees))
  }

  handleAttend = () => {
    const currentUser = AuthService.currentUser()._id;

    if (this.state.isAttending) {
      this.handleCancel(currentUser);
    } else {
      this.handleInvite([currentUser]);
    }
  }

  renderEvent() {
    const { isFetching, isAttending, evt, attendees, users } = this.state;

    let content;
    if (isFetching) {
      content = (<LoadingBar text="Esemény betöltése..."/>);
    } else {

      const invitedUsers = (attendees.length > 0) ? attendees.map(a => a._id) : [];
      const notInvitedUsers = (users.length > 0) ? users.filter(u => !invitedUsers.includes(u._id)) : [];

      content = (
        <Row>
          <Col span={12}>
            <LocationMap loc={evt.location} width={'400px'} polyline={false}/>

            <EventDetailsPane
                evt={evt}
                onDeleteEvent={this.handleDeleteEvent}
                onAttend={this.handleAttend}
                />

            <EventDetailsFooter
              onAttend={this.handleAttend}
              onDeleteEvent={this.handleDeleteEvent}
              evt={evt}
              isAttending={isAttending}
              />
          </Col>
          <Col span={12}>
            <EventInviteUsers
              users={notInvitedUsers}
              onInviteUsers={this.handleInvite}
            />

            <Divider>
              <Icon type="team"/>Résztvevők ({attendees.length})
            </Divider>
            <EventDetailsAttendees
              attendees={attendees}
              onCancel={this.handleCancel}
            />
          </Col>
        </Row>
        )
    }
    return content;
  }

  render () {
    return this.renderEvent();
  }
}
