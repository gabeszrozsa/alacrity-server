import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import Auth from '../../api/AuthService';
import { Redirect, Link } from 'react-router-dom'

const FormItem = Form.Item;

class Register extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Auth.register(values)
          .then(() => this.props.history.push('/news'))
          .catch(error => message.error('Ez az e-mail cím már foglalt!'));
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col span={16} offset={4}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Kérlek add meg az e-mail címedet!', min: 1 }],
              })(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('displayName', {
                rules: [{ required: true, message: 'Kérlek adj meg egy nevet!', min: 1 }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Név" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'A jelszónak legalább 6 karakternek kell lennie!',  min: 6 }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Jelszó" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Regisztráció
              </Button>
              <Link to="/login">
                Belépés meglévő felhasználóval
              </Link>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

const WrappedNormalRegisterForm = Form.create()(Register);
export default WrappedNormalRegisterForm;
