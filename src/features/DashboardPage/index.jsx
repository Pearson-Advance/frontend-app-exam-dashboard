import React, { useState, useCallback, useMemo } from 'react';
import {
  Tabs, Tab, Row, Spinner, Toast,
} from '@edx/paragon';

import ExamCard from 'components/ExamCard';
import TermsAndScheduleModal from 'components/TermsAndScheduleModal';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

import { useExams } from 'hooks/useExams';
import { useVouchers } from 'hooks/useVouchers';
import { getExamDetails } from 'features/utils/examDetailsHandlers';
import {
  AVAILABLE_EXAM_CARD_STATUSES,
  EXAMS_AVAILABLE,
  PAST_EXAMS_AVAILABLE,
  voucherStatus,
} from 'features/utils/constants';
import { scheduleExam } from 'features/utils/globals';

import './index.scss';

const EXAM_TAB = 'exams';
const PAST_EXAM_TAB = 'past-exams';

const DashboardPage = () => {
  const [tab, setTab] = useState(EXAM_TAB);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isReschedule, setIsReschedule] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const {
    exams,
    isLoadingExams,
    toast: examsToast,
    setToast: setExamsToast,
    actions,
  } = useExams();

  const {
    vouchers,
    isLoading: isLoadingVouchers,
    toast: vouchersToast,
    setToast: setVouchersToast,
  } = useVouchers();

  const isLoading = isLoadingExams || isLoadingVouchers;

  const toast = useMemo(() => {
    if (examsToast.show) { return examsToast; }
    if (vouchersToast.show) { return vouchersToast; }
    return { show: false, message: '' };
  }, [examsToast, vouchersToast]);

  const handleRescheduleExam = useCallback((exam) => {
    setSelectedExam({ ...exam });
    setIsReschedule(true);
    setIsTermsOpen(true);
  }, []);

  const handleCloseToast = useCallback(() => {
    setExamsToast((prev) => ({ ...prev, show: false }));
    setVouchersToast((prev) => ({ ...prev, show: false }));
  }, [setExamsToast, setVouchersToast]);

  const handleOpenTerms = useCallback((exam) => {
    setSelectedExam({ ...exam });
    setIsTermsOpen(true);
  }, []);

  const handleCloseTerms = useCallback(() => {
    setIsTermsOpen(false);
    setSelectedExam(null);
    setIsReschedule(false);
  }, []);

  const handleAcceptTerms = useCallback((accepted) => {
    setTermsAccepted(accepted);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    if (isReschedule) {
      await scheduleExam({
        formData,
        redirectParams: {},
        shouldRedirectToSchedule: false,
      });

      actions.handleRescheduleUrl?.(selectedExam.vue_appointment_id);
      return;
    }

    await scheduleExam({
      formData,
      redirectParams: {
        exam_series_code: selectedExam?.exam_series_code,
        discount_code: selectedExam?.discount_code,
      },
    });
    handleCloseTerms();
  }, [
    handleCloseTerms,
    isReschedule,
    actions,
    selectedExam?.discount_code,
    selectedExam?.exam_series_code,
    selectedExam?.vue_appointment_id,
  ]);

  const vouchersAsExams = useMemo(
    () => vouchers.map((voucher, index) => ({
      id: `voucher-${index}`,
      name: voucher.exam_name,
      icon_url: voucher?.icon_url,
      status: voucherStatus.UNSCHEDULED,
      discount_code: voucher.voucher_number,
      exam_series_code: voucher.exam_code,
      start_at: null,
    })),
    [vouchers],
  );

  const renderExamsTab = useCallback((placeholderTitle, placeholderDescription, filterStatuses = []) => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" screenReaderText="Loading..." />
        </div>
      );
    }

    let availableExams = Array.isArray(exams) ? exams : [];

    if (filterStatuses.length > 0) {
      availableExams = availableExams.filter((exam) => filterStatuses.includes(exam.status));
    }

    const combinedItems = tab === EXAM_TAB
      ? [...vouchersAsExams, ...availableExams]
      : availableExams;

    if (combinedItems.length === 0) {
      return <NoContentPlaceholder title={placeholderTitle} description={placeholderDescription} />;
    }

    return (
      <Row className="mb-4 p-3 p-md-4 px-md-5">
        {combinedItems.map((exam) => {
          actions.handleRescheduleExam = handleRescheduleExam;

          const statusLabel = AVAILABLE_EXAM_CARD_STATUSES[exam.status];
          const { examDetails, dropdownItems } = getExamDetails(exam, statusLabel, { exams, actions });

          return (
            <ExamCard
              key={exam.id}
              examId={exam.id}
              title={exam?.exam_series_name || exam.name}
              image={exam?.icon_url ?? undefined}
              status={statusLabel}
              examDetails={examDetails}
              dropdownItems={dropdownItems}
              onScheduleClick={() => handleOpenTerms(exam)}
            />
          );
        })}
      </Row>
    );
  }, [isLoading, exams, vouchersAsExams, tab, actions, handleOpenTerms, handleRescheduleExam]);

  const hasExams = exams.length > 0;
  const upcomingExamsCount = hasExams
    ? exams.filter((exam) => EXAMS_AVAILABLE.includes(exam.status)).length + vouchersAsExams.length
    : vouchersAsExams.length || null;

  const pastExamsCount = hasExams
    ? exams.filter((exam) => PAST_EXAMS_AVAILABLE.includes(exam.status)).length
    : null;

  return (
    <>
      <Toast
        onClose={handleCloseToast}
        hasCloseButton
        className="mb-3"
        show={toast.show}
      >
        {toast.message}
      </Toast>

      <div className="dashboard-container pb-5 p-1">
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
              {renderExamsTab('No past exams found', 'It looks like you do not have past exams.', PAST_EXAMS_AVAILABLE)}
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
