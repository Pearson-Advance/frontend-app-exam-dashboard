import React from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Footer from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import SchedulePage from 'features/SchedulePage';
import DashboardPage from 'features/DashboardPage';
import ExamErrorSSO from 'features/ExamErrorSSO';

const Main = () => (
  <>
    <Header />
    <Routes>
      <Route path="/error" element={<ExamErrorSSO />} />
      <Route path="/exam" element={<SchedulePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    <Footer />
  </>
);

export default Main;
