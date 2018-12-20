import React from 'react'
import { Avatar, Card } from 'antd';

import { formatFullDate } from '../../../utils';
import UserAvatar from './../../../components/UserAvatar';

const { Meta } = Card;

const ActivityDetailsLikes = (props) => {
  return props.likes.map(like => {
    return (
      <Card key={like._id} style={{ width: 300, marginTop: 16 }}>
        <Meta
          avatar={<UserAvatar displayName={like.createdBy.displayName} />}
          title={like.createdBy.displayName}
          description={formatFullDate(like.createdAt)}
        />
      </Card>
    )
  })
}
 export default ActivityDetailsLikes;
