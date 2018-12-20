import React from 'react'
import { Layout, Icon, Button } from 'antd';

import { AuthService } from './../../api/';
import UserAvatar from './../../components/UserAvatar';
import './dashboard-header.css';

const { Header } = Layout;

export default class AppLayoutHeader extends React.Component {
  logoutUser = () => {
    AuthService.logout().then(() => this.props.history.push('/'));
  }

  render () {
    const user = AuthService.currentUser();
    return (
      <Header id="header">
          <h2>
            <UserAvatar displayName={user.displayName} size='large'/>
            { user.displayName }
            <Button className="logout" onClick={this.logoutUser}>
                Kilépés
            </Button>
          </h2>
      </Header>
    )
  }
}
