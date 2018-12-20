import React from 'react';
import { Table } from 'antd';

import { formatDistance, formatDuration, formatDate } from '../../../utils';

const { Column } = Table;

export default class ActivityTable extends React.Component {
  openActivityDetails = (id) => {
    this.props.history.push(`/activity/${id}`);
  }

  render() {
    return (
      <Table
        dataSource={this.props.data}
        rowKey={record => record._id}
        onRow={record => ({
            onClick: () => this.openActivityDetails(record._id)
          })
        }>
        <Column
          title="Időpont"
          dataIndex="date"
          key="date"
          render={date => formatDate(date)}
        />
        <Column
          title="Sportág"
          dataIndex="activityType_id"
          key="activityType_id"
          render={activityType_id => activityType_id.name}
        />
        <Column
          title="Helyszín"
          dataIndex="location_id"
          key="location_id"
          render={location_id => location_id.name}
        />
        <Column
          title="Időtartam"
          dataIndex="durationInSeconds"
          key="durationInSeconds"
          render={durationInSeconds => formatDuration(durationInSeconds)}
        />
        <Column
          title="Távolság"
          dataIndex="distanceInMeters"
          key="distanceInMeters"
          render={distanceInMeters => formatDistance(distanceInMeters)}
        />
      </Table>
    )
  }
}
