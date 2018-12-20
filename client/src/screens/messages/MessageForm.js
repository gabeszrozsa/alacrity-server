import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const { TextArea } = Input;

class MessageForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        this.props.onSendMessage(fieldsValue);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    const UserOptions = this.props.users.map(user => (
      <Option key={user._id} value={user._id}>{user.displayName}</Option>
    ));

    return (
      <Form onSubmit={this.handleSubmit}>

        <FormItem {...formItemLayout} label='Címzett' hasFeedback>
            {getFieldDecorator('recipient_id', {
              rules: [
                { required: true, message: 'Kérlek válaszd ki a címzettet!' },
              ],
            })(
              <Select placeholder="Címzett">
                { UserOptions }
              </Select>
            )}
        </FormItem>

        <FormItem {...formItemLayout} label='Üzenet'>
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Kérlek ne hagyd üresen a szöveget!', whitespace: true }],
          })(
            <TextArea rows={10} placeholder="Szöveg"/>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" size='large' htmlType="submit">Küldés</Button>
        </FormItem>
      </Form>
    )
  }

}

const WrappedMessageForm = Form.create()(MessageForm);
export default WrappedMessageForm;
