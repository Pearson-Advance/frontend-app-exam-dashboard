import React, { useState, useCallback } from 'react';
import {
  Tabs, Tab, Row, Spinner, Toast,
} from '@edx/paragon';

import ExamCard from 'components/ExamCard';
import TermsAndScheduleModal from 'components/TermsAndScheduleModal';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import { useExams } from 'hooks/useExams';
import { getExamDetails } from 'features/utils/examDetailsHandlers';
import { EXAM_STATUS_MAP, EXAMS_AVAILABLE } from 'features/utils/constants';
import { scheduleExam } from 'features/utils/globals';

import './index.scss';

const EXAM_TAB = 'exams';
const PAST_EXAM_TAB = 'past-exams';

const DashboardPage = () => {
  const [tab, setTab] = useState(EXAM_TAB);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const {
    exams,
    isLoadingExams,
    toast,
    setToast,
    actions,
  } = useExams();

  const handleOpenTerms = useCallback((examId, examTitle) => {
    setSelectedExam({ examId, examTitle });
    setIsTermsOpen(true);
  }, []);

  const handleCloseTerms = useCallback(() => {
    setIsTermsOpen(false);
    setSelectedExam(null);
  }, []);

  const handleAcceptTerms = useCallback((accepted) => {
    setTermsAccepted(accepted);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    await scheduleExam({ formData });
    handleCloseTerms();
  }, [handleCloseTerms]);

  const renderExamsTab = (placeholderTitle, placeholderDescription, filterStatuses = []) => {
    if (isLoadingExams) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <Spinner screenReaderText="Loading exams..." />
        </div>
      );
    }

    let availableExams = Array.isArray(exams) ? exams : [];

    if (filterStatuses.length > 0) {
      availableExams = availableExams.filter((exam) => filterStatuses.includes(exam.status));
    }

    if (availableExams.length === 0) {
      return <NoContentPlaceholder title={placeholderTitle} description={placeholderDescription} />;
    }

    return (
      <Row className="mb-4 p-3 p-md-4 px-md-5">
        {availableExams.map((exam) => {
          const statusLabel = EXAM_STATUS_MAP[exam.status];
          const { examDetails, dropdownItems } = getExamDetails(exam, statusLabel, { exams, actions });

          return (
            <ExamCard
              key={exam.id}
              examId={exam.id}
              title={exam.name}
              status={statusLabel}
              examDetails={examDetails}
              dropdownItems={dropdownItems}
              onScheduleClick={() => handleOpenTerms(exam.id, exam.name)}
            />
          );
        })}
      </Row>
    );
  };

  const hasExams = exams.length > 0;
  const upcomingExamsCount = hasExams ? exams.filter((exam) => EXAMS_AVAILABLE.includes(exam.status)).length : null;
  const pastExamsCount = hasExams ? exams.length : null;

  return (
    <>
      <Toast
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        dismissible
        hasCloseButton
        className="mb-3"
        show={toast.show}
      >
        {toast.message}
      </Toast>

      <div className="dashboard-container mb-5">
        <div className="tabs-container">
          <Tabs
            id="tabs"
            variant="button-group"
            className="tabs-wrapper"
            activeKey={tab}
            onSelect={setTab}
          >
            <Tab
              eventKey={EXAM_TAB}
              title="Exams"
              className="tab-content-wrapper"
              {...(tab === EXAM_TAB ? { notification: upcomingExamsCount } : {})}
            >
              {renderExamsTab('No exams found', 'It looks like you do not have any upcoming exams.', EXAMS_AVAILABLE)}
            </Tab>

            <Tab
              eventKey={PAST_EXAM_TAB}
              title="Past Exams"
              className="tab-content-wrapper"
              {...(tab === PAST_EXAM_TAB ? { notification: pastExamsCount } : {})}
            >
              {renderExamsTab('No past exams found', 'It looks like you do not have past exams.', [])}
            </Tab>
          </Tabs>
        </div>
      </div>

      {selectedExam && (
        <TermsAndScheduleModal
          isOpen={isTermsOpen}
          onClose={handleCloseTerms}
          termsAccepted={termsAccepted}
          onAcceptTerms={handleAcceptTerms}
          onSubmit={handleFormSubmit}
          examTitle={selectedExam.examTitle}
        />
      )}
    </>
  );
};

export default DashboardPage;
