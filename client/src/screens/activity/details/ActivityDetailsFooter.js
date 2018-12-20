import React from 'react'
import { Icon, Tabs, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom'

import ActivityDetailsComments from './ActivityDetailsComments';
import ActivityDetailsLikes from './ActivityDetailsLikes';

const TabPane = Tabs.TabPane;
const ActivityDetailsFooter = (props) => {
  return (
    <React.Fragment>
      <Button className='add-button' ghost={!props.isLiked} type="primary" icon="like" onClick={() => props.onLike()}>
        Tetszik
      </Button>
      <Link to={"/activity/edit/" + props.activity._id}>
        <Button className='add-button' ghost type="primary" icon="edit">
          Szerkesztés
        </Button>
      </Link>
      <Popconfirm title="Biztos, hogy törölni szeretnéd?" onConfirm={props.onDeleteActivity} okText="Igen" cancelText="Nem">
        <Button className='add-button' ghost type="danger" icon="delete">
          Törlés
        </Button>
      </Popconfirm>

      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="message"/>Hozzászólások ({props.activity.comments.length})</span>} key="1">
          <ActivityDetailsComments {...props}/>
        </TabPane>
        <TabPane tab={<span><Icon type="like"/>Kedvelések ({props.likes.length})</span>} disabled={props.likes.length === 0} key="2">
          <ActivityDetailsLikes {...props}/>
        </TabPane>
      </Tabs>
  </React.Fragment>
  )
}

export default ActivityDetailsFooter;
