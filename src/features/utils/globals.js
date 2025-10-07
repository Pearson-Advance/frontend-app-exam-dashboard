import { getConfig } from '@edx/frontend-platform';

import {
  SCHEDULE_SSO_ENDPOINT,
  RESCHEDULE_ENDPOINT,
  SCORE_REPORT_ENDPOINT,
  CANCEL_ENDPOINT,
  formatUserPayload,
} from 'features/utils/constants';
import { updateUserData } from 'features/data/api';

/**
 * Redirects the user to the schedule SSO endpoint.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the schedule endpoint URL.
 *
 * @function redirectToScheduleSSO
 * @returns {void} - This function does not return a value, it triggers a page navigation.
 */
export function redirectToScheduleSSO() {
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${SCHEDULE_SSO_ENDPOINT}`;
}

/**
 * Submits a form by formatting the payload, updating user data,
 * fetching a schedule URL, and handling navigation or errors.
 *
 * @async
 * @function scheduleExam
 * @param {Object} params - The parameters for form submission.
 * @param {Object} params.formData - The raw form data to be formatted.
 * @returns {Promise<void>} Resolves when the process completes.
 */
export const scheduleExam = async ({ formData }) => {
  const payload = formatUserPayload(formData);
  await updateUserData(payload);

  redirectToScheduleSSO();
};

/**
 * Redirects the user to the reschedule URL for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the reschedule endpoint URL.
 *
 * @function redirectToReschedule
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {void} - This function does not return a value, it triggers a page navigation.
 */
export function redirectToReschedule(vueAppointmentId) {
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${RESCHEDULE_ENDPOINT}?registration_id=${vueAppointmentId}`;
}

/**
 * Redirects the user to the individual score report for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the score report endpoint URL.
 *
 * @function redirectToScoreReport
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {void} - This function does not return a value, it triggers a page navigation.
 */
export function redirectToScoreReport(vueAppointmentId) {
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${SCORE_REPORT_ENDPOINT}?registration_id=${vueAppointmentId}`;
}

/**
 * Redirects the user to the cancel URL for a specific exam appointment.
 *
 * Instead of performing an HTTP request, this function directly updates
 * `window.location.href` with the cancel endpoint URL.
 *
 * @function redirectToCancelExam
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {void} - This function does not return a value, it triggers a page navigation.
 */
export function redirectToCancelExam(vueAppointmentId) {
  window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}${CANCEL_ENDPOINT}?registration_id=${vueAppointmentId}`;
}
