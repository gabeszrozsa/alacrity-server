import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './login.css'
import background from './background.jpg';

const AuthLayout = ({children, ...rest}) => {
  return (
    <div className="auth">
      <div className="auth-bg" style={{backgroundImage: `url(${background})`}}>
        <div className="auth-divider"></div>
      </div>
      <div className="auth-form">
        <h1 className="auth-title">Alacrity</h1>
        {children}
      </div>
    </div>
  )
}

const AuthRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <AuthLayout>
          <Component {...matchProps} />
      </AuthLayout>
    )} />
  )
};

export default AuthRoute;
