import { getConfig } from '@edx/frontend-platform';
import { SCHEDULE_SSO_ENDPOINT } from 'features/utils/constants';

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
