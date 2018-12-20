import React from 'react';
import { Card, Icon } from 'antd';
import { Link } from 'react-router-dom'

import LocationMap from './../../components/LocationMap';
import './location-thumbnail.css';

const { Meta } = Card;

// TODO: placeholder IMG
const LocationThumbnail = (props) => {
  return (
    <Card className="location-thumbnail"
      cover={
        <LocationMap
          zoomOffset={-1}
          loc={props.loc}
          height={'200px'}
        />
      }
      actions={[
        <Link to={'/locations/' + props.loc._id}><Icon type="eye" /> Részletek</Link>,
        <Link to={'/locations/edit/' + props.loc._id}><Icon type="edit" /> Szerkesztés</Link>,
      ]}
    >
      <Meta
        title={props.loc.name}
      />
    </Card>
  )
}

export default LocationThumbnail;
