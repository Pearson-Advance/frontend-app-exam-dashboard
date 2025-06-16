import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import SchedulePage from 'features/SchedulePage';
import DashboardPage from 'features/DashboardPage';

import Footer from 'components/Footer';

const Main = () => (
  <BrowserRouter basename={getConfig().EXAM_DASHBOARD_PATH}>
    <Switch>
      <Route path="/exam" component={SchedulePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Redirect to="/exam" />
    </Switch>
    <Footer />
  </BrowserRouter>
);

export default Main;
