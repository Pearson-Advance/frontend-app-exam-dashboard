import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import {
  SCHEDULE_SSO_ENDPOINT,
  RESCHEDULE_ENDPOINT,
  SCORE_REPORT_ENDPOINT,
  CANCEL_ENDPOINT,
  formatUserPayload,
  WORKFLOWS,
} from 'features/utils/constants';
import { updateUserData, getVoucherDetails } from 'features/data/api';

/**
 * Determines the workflow type based on the current URL pathname.
 *
 * @function getWorkflowType
 * @returns {string} - Returns either WORKFLOWS.PASSTHROUGH or WORKFLOWS.DASHBOARD
 */
export function getWorkflowType() {
  const pathname = window?.location?.pathname || '';
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';

  return lastSegment === 'exam' ? WORKFLOWS.PASSTHROUGH : WORKFLOWS.DASHBOARD;
}

/**
 * Builds a query string from parameters, filtering out falsy values and adding workflow type.
 *
 * @function buildQueryString
 * @param {Object} params - Query parameters to include before adding the workflow type.
 * @returns {string} URL-encoded query string with a leading '?', or an empty string when no values exist.
 */
function buildQueryString(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries({ ...params, w: getWorkflowType() }).filter(([, value]) => value),
  );

  const queryString = new URLSearchParams(filteredParams).toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Extracts the registration and candidate identifiers used by SSO redirects.
 *
 * @function getExamIdentifiers
 * @param {string|Object} examOrAppointmentId - Vue appointment ID or full exam object.
 * @param {string} [examOrAppointmentId.vue_appointment_id] - Vue appointment registration ID.
 * @param {string|number} [examOrAppointmentId.candidate_id] - Candidate ID returned by newer API responses.
 * @param {string|number} [examOrAppointmentId.candidate] - Candidate ID returned by existing API responses.
 * @returns {{ registrationId: string, candidateId: string|number|undefined }} Identifiers for redirect query params.
 */
function getExamIdentifiers(examOrAppointmentId) {
  if (typeof examOrAppointmentId === 'object' && examOrAppointmentId !== null) {
    return {
      registrationId: examOrAppointmentId.vue_appointment_id,
      candidateId: examOrAppointmentId.candidate_id ?? examOrAppointmentId.candidate,
    };
  }

  return {
    registrationId: examOrAppointmentId,
    candidateId: undefined,
  };
}

/**
 * Redirects the user to the schedule SSO endpoint.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the schedule endpoint URL.
 *
 * @function redirectToScheduleSSO
 * @param {Object} [redirectParams={}] - Optional query params for the schedule SSO request.
 * @param {string} [redirectParams.exam_series_code] - Exam series code for voucher-based scheduling.
 * @param {string} [redirectParams.discount_code] - Discount or voucher code for scheduling.
 * @returns {void} This function does not return a value; it triggers a page navigation.
 */
export function redirectToScheduleSSO(redirectParams = {}) {
  const { exam_series_code: examSeriesCode, discount_code: discountCode } = redirectParams;

  const query = buildQueryString({
    exam_series_code: examSeriesCode,
    discount_code: discountCode,
  });

  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${SCHEDULE_SSO_ENDPOINT}${query}`;
}

/**
 * Submits a form by formatting the payload, updating user data,
 * fetching a schedule URL, and handling navigation or errors.
 *
 * @async
 * @function scheduleExam
 * @param {Object} params - The parameters for form submission.
 * @param {Object} params.formData - The raw form data to be formatted.
 * @param {Object} params.redirectParams - Additional information to include in the redirect request.
 * @param {boolean} params.shouldRedirectToSchedule - Determines if we should use the redirect to schedule endpoint.
 * @param {string|number|null} params.candidateId - Candidate ID to include when updating data for an existing exam.
 * @returns {Promise<void>} Resolves when the process completes.
 */
export const scheduleExam = async ({
  formData,
  redirectParams = {},
  shouldRedirectToSchedule = true,
  candidateId = null,
}) => {
  const payload = formatUserPayload(formData, candidateId);
  await updateUserData(payload);

  if (shouldRedirectToSchedule) {
    redirectToScheduleSSO(redirectParams);
  }
};

/**
 * Redirects the user to the reschedule URL for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the reschedule endpoint URL.
 *
 * @function redirectToReschedule
 * @param {string|Object} examOrAppointmentId - Vue appointment ID or full exam object containing candidate data.
 * @returns {void} This function does not return a value; it triggers a page navigation.
 */
export function redirectToReschedule(examOrAppointmentId) {
  const { registrationId, candidateId } = getExamIdentifiers(examOrAppointmentId);
  const query = buildQueryString({ registration_id: registrationId, candidate_id: candidateId });
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${RESCHEDULE_ENDPOINT}${query}`;
}

/**
 * Redirects the user to the individual score report for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the score report endpoint URL.
 *
 * @function redirectToScoreReport
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {void} This function does not return a value; it triggers a page navigation.
 */
export function redirectToScoreReport(vueAppointmentId) {
  const query = buildQueryString({ registration_id: vueAppointmentId });
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${SCORE_REPORT_ENDPOINT}${query}`;
}

/**
 * Redirects the user to the cancel URL for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the cancel endpoint URL.
 *
 * @function redirectToCancelExam
 * @param {string|Object} examOrAppointmentId - Vue appointment ID or full exam object containing candidate data.
 * @returns {void} This function does not return a value; it triggers a page navigation.
 */
export function redirectToCancelExam(examOrAppointmentId) {
  const { registrationId, candidateId } = getExamIdentifiers(examOrAppointmentId);
  const query = buildQueryString({ registration_id: registrationId, candidate_id: candidateId });
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${CANCEL_ENDPOINT}${query}`;
}

/**
 * Fetches voucher details for a given exam.
 *
 * This function calls the backend API to retrieve voucher details
 * for the specified exam ID. If successful, it returns an array
 * formatted for display in the UI. If the request fails, it logs
 * the error using the `logError` utility.
 *
 * @async
 * @function handleGetVoucherDetails
 * @param {number|string} examId - The ID of the exam to fetch voucher details for.
 * @returns {Promise<Array<{ title: string, description: string }>>}
 * Returns an array of voucher details objects, or an empty array if an error occurs.
 */
export const handleGetVoucherDetails = async (examId) => {
  try {
    if (!examId) { logError('Exam ID is required'); }

    const response = await getVoucherDetails(examId);

    if (!response?.data) { logError('No data received from API'); }

    const { results } = response.data;

    if (!Array.isArray(results) || results.length === 0) {
      return [
        {
          title: 'Discount Code:',
          description: 'No voucher found for this exam',
        },
      ];
    }

    const voucher = results.find((item) => item.exam === examId);

    return [
      {
        title: 'Discount Code:',
        description: voucher?.discount_code?.trim() || 'N/A',
      },
    ];
  } catch (error) {
    logError('Error fetching voucher details:', error);

    return [
      {
        title: 'Discount Code:',
        description: 'Error retrieving voucher information',
      },
    ];
  }
};
