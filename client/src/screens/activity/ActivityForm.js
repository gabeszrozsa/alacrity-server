import React from 'react'
import { Form, InputNumber, Button, Select, DatePicker } from 'antd';
import datePickerLocale from './../../utils/datePickerLocale';

const FormItem = Form.Item;
const Option = Select.Option;

const ActivityForm = (props) => {
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

  const ActivityTypeOptions = props.activityTypes.map(activityType => (
    <Option key={activityType._id} value={activityType._id}>
      {activityType.name}
    </Option>
  ));

  const LocationOptions = props.locations.map(loc => (
    <Option key={loc._id} value={loc._id}>{loc.name}</Option>
  ));

  return (
    <Form onSubmit={props.handleSubmit}>

      <FormItem {...formItemLayout} label='Sportág' hasFeedback
      >
        {getFieldDecorator('activityType_id', {
          rules: [
            { required: true, message: 'Kérlek adj meg egy sportágat!' },
          ],
        })(
          <Select placeholder="Válassz egy sportágat!">
            { ActivityTypeOptions }
          </Select>
        )}
      </FormItem>

      <FormItem {...formItemLayout} label='Helyszín' hasFeedback
      >
        {getFieldDecorator('location_id', {
          rules: [
            { required: true, message: 'Kérlek adj meg egy helyszínt!' },
          ],
        })(
          <Select placeholder="Válassz egy helyszínt!">
            { LocationOptions }
          </Select>
        )}
      </FormItem>

      <FormItem {...formItemLayout} label='Időpont'
      >
        {getFieldDecorator('date', {
          rules: [{ type: 'object', required: true, message: 'Kérlek adj meg egy időpontot!' }]
        })(
          <DatePicker locale={datePickerLocale} placeholder="Válassz időpontot!" showTime format="YYYY-MM-DD HH:mm:ss" />
        )}
      </FormItem>

      <FormItem {...formItemLayout} label='Időtartam (óra)'>
        {getFieldDecorator('durationHours', {})(
          <InputNumber min={0}/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label='Időtartam (perc)'>
        {getFieldDecorator('durationMinutes', {})(
          <InputNumber min={0} max={59}/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label='Időtartam (másodperc)'>
        {getFieldDecorator('durationSeconds', {})(
          <InputNumber min={0} max={59}/>
        )}
      </FormItem>

      <FormItem {...formItemLayout} label='Távolság (méter)'>
        {getFieldDecorator('distanceInMeters', {})(
          <InputNumber min={0} />
        )}
      </FormItem>

      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">{props.buttonText}</Button>
      </FormItem>
    </Form>
  )
}

export default ActivityForm;
