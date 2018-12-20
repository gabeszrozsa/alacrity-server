import React from 'react';
import { Avatar } from 'antd';
import './user-avatar.css';

const UserAvatar = ({ displayName, size }) => {

  const monogram = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className="user-avatar" size={size || 'default'} title={displayName}>
      {monogram}
    </Avatar>
  );
}

export default UserAvatar;
