import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import Auth from '../../api/AuthService';
import { Redirect, Link } from 'react-router-dom'

const FormItem = Form.Item;

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Auth.loginWithCredentials(values.email, values.password)
        .then(() => this.props.history.push('/news'))
        .catch(error => message.error('Hibás jelszó vagy e-mail!'));
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
                rules: [{ required: true, message: 'Kérlek add meg az e-mail címedet!' }],
              })(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Kérlek add meg a jelszavadat (legalább 6 karakter)!', min: 6 }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Jelszó" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Belépés
              </Button>
              <Link to="/register">
                Regisztráció
              </Link>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;
