import React from 'react';
import { Tabs, Tab, Row } from '@edx/paragon';

import Header from '@edx/frontend-component-header';

import ExamCard from 'components/ExamCard';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import './index.scss';

const DashboardPage = () => (
  <div className="dashboard-container mb-5">
    <Header />
    <div className="tabs-container">
      <Tabs
        defaultActiveKey="exams"
        id="tabs"
        variant="button-group"
        className="tabs-wrapper"
      >
        <Tab eventKey="exams" title="Exams" className="tab-content-wrapper p-3 p-md-4 px-md-5">
          <Row className="mb-4">
            <ExamCard
              title="AI Fundamentals Exam"
              status="complete"
              image="https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740"
              examDetails={[
                { title: 'Voucher number:', description: 'A123-XYZ' },
                { title: 'Issued by:', description: 'OpenAI' },
                { title: 'Issue date:', description: 'Jan 1, 2025' },
              ]}
              additionalExamDetails={[
                { title: 'Expiry date:', description: 'Dec 31, 2025' },
                { title: 'Exam duration:', description: '90 minutes' },
              ]}
              onScheduleExam={() => {}}
              dropdownItems={[
                {
                  label: 'View Results',
                  iconClass: 'fa-regular fa-chart-bar',
                  onClick: () => console.log('Viewing results'),
                },
                {
                  label: 'Download Certificate',
                  iconClass: 'fa-solid fa-download',
                  onClick: () => console.log('Downloading certificate'),
                },
                {
                  label: 'Remove Exam',
                  iconClass: 'fa-solid fa-trash',
                  onClick: () => console.log('Removing exam'),
                },
              ]}
            />

            <ExamCard
              title="Cloud Practitioner Test"
              status="scheduled"
              image=""
              examDetails={[
                { title: 'Voucher number:', description: 'B456-ABC' },
                { title: 'Issued by:', description: 'AWS' },
                { title: 'Issue date:', description: 'Feb 10, 2025' },
              ]}
              additionalExamDetails={[
                { title: 'Scheduled date:', description: 'Mar 15, 2025' },
              ]}
              onScheduleExam={() => {}}
              dropdownItems={[
                {
                  label: 'View Results',
                  iconClass: 'fa-regular fa-chart-bar',
                  onClick: () => console.log('Viewing results'),
                },
                {
                  label: 'Download Certificate',
                  iconClass: 'fa-solid fa-download',
                  onClick: () => console.log('Downloading certificate'),
                },
                {
                  label: 'Remove Exam',
                  iconClass: 'fa-solid fa-trash',
                  onClick: () => console.log('Removing exam'),
                },
              ]}
            />

            <ExamCard
              title="Cybersecurity Basics"
              status="unscheduled"
              image={null}
              examDetails={[
                { title: 'Voucher number:', description: 'C789-DEF' },
                { title: 'Issued by:', description: 'Google' },
                { title: 'Issue date:', description: 'Mar 5, 2025' },
              ]}
              onScheduleExam={() => alert('Redirect to scheduling page')}
            />
            <ExamCard
              title="AI Fundamentals Exam"
              status="complete"
              image="https://img.freepik.com/free-psd/e-learning-poster-design-template_23-2149113596.jpg?semt=ais_hybrid&w=740"
              examDetails={[
                { title: 'Voucher number:', description: 'A123-XYZZZZZZZZZZZZZZZZZZ' },
                { title: 'Issued by:', description: 'OpenAI' },
                { title: 'Issue date:', description: 'Jan 1, 2025' },
                { title: 'Issue date:', description: 'Jan 1, 2025' },
              ]}
              additionalExamDetails={[
                { title: 'Expiry date:', description: 'Dec 31, 2025' },
                { title: 'Exam duration:', description: '90 minutes' },
              ]}
              onScheduleExam={() => {}}
              dropdownItems={[
                {
                  label: 'View Results',
                  iconClass: 'fa-regular fa-chart-bar',
                  onClick: () => console.log('Viewing results'),
                },
                {
                  label: 'Download Certificate',
                  iconClass: 'fa-solid fa-download',
                  onClick: () => console.log('Downloading certificate'),
                },
                {
                  label: 'Remove Exam',
                  iconClass: 'fa-solid fa-trash',
                  onClick: () => console.log('Removing exam'),
                },
              ]}
            />
          </Row>
        </Tab>
        <Tab eventKey="past-exams" title="Past Exams" className="tab-content-wrapper">
          <NoContentPlaceholder title="No past exams found" description="It looks like you do not have past exams." />
        </Tab>
      </Tabs>
    </div>
  </div>
);

export default DashboardPage;
