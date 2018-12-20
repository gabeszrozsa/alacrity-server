import React from 'react'
import { Avatar, Card, Icon, Popconfirm } from 'antd';

import UserAvatar from './../../../components/UserAvatar';

const { Meta } = Card;

const CardText = ({ name, id, onCancel }) => (
  <React.Fragment>
    <span>{name}</span>
    <Popconfirm
      title="Biztos, hogy eltávolítod a meghívottak közül?"
      onConfirm={() => onCancel(id)}
      okText="Igen"
      cancelText="Nem">
      <Icon type="stop"/>
    </Popconfirm>
  </React.Fragment>
)

const EventDetailsAttendees = (props) => {
  return props.attendees.map(attendee => {
    return (
      <Card className='attendee-card' key={attendee._id}>
        <Meta
          avatar={<UserAvatar displayName={attendee.displayName} />}
          title={
            <CardText
              name={attendee.displayName}
              id={attendee._id}
              onCancel={props.onCancel}
            />}
        />
      </Card>
    )
  })
}
 export default EventDetailsAttendees;
