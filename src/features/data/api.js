import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export function updateUserData(userData) {
  return getAuthenticatedHttpClient().post(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/cdd/`,
    userData,
  );
}

/**
 * Fetches exams from the API, optionally filtered by status.
 *
 * @param {string} [status=''] - Optional exam status to filter by.
 *                                If empty, no status filter is applied.
 * @returns {Promise} - A promise resolving to the HTTP response containing exams data.
 */
export function getExams(status = '') {
  const params = {};

  if (status) { params.status = status; }

  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/exams/`,
    { params },
  );
}

export function getVoucherDetails(examId) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/vouchers/`,
    { params: { exam: examId } },
  );
}
