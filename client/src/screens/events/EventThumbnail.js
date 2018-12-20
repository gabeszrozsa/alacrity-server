import React from 'react';
import { Card, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { formatFullDate } from './../../utils/';

import './event-thumbnail.css';
const { Meta } = Card;

const EventThumbnail = (props) => {
  const actions = [];

  if (props.details) {
    actions.push(<Link to={'/events/' + props.ev._id}><Icon type="eye" /> Részletek</Link>);
  }

  if (props.edit) {
    actions.push(<Link to={'/events/edit/' + props.ev._id}><Icon type="edit" /> Szerkesztés</Link>);
  }

  if (props.attendees) {
    actions.push(<Link to={'/events/' + props.ev._id}><Icon type="team" /> {props.ev.attendees.length} résztvevő</Link>);
  }

  const width = (actions.length === 3 ) ? 400 : 300;

  return (
    <Card className="event-thumbnail" style={{width: width}}
      actions={actions}
    >
      <Meta
        title={props.ev.name}
        description={
          <React.Fragment>
            <span>{props.ev.location.name}</span>
            <br/>
            <span>({formatFullDate(props.ev.date)})</span>
          </React.Fragment>
        }
      />
    </Card>
  )
}

export default EventThumbnail;
