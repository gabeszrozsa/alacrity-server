import React from 'react'
import { Button, Card, Icon, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom'

import { ActivityTypeService } from '../../api';
import { LoadingBar } from '../../components';

import './activity-type-thumbnail.css';
const { Meta } = Card;

export default class ActivityTypeList extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activityTypes: []
    }
  }

  componentDidMount() {
    this.fetchActivityTypes();
  }

  fetchActivityTypes = () => {
    ActivityTypeService.getAllActivityTypes().then(activityTypes => this.setState({
      isFetching: false,
      activityTypes: activityTypes
    }));
  }

  deleteActivityType = (id) => {
    this.setState({ isFetching: true });
    ActivityTypeService.deleteActivityType(id)
      .then(() => {
        message.success('Sportág törölve!');
        this.fetchActivityTypes();
      });
  }

  renderActivityTypes() {
    let content;
    if (this.state.isFetching) {
      content = (<LoadingBar text="Sportágak betöltése..."/>);
    } else {

      if (this.state.activityTypes.length > 0) {
        content = this.state.activityTypes.map(activityType => (
          <Card key={activityType._id} className="activity-type-thumbnail"
            actions={[
              <Link to={'/activity-types/edit/' + activityType._id}><Icon type="edit" /> Szerkesztés</Link>,
              <span onClick={() => this.deleteActivityType(activityType._id)} style={{color: '#f5222d'}}><Icon type="delete" /> Törlés</span>,
            ]}
            >
              <Meta
                title={activityType.name}
              />
            </Card>
          ));
      } else {
        content = <h2>Még egy sportágat sem rögzítettek.</h2>
      }
    }
    return content;
  }

  render () {
    const ActivityTypes = this.renderActivityTypes();

    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <Link to="/activity-types/add">
              <Button className='add-button' type="primary" icon="crown" size='large'>
                Sportág rögzítése
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            { ActivityTypes }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
