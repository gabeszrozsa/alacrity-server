import React from 'react'
import { message } from 'antd';

import { ActivityService, AuthService } from '../../../api';
import { LoadingBar } from './../../../components/';
import ActivityDetailsPane from './ActivityDetailsPane';

export default class ActivityDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      isLiked: false,
      activity: null,
      likes: []
    }
  }

  componentDidMount() {
    this.fetchActivity();
    this.fetchLikes();
  }

  fetchActivity = () => {
    const id = this.props.match.params.id;
    ActivityService.getActivity(id)
      .then(activity => this.setState({ activity, isFetching: false }));
  }

  fetchLikes = () => {
    const id = this.props.match.params.id;
    ActivityService.getLikes(id).then(likes => this.updateStateWithLikes(likes));
  }

  updateStateWithLikes = (likes) => {
    const currentUser = AuthService.currentUser()._id;
    const isLiked = likes.find(like => currentUser === like.createdBy._id);

    this.setState({ likes, isLiked });
  }

  handleUpdateActivity = (activity) => {
    this.setState({ activity });
  }

  handleDeleteActivity = () => {
    ActivityService.deleteActivity(this.state.activity._id)
      .then(res => {
        message.success('Tevékenység törölve!');
        this.props.history.push('/activity');
      })
  }

  handleLike = () => {
    const id = this.props.match.params.id;
    if (this.state.isLiked) {
      ActivityService.deleteLike(id, this.state.isLiked._id)
        .then(likes => this.updateStateWithLikes(likes))
    } else {
      ActivityService.addLike(id)
        .then(likes => this.updateStateWithLikes(likes))
    }
  }

  renderActivity() {
    const { isFetching, activity, likes, isLiked } = this.state;

    let content;
    if (isFetching) {
      content = (<LoadingBar text="Tevékenység betöltése..."/>);
    } else {

      // TODO: empty text msg
      content = <ActivityDetailsPane
        activity={activity}
        likes={likes}
        isLiked={isLiked}
        onDeleteActivity={this.handleDeleteActivity}
        onUpdateActivity={this.handleUpdateActivity}
        onLike={this.handleLike}
        />
    }
    return content;
  }

  render () {
    const Activity = this.renderActivity();
    return (Activity);
  }
}
