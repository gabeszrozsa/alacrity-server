import React, { Component } from 'react';
import { Divider, Select, Icon, Button } from 'antd';

const Option = Select.Option;

const buttonStyles = {
  marginTop: '10px',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
}

export default class EventInviteUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invitedUsers: []
    }
  }

  invite = () => {
    this.props.onInviteUsers(this.state.invitedUsers);
    this.setState({ invitedUsers: [] })
  }

  onChange = (value) => {
    this.setState({ invitedUsers: value })
  }

  filter = (value, option) => {
    return option.props.children.toLowerCase().includes(value.toLowerCase());
  }

  render() {
    const invitedUsers = this.state.invitedUsers.length > 0;
    const users = this.props.users
      .map(u => <Option key={u._id}>{u.displayName}</Option>);

    return (
      <React.Fragment>
        <Divider>
          <Icon type="share-alt" />
          Ismerősök meghívása
        </Divider>

        <Select
          allowClear
          mode="multiple"
          className='invite-users-select'
          placeholder="Név"
          size='large'
          onChange={this.onChange}
          value={this.state.invitedUsers}
          filterOption={this.filter}
          optionFilterProp='displayName'
          notFoundContent='Nincs találat'
          >
            {users}
          </Select>

          <Button
            style={buttonStyles}
            disabled={!invitedUsers}
            size='large'
            type="primary"
            onClick={() => this.invite()}>
            Meghívás
          </Button>
        </React.Fragment>
      );
  }

}
