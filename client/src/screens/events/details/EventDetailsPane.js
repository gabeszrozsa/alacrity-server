import React from 'react';
import { List, Avatar } from 'antd';

import eventPic from './icon_event.png';

import { formatFullDate } from '../../../utils';

const EventDetailsPane = (props) => {

  const Description = ({ date, location }) => {
    return (
      <React.Fragment>
        <span><b>Helyszín:</b> {location.name}</span>
        <br/>
        <span><b>Időpont:</b> {formatFullDate(date)}</span>
      </React.Fragment>
    )
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={[props.evt]}
      renderItem={item => (
        <List.Item
          key={item._id}
        >
          <List.Item.Meta
            avatar={<Avatar src={eventPic} />}
            title={item.name}
            description={<Description {...item}/>}
          />
        </List.Item>
      )}
    />
  )
}

export default EventDetailsPane;
