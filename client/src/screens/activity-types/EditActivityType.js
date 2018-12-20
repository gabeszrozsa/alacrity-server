import React from 'react'
import { Divider, Icon, message, Form } from 'antd';

import { LoadingBar } from '../../components';
import { ActivityTypeService } from '../../api';
import ActivityTypeForm from './ActivityTypeForm';

class EditActivityType extends React.Component {
  constructor() {
    super();
    this.state = {
      isFetching: true,
      activityType: null
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    ActivityTypeService.getActivityType(id).then(activityType => {
        this.setState({
          isFetching: false,
          activityType: activityType
        });

        this.props.form.setFieldsValue({ name: activityType.name })
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        ActivityTypeService.updateActivityType(id, data)
          .then(result => {
            const redirectUrl = `/activity-types`;
            message.success('Sportág frissítve!');
            this.props.history.push(redirectUrl);
          });
      }
    });
  }

  render() {
    if (this.state.isFetching) {
      return (<LoadingBar text="Fetching location..."/>);
    } else {
      return (
        <React.Fragment>
          <Divider>
            <Icon type="crown" theme="outlined" style={{marginRight: '5px'}}/>
            Sportág szerkesztése
          </Divider>

          <ActivityTypeForm
            form={this.props.form}
            handleSubmit={this.handleSubmit}
            buttonText={'Mentés'}
          />

        </React.Fragment>
      );
    }
  }
}

const EditActivityTypeForm = Form.create()(EditActivityType);
export default EditActivityTypeForm;
