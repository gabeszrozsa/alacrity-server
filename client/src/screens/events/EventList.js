import React from 'react'
import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom'

import { EventService } from '../../api';
import { LoadingBar } from '../../components';
import EventThumbnail from './EventThumbnail';

export default class EventList extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      events: []
    }
  }

  componentDidMount() {
    EventService.getAllEvents().then(events => this.setState({
      isFetching: false,
      events: events
    }));
  }

  renderEvents() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Helyszínek betöltése..."/>);
    } else {

      if (this.state.events.length > 0) {
        content = this.state.events.map(ev => (
          <EventThumbnail details edit attendees key={ev._id} ev={ev}/>
        ));
      } else {
        content = <h2>Még egy eseményt sem szerveztek.</h2>
      }
    }
    return content;
  }

  render () {
    const Events = this.renderEvents();

    // TODO: layout!!
    //
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <Link to="/events/add">
              <Button className='add-button' type="primary" icon="schedule" size='large'>
                Esemény szervezése
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            { Events }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
