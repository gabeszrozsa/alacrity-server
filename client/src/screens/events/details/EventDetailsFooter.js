import React from 'react'
import { Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom'

const EventDetailsFooter = (props) => {
  const icon = (props.isAttending) ? 'check' : 'star';
  return (
    <React.Fragment>
      <Button className='add-button' ghost={!props.isAttending} type="primary" icon={icon} onClick={() => props.onAttend()}>
        Érdekel
      </Button>
      <Link to={"/events/edit/" + props.evt._id}>
        <Button className='add-button' ghost type="primary" icon="edit">
          Szerkesztés
        </Button>
      </Link>
      <Popconfirm title="Biztos, hogy törölni szeretnéd?" onConfirm={props.onDeleteEvent} okText="Igen" cancelText="Nem">
        <Button className='add-button' ghost type="danger" icon="delete">
          Törlés
        </Button>
      </Popconfirm>
  </React.Fragment>
  )
}

export default EventDetailsFooter;
