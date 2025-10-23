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

/**
 * Fetches the list of available vouchers from the authenticated API client.
 *
 * This function sends a GET request to the `/vouchers/available_vouchers/` endpoint
 * of the configured `WEBNG_PLUGIN_API_BASE_URL`. The request is made using an
 * authenticated HTTP client to ensure that only authorized users can access the data.
 */
export function getVouchers() {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/vouchers/vouchers/available_vouchers/`,
  );
}

export function getVoucherDetails(examId) {
  return getAuthenticatedHttpClient().get(
    `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/vouchers/vouchers/`,
    { params: { exam: examId } },
  );
}
