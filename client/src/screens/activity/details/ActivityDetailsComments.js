import React from 'react'
import { List, Avatar, message, Input, Button, Popconfirm, Icon } from 'antd';

import { ActivityService } from '../../../api';
import UserAvatar from './../../../components/UserAvatar';

const { TextArea } = Input;

const DeleteComment = ({ id, onDeleteComment }) => {
  return (
    <Popconfirm title="Biztos, hogy törölni szeretnéd?" onConfirm={() => onDeleteComment(id)} okText="Igen" cancelText="Nem">
      <a style={{color: '#f5222d'}}>
        <Icon type="delete" theme="outlined" /> Törlés
      </a>
    </Popconfirm>
  )
}

export default class ActivityDetailsComments extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      comments: [],
      commentText: ''
    };
  }

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = () => {
    ActivityService.getComments(this.props.activity._id).then(comments => {
      this.setState({ comments, isFetching: false });
    });
  }

  handleCommentTextChange = (e) => {
    this.setState({ commentText: e.target.value });
  }

  handleCommentAdd = () => {
    const text = this.state.commentText
    if (text) {

      ActivityService.addNewComment(this.props.activity._id, { text })
        .then(comments => {
          this.setState({ comments, commentText: '' });
          this.updateActivityWithComments(comments);
        })

    } else {
      message.warning('Üres hozzászólást nem lehet elküldeni!');
    }
  }

  deleteComment = (commentId) => {
    ActivityService.deleteComment(this.props.activity._id, commentId)
      .then(comments => {
        this.setState({ comments });
        this.updateActivityWithComments(comments)
      });
  }

  updateActivityWithComments = (comments) => {
    const updatedActivity = { ...this.props.activity, comments };
    this.props.onUpdateActivity(updatedActivity);
  }

  render () {
    const { isFetching, comments } = this.state;

    return (
      <React.Fragment>
      <List
        loading={isFetching}
        dataSource={comments}
        locale={{ emptyText: 'Nincs hozzászólás.'}}
        renderItem={item => (
          <List.Item
            actions={[<DeleteComment id={item._id} onDeleteComment={this.deleteComment}/>]}
            style={{display: 'flex'}}
            >
              <List.Item.Meta
                avatar={<UserAvatar displayName={item.createdBy.displayName} />}
                title={<a href="https://ant.design">{item.createdBy.displayName}</a>}
                description={item.text}
              />
          </List.Item>
        )}
      />

    <TextArea rows={4} value={this.state.commentText} onChange={this.handleCommentTextChange}/>
     <Button type="primary" onClick={this.handleCommentAdd}>Küldés</Button>
      </React.Fragment>
    )
  }
}
