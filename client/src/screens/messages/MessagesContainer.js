import React, { Component } from 'react';
import { Row, Col, Tabs, Icon, message } from 'antd';

import { MessageService, AuthService } from './../../api/';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { LoadingBar } from './../../components/';
import './messages.css';

const TabPane = Tabs.TabPane;

export default class MessagesContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      messages: [],
      users: []
    }
  }

  componentDidMount() {
    const currentUser = AuthService.currentUser()._id;

    Promise.all([
      AuthService.getAll(),
      MessageService.getMyMessages()
    ])
    .then(result => this.setState({
      isFetching: false,
      users: result[0].filter(u => u._id !== currentUser),
      messages: result[1]
    }));
  }

  handleSendMessage = (values) => {
    MessageService.sendMessage(values)
      .then(messages => {
        message.info('Üzenet elküldve!');
        this.setState({ messages });
      });
  }

  render() {
    const { messages, isFetching } = this.state;

    if (isFetching) {
      return (<LoadingBar text="Üzenetek betöltése..."/>);
    } else {
      return (
        <Row>
          <Col span={12}>
            <MessageForm
              onSendMessage={this.handleSendMessage}
              users={this.state.users}
            />
          </Col>
          <Col span={12}>
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon type="inbox"/>Bejövő ({messages.received.length})</span>} key="1">
                <MessageList partner='createdBy' messages={messages.received} />
              </TabPane>
              <TabPane tab={<span><Icon type="arrow-right"/>Elküldött ({messages.sent.length})</span>} key="2">
                <MessageList partner='recipient_id' messages={messages.sent} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      );
    }
  }

}
