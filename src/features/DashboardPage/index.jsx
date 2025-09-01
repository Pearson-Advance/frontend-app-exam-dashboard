import React, { useEffect, useState } from 'react';
import {
  Tabs, Tab, Row, Spinner, Toast,
} from '@edx/paragon';
import { format } from 'date-fns';
import { logError } from '@edx/frontend-platform/logging';

import Header from '@edx/frontend-component-header';

import ExamCard from 'components/ExamCard';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import {
  getExams,
  getRescheduleUrl,
  getScoreReport,
  cancelExam,
} from 'features/data/api';
import { EXAM_STATUS_MAP, examStatus, getExamLocation } from 'features/utils/constants';

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

  const handleExamAction = async ({
    vueAppointmentId,
    serviceFn,
    loadingKey,
    errorMessage,
  }) => {
    setExams((prev) => prev.map(
      (exam) => (exam.vue_appointment_id === vueAppointmentId
        ? { ...exam, [loadingKey]: true }
        : exam),
    ));

    try {
      const response = await serviceFn(vueAppointmentId);

      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        setToast({ show: true, message: 'Unexpected response from the server.' });
      }
    } catch {
      setToast({ show: true, message: errorMessage });
    } finally {
      setExams((prev) => prev.map(
        (exam) => (exam.vue_appointment_id === vueAppointmentId
          ? { ...exam, [loadingKey]: false }
          : exam),
      ));
    }
  };

  const handleRescheduleUrl = async (vueAppointmentId) => {
    await handleExamAction({
      vueAppointmentId,
      serviceFn: getRescheduleUrl,
      loadingKey: 'loadingReschedule',
      errorMessage: 'An error occurred while rescheduling the exam.',
    });
  };

  const handleGetScoreReportUrl = async (vueAppointmentId) => {
    await handleExamAction({
      vueAppointmentId,
      serviceFn: getScoreReport,
      loadingKey: 'loadingScoreReport',
      errorMessage: 'An error occurred while retrieving the exam score report.',
    });
  };

  const handleCancelExam = async (vueAppointmentId) => {
    await handleExamAction({
      vueAppointmentId,
      serviceFn: cancelExam,
      loadingKey: 'loadingCancel',
      errorMessage: 'An error occurred while canceling the exam.',
    });
  };

  useEffect(() => {
    fetchExams();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getExamDetails = (exam, statusLabel) => {
    const createdDate = format(new Date(exam.created), 'MMM d, yyyy');

    if (statusLabel === examStatus.UNSCHEDULED) {
      return {
        examDetails: [
          { title: 'Voucher: ', description: exam.vue_appointment_id },
          { title: 'Issue date: ', description: createdDate },
          getExamLocation(exam),
        ],
        additionalExamDetails: [],
      };
    }

    if (statusLabel === examStatus.SCHEDULED) {
      const startAt = new Date(exam.start_at);
      return {
        examDetails: [
          { title: 'Date', description: format(startAt, 'MMM d, yyyy') },
          { title: 'Time', description: format(startAt, 'h:mm a') },
          getExamLocation(exam),
        ],
        dropdownItems: [
          {
            label: 'Reschedule Exam',
            disabled: exams.find(e => e.vue_appointment_id === exam.vue_appointment_id)?.loadingReschedule === true,
            onClick: () => handleRescheduleUrl(exam.vue_appointment_id),
          },
          {
            label: 'Cancel Exam',
            disabled: exams.find(e => e.vue_appointment_id === exam.vue_appointment_id)?.loadingCancel === true,
            onClick: () => handleCancelExam(exam.vue_appointment_id),
          },
        ],
      };
    }

    if (statusLabel === examStatus.COMPLETE) {
      const startAt = new Date(exam.start_at);
      return {
        examDetails: [
          { title: 'Date', description: format(startAt, 'MMM d, yyyy') },
          { title: 'Time', description: format(startAt, 'h:mm a') },
          getExamLocation(exam),
        ],
        additionalExamDetails: [
          { title: 'Voucher: ', description: exam.vue_appointment_id },
          { title: 'Issue date: ', description: createdDate },
        ],
        dropdownItems: [
          {
            label: 'View Score Report',
            disabled: exams.find(e => (
              e.vue_appointment_id === exam.vue_appointment_id))?.loadingScoreReport === true,
            onClick: () => handleGetScoreReportUrl(exam.vue_appointment_id),
          },
        ],
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
              dropdownItems={dropdownItems}
              hideFooter
            />
          );
        })}
      </Row>
    );
  };

  return (
    <>
      <Toast
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        dismissible
        hasCloseButton
        className="mb-3"
        show={toast.show}
      >
        {toast.message}
      </Toast>
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
