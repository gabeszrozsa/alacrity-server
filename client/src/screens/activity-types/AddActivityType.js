import React from 'react'
import { Divider, Icon, message, Form } from 'antd';
import { ActivityTypeService } from '../../api';
import ActivityTypeForm from './ActivityTypeForm';

class AddActivityType extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ActivityTypeService.addNewActivityType(values).then(id => {
          const redirectUrl = `/activity-types/`;
          message.info('Sportág hozzáadva!');
          this.props.history.push(redirectUrl);
        });
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Divider>
          <Icon type="crown" theme="outlined" style={{marginRight: '5px'}}/>
          Sportág rögzítése
        </Divider>

        <ActivityTypeForm
          form={this.props.form}
          handleSubmit={this.handleSubmit}
          buttonText={'Hozzáadás'}
        />

      </React.Fragment>
    );
  }
}

const AddActivityTypeForm = Form.create()(AddActivityType);
export default AddActivityTypeForm;
