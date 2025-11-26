import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import Footer from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import SchedulePage from 'features/SchedulePage';
import DashboardPage from 'features/DashboardPage';
import ExamErrorSSO from 'features/ExamErrorSSO';

const Main = () => (
  <BrowserRouter basename={getConfig().EXAM_DASHBOARD_PATH}>
    <Header />
    <Switch>
      <Route path="/error" component={ExamErrorSSO} />
      <Route path="/exam" component={SchedulePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Redirect to="/dashboard" />
    </Switch>
    <Footer />
  </BrowserRouter>
);

export default Main;
