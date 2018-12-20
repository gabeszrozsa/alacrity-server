import React from 'react';
import moment from 'moment';
import { Card, Icon } from 'antd';
import { Link } from 'react-router-dom'

const { Meta } = Card;

// TODO: placeholder IMG
const ActivityThumbnail = (props) => {
  const act = props.activity;
  return (
    <Card style={{ width: 240 }}
      title={act.activityType.name + ' - ' + act.durationInSeconds + 'm'}
      actions={[
        <Link to={'/activity/' + act._id}><Icon type="eye" /></Link>,
        <Link to={'/activity/edit/' + act._id}><Icon type="edit" /></Link>,
        <Icon type="delete" />
      ]}
    >
      <Meta
        title={act.location.name}
        description={moment(act.date).format('YYYY-MM-DD')}
      />
    </Card>
  )
}

export default ActivityThumbnail;
