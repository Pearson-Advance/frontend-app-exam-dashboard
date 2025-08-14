import React, { useEffect, useState } from 'react';
import {
  Tabs, Tab, Row, Spinner, Toast,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { format } from 'date-fns';
import { logError } from '@edx/frontend-platform/logging';

import Header from '@edx/frontend-component-header';

import ExamCard from 'components/ExamCard';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import { getExams } from 'features/data/api';
import { EXAM_STATUS_MAP, examStatus } from 'features/utils/constants';

import './index.scss';

const DashboardPage = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExams(response?.data?.results || []);
    } catch (error) {
      logError(error);
      setToast({
        show: true,
        message: 'Failed to load exams data. Please try again later.',
      });
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getExamDetails = (exam, statusLabel) => {
    const createdDate = format(new Date(exam.created), 'MMM d, yyyy');
    const urlReschedule = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/reschedule/?registration_id=${exam.vue_appointment_id}`;

    if (statusLabel === examStatus.UNSCHEDULED) {
      return {
        examDetails: [
          { title: 'Voucher: ', description: exam.vue_appointment_id },
          { title: 'Issue date: ', description: createdDate },
        ],
        additionalExamDetails: [],
        dropdownItems: undefined,
      };
    }

    if ([examStatus.SCHEDULED, examStatus.COMPLETE].includes(statusLabel)) {
      const startAt = new Date(exam.start_at);
      const baseData = {
        examDetails: [
          { title: 'Date', description: format(startAt, 'MMM d, yyyy') },
          { title: 'Time', description: format(startAt, 'h:mm a') },
        ],
        additionalExamDetails: [
          { title: 'Voucher: ', description: exam.vue_appointment_id },
          { title: 'Issue date: ', description: createdDate },
        ],
      };

      const dropdownItems = statusLabel === examStatus.SCHEDULED
        ? [
          { label: 'Reschedule Exam', onClick: () => { window.location.href = urlReschedule; } },
        ]
        : [];

      return {
        ...baseData,
        dropdownItems,
      };
    }

    return { examDetails: [], additionalExamDetails: [], dropdownItems: [] };
  };

  const renderExamsTab = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <Spinner screenReaderText="Loading exams..." />
        </div>
      );
    }

    const validExams = Array.isArray(exams)
      ? exams.filter((exam) => Object.keys(EXAM_STATUS_MAP).includes(exam.status))
      : [];

    if (validExams.length === 0) {
      return (
        <NoContentPlaceholder />
      );
    }

    return (
      <Row className="mb-4 p-3 p-md-4 px-md-5">
        {validExams.map((exam) => {
          const statusLabel = EXAM_STATUS_MAP[exam.status];
          const { examDetails, additionalExamDetails, dropdownItems } = getExamDetails(exam, statusLabel);

          return (
            <ExamCard
              title={exam.name}
              key={exam.id}
              status={EXAM_STATUS_MAP[exam.status]}
              examDetails={examDetails}
              additionalExamDetails={additionalExamDetails}
              hideFooter
              dropdownItems={dropdownItems}
            />
          );
        })}
      </Row>
    );
  };

  return (
    <>
      {toast.show && (
        <Toast
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          dismissible
          hasCloseButton
          className="mb-3"
        >
          {toast.message}
        </Toast>
      )}
      <div className="dashboard-container mb-5">
        <Header />
        <div className="tabs-container">
          <Tabs
            defaultActiveKey="exams"
            id="tabs"
            variant="button-group"
            className="tabs-wrapper"
          >
            <Tab eventKey="exams" title="Exams" className="tab-content-wrapper">
              {renderExamsTab()}
            </Tab>
            <Tab eventKey="past-exams" title="Past Exams" className="tab-content-wrapper">
              <NoContentPlaceholder title="No past exams found" description="It looks like you do not have past exams." />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
