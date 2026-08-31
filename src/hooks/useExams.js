import { useEffect, useState } from 'react';
import { logError } from '@edx/frontend-platform/logging';

import { getExams } from 'features/data/api';
import {
  redirectToReschedule,
  redirectToScoreReport,
  redirectToCancelExam,
} from 'features/utils/globals';

/**
 * Fetches exams and exposes action handlers for exam redirects.
 *
 * @function useExams
 * @returns {Object} Exam state, toast state, and redirect action handlers.
 * @returns {Array<Object>} returns.exams - Exams returned by the backend.
 * @returns {boolean} returns.isLoadingExams - Whether exams are currently loading.
 * @returns {{ show: boolean, message: string }} returns.toast - Current exam-related toast state.
 * @returns {Function} returns.setToast - Setter for exam-related toast state.
 * @returns {Object<string, Function>} returns.actions - Action handlers for exam card dropdown items.
 */
export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
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
      setIsLoadingExams(false);
    }
  };

  /**
   * Runs an exam redirect action while toggling the matching loading flag.
   *
   * @param {Object} params - Exam action parameters.
   * @param {string|Object} params.examOrAppointmentId - Vue appointment ID or full exam object.
   * @param {Function} params.serviceFn - Redirect function to execute.
   * @param {string} params.loadingKey - Exam loading flag to toggle while the action runs.
   * @param {string} params.errorMessage - Toast message shown when the redirect action fails.
   * @returns {Promise<void>} Resolves after the action finishes and loading state is reset.
   */
  const handleExamAction = async ({
    examOrAppointmentId, serviceFn, loadingKey, errorMessage,
  }) => {
    const vueAppointmentId = typeof examOrAppointmentId === 'object' && examOrAppointmentId !== null
      ? examOrAppointmentId.vue_appointment_id
      : examOrAppointmentId;

    setExams((prev) => prev.map(
      (exam) => (exam.vue_appointment_id === vueAppointmentId ? { ...exam, [loadingKey]: true } : exam),
    ));

    try {
      await serviceFn(examOrAppointmentId);
    } catch {
      setToast({ show: true, message: errorMessage });
    } finally {
      setExams((prev) => prev.map(
        (exam) => (exam.vue_appointment_id === vueAppointmentId ? { ...exam, [loadingKey]: false } : exam),
      ));
    }
  };

  const handleRescheduleUrl = async (examOrAppointmentId) => handleExamAction({
    examOrAppointmentId,
    serviceFn: redirectToReschedule,
    loadingKey: 'loadingReschedule',
    errorMessage: 'An error occurred while rescheduling the exam.',
  });

  const handleGetScoreReportUrl = async (examOrAppointmentId) => handleExamAction({
    examOrAppointmentId,
    serviceFn: redirectToScoreReport,
    loadingKey: 'loadingScoreReport',
    errorMessage: 'An error occurred while retrieving the exam score report.',
  });

  const handleCancelExam = async (examOrAppointmentId) => handleExamAction({
    examOrAppointmentId,
    serviceFn: redirectToCancelExam,
    loadingKey: 'loadingCancel',
    errorMessage: 'An error occurred while canceling the exam.',
  });

  useEffect(() => {
    fetchExams();
  }, []);

  return {
    exams,
    isLoadingExams,
    toast,
    setToast,
    actions: {
      handleRescheduleUrl,
      handleGetScoreReportUrl,
      handleCancelExam,
    },
  };
};
