import { useEffect, useState } from 'react';
import { logError } from '@edx/frontend-platform/logging';

import {
  getExams,
  getRescheduleUrl,
  getScoreReport,
  cancelExam,
} from 'features/data/api';

/**
 * Returns exam details, additional details, and available dropdown actions
 * for a given exam based on its status.
 *
 * @function useExams
 * @param {Object} exam - The exam object containing exam data.
 * @param {string} statusLabel - The status of the exam (e.g., "SCHEDULED", "COMPLETE").
 * @param {Array<Object>} exams - List of all exams for state lookups (loading flags, etc.).
 * @param {Object<string, Function>} actions - A map of functions keyed by action name
 * (e.g., { handleRescheduleUrl, handleCancelExam, handleGetScoreReportUrl }).
 * If a required action is missing, the dropdown item will be disabled by default.
 * @returns {Object} An object containing:
 *   @property {Array<Object>} examDetails - Primary details of the exam
 *     (e.g., date, time, voucher).
 *   @property {Array<Object>} additionalExamDetails - Supplementary details of the exam.
 *   @property {Array<Object>} dropdownItems - List of dropdown actions available
 *     for the current exam and status.
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

  const handleExamAction = async ({
    vueAppointmentId, serviceFn, loadingKey, errorMessage,
  }) => {
    setExams((prev) => prev.map(
      (exam) => (exam.vue_appointment_id === vueAppointmentId ? { ...exam, [loadingKey]: true } : exam),
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
        (exam) => (exam.vue_appointment_id === vueAppointmentId ? { ...exam, [loadingKey]: false } : exam),
      ));
    }
  };

  const handleRescheduleUrl = async (vueAppointmentId) => handleExamAction({
    vueAppointmentId,
    serviceFn: getRescheduleUrl,
    loadingKey: 'loadingReschedule',
    errorMessage: 'An error occurred while rescheduling the exam.',
  });

  const handleGetScoreReportUrl = async (vueAppointmentId) => handleExamAction({
    vueAppointmentId,
    serviceFn: getScoreReport,
    loadingKey: 'loadingScoreReport',
    errorMessage: 'An error occurred while retrieving the exam score report.',
  });

  const handleCancelExam = async (vueAppointmentId) => handleExamAction({
    vueAppointmentId,
    serviceFn: cancelExam,
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
