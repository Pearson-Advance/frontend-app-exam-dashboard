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
