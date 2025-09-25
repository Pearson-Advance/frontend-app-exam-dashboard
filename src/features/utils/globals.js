import { getConfig } from '@edx/frontend-platform';

import { updateUserData } from 'features/data/api';
import { SCHEDULE_SSO_ENDPOINT, formatUserPayload } from 'features/utils/constants';

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
