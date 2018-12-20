import React from 'react';
import { List, Avatar, Icon } from 'antd';

import ActivityDetailsFooter from './ActivityDetailsFooter';
import LocationMap from '../../../components/LocationMap';
import { formatDistance, formatDuration, formatDate } from '../../../utils';
import { IconText, UserAvatar } from './../../../components/';

const ActivityDetailsPane = (props) => {
  const durationText = props.activity.durationInSeconds ? formatDuration(props.activity.durationInSeconds) : '-';
  const distanceText = props.activity.distanceInMeters ? formatDistance(props.activity.distanceInMeters) : '-';

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={[props.activity]}
      footer={<ActivityDetailsFooter {...props}/>}
      renderItem={item => (
        <List.Item
          key={item._id}
          actions={[
            <IconText type="rise" text={durationText} />,
            <IconText type="dashboard" text={distanceText} />
          ]}
          extra={
            <LocationMap loc={item.location_id} width={'400px'} marker={false}/>
          }
        >
          <List.Item.Meta
            avatar={<UserAvatar displayName={item.createdBy.displayName}/>}
            title={item.activityType_id.name}
            description={formatDate(item.date)}
          />
          {item.location_id.name}
        </List.Item>
      )}
    />
  )
}

export default ActivityDetailsPane;
