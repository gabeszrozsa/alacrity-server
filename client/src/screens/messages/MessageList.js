import React from 'react';
import { List, Avatar } from 'antd';

import { formatFullDate } from './../../utils/';
import UserAvatar from './../../components/UserAvatar';

const Title = ({ name, date }) => (
  <React.Fragment>
    {name}
    <span className="message-date">{formatFullDate(date)}</span>
  </React.Fragment>
)

const MessageList = ({ messages, partner }) => (
  <List
    itemLayout="horizontal"
    dataSource={messages}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<UserAvatar displayName={item[partner].displayName} />}
          title={<Title name={item[partner].displayName} date={item.createdAt} />}
          description={item.text}
        />
      </List.Item>
    )}
  />
);

export default MessageList;
