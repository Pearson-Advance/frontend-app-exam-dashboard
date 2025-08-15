import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export function getUserData() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/cdd/`,
  );
}

export function updateUserData(userData) {
  return getAuthenticatedHttpClient().post(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/cdd/`,
    userData,
  );
}

export function getExams() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/exams/`,
  );
}

/**
 * Fetches the reschedule URL for a specific exam appointment.
 * @async
 * @function getRescheduleUrl
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the HTTP response from the backend.
 */
export async function getRescheduleUrl(vueAppointmentId) {
  const baseUrl = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/reschedule/`;

  return getAuthenticatedHttpClient().get(baseUrl, {
    params: { registration_id: vueAppointmentId },
  });
}

/**
 * Fetches the individual score report  URL for a exam appointment.
 * @async
 * @function getScoreReport
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the HTTP response from the backend.
 */
export async function getScoreReport(vueAppointmentId) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/individual_score_report/`,
    {
      params: { registration_id: vueAppointmentId },
    },
  );
}

/**
 * Fetches the cancel URL for a specific exam appointment.
 * @async
 * @function cancelExam
 * @param {string} vueAppointmentId - The unique registration ID of the Vue exam appointment.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the HTTP response from the backend.
 */
export async function cancelExam(vueAppointmentId) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/cancel/`,
    {
      params: { registration_id: vueAppointmentId },
    },
  );
}
