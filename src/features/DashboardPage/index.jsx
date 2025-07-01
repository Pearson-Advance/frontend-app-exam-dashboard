import React from 'react';
import { Tabs, Tab } from '@edx/paragon';
import Header from '@edx/frontend-component-header';

import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';
import './index.scss';

const DashboardPage = () => (
  <div className="dashboard-container">
    <Header />
    <div className="tabs-container">
      <Tabs
        defaultActiveKey="exams"
        id="tabs"
        variant="button-group"
        className="tabs-wrapper"
      >
        <Tab eventKey="exams" title="Exams" className="tab-content-wrapper">
          <NoContentPlaceholder />
        </Tab>
        <Tab eventKey="past-exams" title="Past Exams" className="tab-content-wrapper">
          <NoContentPlaceholder title="No past exams found" description="It looks like you do not have past exams." />
        </Tab>
      </Tabs>
    </div>
  </div>
);

export default DashboardPage;
