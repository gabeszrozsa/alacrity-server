import React from 'react'
import { Form, Input, Button } from 'antd';
const FormItem = Form.Item;

const LocationForm = (props) => {
  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
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
        offset: 8,
      },
    },
  };

  return (
    <Form onSubmit={props.handleSubmit}>

      <FormItem {...formItemLayout} label={'Név'}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Kérlek adj meg egy nevet!', whitespace: true }],
        })(
          <Input/>
        )}
      </FormItem>


      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">{props.buttonText}</Button>
      </FormItem>
    </Form>
  )
}

export default LocationForm;
