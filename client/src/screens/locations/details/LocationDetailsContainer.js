import React from 'react'
import { List } from 'antd';

import { LocationService } from '../../../api';
import { LoadingBar } from '../../../components';
import LocationThumbnail from '../LocationThumbnail';
import LocationMap from '../../../components/LocationMap';

export default class LocationDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      loc: null
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    LocationService.getLocation(id).then(loc => this.setState({
      isFetching: false,
      loc: loc
    }));
  }

  renderLocation() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Helyszín betöltése..."/>);
    } else {
      content = (
        <React.Fragment>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={[this.state.loc]}
            renderItem={item => (
              <List.Item
                key={item._id}
              >
                <List.Item.Meta
                  title={item.name}
                  description={<LocationMap loc={item}/>}
                />
              </List.Item>
            )}
          />

        </React.Fragment>
      );
    }
    return content;
  }

  render () {
    const Loc = this.renderLocation();

    return (Loc);
  }
}
