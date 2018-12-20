import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { Menu, Header } from './';
import AuthService from '../../api/AuthService'

const { Content, Footer, Sider } = Layout;

const DashboardLayout = ({children, location, ...rest}) => {
  const path = children.props.location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Sider>
        <div className="logo" />
        <Menu path={path}/>
      </Sider>

      <Layout>
        <Header {...children.props}/>
        <Content className='app-content'>
          {children}
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Alacrity ©2018 Created by Gabesz
        </Footer>

      </Layout>
    </Layout>
  )
}

const DashboardRoute = ({component: Component, ...rest}) => {
  const isLoggedIn = AuthService.isLoggedIn();
  return (
    <Route {...rest} render={matchProps => isLoggedIn
      ? (<DashboardLayout><Component {...matchProps} /></DashboardLayout>)
      : (<Redirect to={{ pathname: '/login', state: { from: matchProps.location } }} />)
    }/>
  )
};

export default DashboardRoute;
