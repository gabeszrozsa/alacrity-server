import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'

const ROUTE_KEY_MAP = {
  'news': ['1'],
  'activity': ['2'],
  'activity-types': ['3'],
  'events': ['4'],
  'messages': ['5'],
  'locations': ['6'],
}

export default class AppLayoutMenu extends React.Component {
  render () {
    const route = this.props.path.split('/')[1];
    const selectedKeys = ROUTE_KEY_MAP[route];

    return (
        <Menu theme="dark" selectedKeys={selectedKeys} mode="inline">
            <Menu.Item key="1">
              <Link to="/news">
              <Icon type="solution" />
              <span>Hírfolyam</span>
            </Link>
            </Menu.Item>

            <Menu.Item key="2">
              <Link to="/activity">
              <Icon type="trophy" />
              <span>Sportnapló</span>
            </Link>
            </Menu.Item>

            <Menu.Item key="3">
              <Link to="/activity-types">
              <Icon type="crown" />
              <span>Sportágak</span>
            </Link>
            </Menu.Item>

            <Menu.Item key="4">
              <Link to="/events">
              <Icon type="calendar" />
              <span>Események</span>
            </Link>
            </Menu.Item>

            <Menu.Item key="5">
              <Link to="/messages">
                <Icon type="inbox" theme="outlined" />
                <span>
                  Üzenetek
                </span>
              </Link>
            </Menu.Item>

            <Menu.Item key="6">
              <Link to="/locations">
              <Icon type="environment" />
              <span>Helyszínek</span>
            </Link>
            </Menu.Item>
        </Menu>
    )
  }
}
