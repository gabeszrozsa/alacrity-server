import React from 'react';
import { Spin } from 'antd';

const LoadingBar = (props) => {
  return (
    <div className="loading">
        <h1>
          <Spin size="large" />
          {props.text}
        </h1>
    </div>
  )
}

export default LoadingBar;
