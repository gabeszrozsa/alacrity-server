import React, { Component } from 'react';
import { Form } from 'antd';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { DashboardRoute, AuthRoute } from './';
import AuthService from './../api/AuthService';
import { NewsFeed, Messages, Events, Locations,
  Activities, ActivityTypes, Login, Register } from '../screens';

export default class AppLayout extends Component {
  render() {
    const AddActivityForm = Form.create()(Activities.Add);
    const EditActivityForm = Form.create()(Activities.Edit);

    const AddLocationForm = Form.create()(Locations.Add);
    const EditLocationForm = Form.create()(Locations.Edit);

    const isLoggedIn = AuthService.isLoggedIn();
    const RedirectTo = (isLoggedIn) ? <Redirect to="/news" /> : <Redirect to="/login" />

    return (
      <Router>
        <Switch>
          <Route exact path="/">
            { RedirectTo }
          </Route>

          <AuthRoute exact path="/login" component={Login}/>
          <AuthRoute exact path="/register" component={Register}/>

          <DashboardRoute exact path="/events" component={Events.List} />
          <DashboardRoute exact path="/events/add" component={Events.Add} />
          <DashboardRoute exact path="/events/edit/:id" component={Events.Edit} />
          <DashboardRoute exact path="/events/:id" component={Events.Details} />

          <DashboardRoute exact path="/locations" component={Locations.List} />
          <DashboardRoute exact path="/locations/add" component={AddLocationForm} />
          <DashboardRoute exact path="/locations/edit/:id" component={EditLocationForm} />
          <DashboardRoute exact path="/locations/:id" component={Locations.Details} />

          <DashboardRoute exact path="/activity" component={Activities.List} />
          <DashboardRoute exact path="/activity/add" component={AddActivityForm} />
          <DashboardRoute exact path="/activity/edit/:id" component={EditActivityForm} />
          <DashboardRoute exact path="/activity/:id" component={Activities.Details} />

          <DashboardRoute exact path="/activity-types" component={ActivityTypes.List} />
          <DashboardRoute exact path="/activity-types/add" component={ActivityTypes.Add} />
          <DashboardRoute exact path="/activity-types/edit/:id" component={ActivityTypes.Edit} />
          <DashboardRoute exact path="/activity-types/:id" component={ActivityTypes.Details} />

          <DashboardRoute exact path="/news" component={NewsFeed} />
          <DashboardRoute exact path="/messages" component={Messages} />
        </Switch>
      </Router>
    );
  }

}
