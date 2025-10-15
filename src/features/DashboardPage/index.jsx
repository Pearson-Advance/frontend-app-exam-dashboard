import React, { useState, useReducer, useCallback } from 'react';
import {
  Tabs, Tab, Row, Spinner, Toast,
} from '@edx/paragon';

import ExamCard from 'components/ExamCard';
import VoucherDetailsModal from 'components/VoucherDetailsModal';
import TermsAndScheduleModal from 'components/TermsAndScheduleModal';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import { useExams } from 'hooks/useExams';
import { getExamDetails } from 'features/utils/examDetailsHandlers';
import { EXAM_STATUS_MAP, EXAMS_AVAILABLE } from 'features/utils/constants';
import { scheduleExam, handleGetVoucherDetails } from 'features/utils/globals';

import './index.scss';

const EXAM_TAB = 'exams';
const PAST_EXAM_TAB = 'past-exams';

const modalInitialState = {
  isOpen: false,
  type: null,
  examId: null,
  examTitle: '',
  termsAccepted: false,
  voucherDetails: [],
  isLoadingVoucher: false,
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_TERMS_MODAL':
      return {
        ...state,
        isOpen: true,
        type: 'terms',
        examId: action.payload.examId,
        examTitle: action.payload.examTitle,
      };
    case 'OPEN_VOUCHER_MODAL':
      return {
        ...state,
        isOpen: true,
        type: 'voucher',
        examId: action.payload.examId,
        examTitle: action.payload.examTitle,
      };
    case 'CLOSE_MODAL':
      return { ...modalInitialState };
    case 'SET_TERMS_ACCEPTED':
      return { ...state, termsAccepted: action.payload };
    case 'SET_VOUCHER_LOADING':
      return { ...state, isLoadingVoucher: action.payload };
    case 'SET_VOUCHER_DETAILS':
      return { ...state, voucherDetails: action.payload, isLoadingVoucher: false };
    default:
      return state;
  }
};

const DashboardPage = () => {
  const [tab, setTab] = useState(EXAM_TAB);
  const [modalState, dispatchModal] = useReducer(modalReducer, modalInitialState);
  const [voucherCache, setVoucherCache] = useState({});

  const {
    exams,
    isLoadingExams,
    toast,
    setToast,
    actions,
  } = useExams();

  const handleOpenScheduleModal = useCallback((examId, examTitle) => {
    dispatchModal({ type: 'OPEN_TERMS_MODAL', payload: { examId, examTitle } });
  }, []);

  const handleOpenVoucherModal = useCallback(async (examId, examTitle) => {
    dispatchModal({ type: 'OPEN_VOUCHER_MODAL', payload: { examId, examTitle } });

    if (voucherCache[examId]) {
      dispatchModal({ type: 'SET_VOUCHER_DETAILS', payload: voucherCache[examId] });
      return;
    }

    dispatchModal({ type: 'SET_VOUCHER_LOADING', payload: true });

    try {
      const details = await handleGetVoucherDetails(examId);
      setVoucherCache((prev) => ({ ...prev, [examId]: details }));
      dispatchModal({ type: 'SET_VOUCHER_DETAILS', payload: details });
    } catch {
      dispatchModal({
        type: 'SET_VOUCHER_DETAILS',
        payload: [{ title: 'Error', description: 'Failed to load voucher details' }],
      });
    }
  }, [voucherCache]);

  const handleCloseModal = useCallback(() => {
    dispatchModal({ type: 'CLOSE_MODAL' });
  }, []);

  const handleAcceptTerms = useCallback((accepted) => {
    dispatchModal({ type: 'SET_TERMS_ACCEPTED', payload: accepted });
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    await scheduleExam({ formData });
    handleCloseModal();
  }, [handleCloseModal]);

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
              title={exam.name}
              status={statusLabel}
              examDetails={examDetails}
              dropdownItems={dropdownItems}
              onScheduleClick={() => handleOpenScheduleModal(exam.id, exam.name)}
              onVoucherDetailsClick={() => handleOpenVoucherModal(exam.id, exam.name)}
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
          <Tabs id="tabs" variant="button-group" className="tabs-wrapper" activeKey={tab} onSelect={setTab}>
            <Tab eventKey={EXAM_TAB} title="Exams" className="tab-content-wrapper" {...(tab === EXAM_TAB ? { notification: upcomingExamsCount } : {})}>
              {renderExamsTab('No exams found', 'It looks like you do not have any upcoming exams.', EXAMS_AVAILABLE)}
            </Tab>
            <Tab eventKey={PAST_EXAM_TAB} title="Past Exams" className="tab-content-wrapper" {...(tab === PAST_EXAM_TAB ? { notification: pastExamsCount } : {})}>
              {renderExamsTab('No past exams found', 'It looks like you do not have past exams.', [])}
            </Tab>
          </Tabs>
        </div>
      </div>

      {modalState.type === 'voucher' && (
        <VoucherDetailsModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          examTitle={modalState.examTitle}
          voucherDetails={modalState.voucherDetails}
          isLoading={modalState.isLoadingVoucher}
        />
      )}

      {modalState.type === 'terms' && (
        <TermsAndScheduleModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          termsAccepted={modalState.termsAccepted}
          onAcceptTerms={handleAcceptTerms}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  );
};

export default DashboardPage;
