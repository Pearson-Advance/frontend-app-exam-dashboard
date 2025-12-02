import provinces from 'provinces-ca';
import states from 'states-us';
import countriesData from 'world-countries';

export const SCHEDULE_SSO_ENDPOINT = '/appointment/schedule/';
export const RESCHEDULE_ENDPOINT = '/appointment/reschedule/';
export const SCORE_REPORT_ENDPOINT = '/appointment/individual_score_report/';
export const CANCEL_ENDPOINT = '/appointment/cancel/';

export const canadianProvincesAndTerritories = provinces.map(
  ({ name, abbreviation }) => ({
    label: name,
    value: abbreviation,
  }),
);

export const unitedStates = states.map(({ name, abbreviation }) => ({
  label: name,
  value: abbreviation,
}));

export const countries = countriesData
  .map(({
    name: { official }, flag, idd: { root, suffixes }, cca3, cca2,
  }) => ({
    name: official,
    flag,
    dialingCode: suffixes && suffixes.length === 1 ? root + suffixes[0] : root,
    cca3,
    cca2,
  }))
  .filter(({ dialingCode }) => dialingCode);

/**
 * Returns the exam location formatted as a string.
 *
 * The function extracts the fields from the test_center object,
 * removes falsy values (e.g., null, undefined, empty strings), and
 * concatenates the remaining fields into a readable address string.
 *
 * @param {Object} exam - The exam object containing test center information.
 * @param {Object} [exam.test_center] - The test center data.
 * @param {string} [exam.test_center.name] - The name of the test center.
 * @param {Object} [exam.test_center.address1] - The address of the test center.
 * @param {string} [exam.test_center.city] - City of the test center.
 * @param {string} [exam.test_center.state] - State or region of the test center.
 * @param {string} [exam.test_center.postal_code] - Postal code of the test center.
 * @param {string} [exam.test_center.country] - Country of the test center.
 *
 * @returns {{ key: string, value: string }} An object with key `"Location"` and
 * a formatted string as the value. If no valid location is found, the value is an empty string.
 */
export function getExamLocation(exam) {
  const {
    name = null,
    address1 = null,
    city = null,
    state = null,
    postal_code: postalCode = null,
    country = null,
  } = exam?.test_center ?? {};

  if (!name) {
    return { title: '', description: '' };
  }

  const parts = [name, address1, city, state, postalCode, country].filter(Boolean);
  const description = parts.join(', ');

  return { title: 'Location:', description };
}

export const examStatus = {
  SCHEDULED: 'scheduled',
  CANCELED: 'canceled',
  COMPLETE: 'complete',
  NO_SHOW: 'no-show',
  NDA_REFUSED: 'nda-refused',
  EXPIRED: 'expired',
};

export const voucherStatus = {
  UNSCHEDULED: 'UNSCHEDULED',
};

export const VOUCHER_STATUS_UI_STYLES = {
  [voucherStatus.UNSCHEDULED]: {
    text: 'Unscheduled',
    class: 'unschedule-voucher-background',
    badge: 'badge-unscheduled',
  },
};

export const EXAM_STATUS_UI_STYLES = {
  [examStatus.COMPLETE]: {
    text: 'Complete',
    class: 'completed-background',
    badge: 'badge-complete',
  },
  [examStatus.SCHEDULED]: {
    text: 'Scheduled',
    class: 'scheduled-background',
    badge: 'badge-scheduled',
  },
  [examStatus.CANCELED]: {
    text: 'Canceled',
    class: 'canceled-background',
    badge: 'badge-canceled',
  },
  [examStatus.NO_SHOW]: {
    text: 'No Show',
    class: 'no-show-background',
    badge: 'badge-no-show',
  },
  [examStatus.NDA_REFUSED]: {
    text: 'NDA declined',
    class: 'nda-refused-background',
    badge: 'badge-nda-refused',
  },
  [examStatus.EXPIRED]: {
    text: 'Incomplete exam',
    class: 'expired-background',
    badge: 'badge-expired',
  },
};

/**
 * Maps backend exam status to status defined for exam cards.
 * Key: Backend status string from API
 * Value: status label used for exam cards
 */
export const EXAM_STATUS_MAP = {
  APPT_CREATED: examStatus.SCHEDULED,
  APPT_CANCELED: examStatus.CANCELED,
  EXAM_DELIVERED: examStatus.COMPLETE,
  NO_SHOW: examStatus.NO_SHOW,
  NDA_REFUSED: examStatus.NDA_REFUSED,
  EXPIRED: examStatus.EXPIRED,
};

export const VOUCHER_STATUS_MAP = {
  UNSCHEDULED: voucherStatus.UNSCHEDULED,
};

export const AVAILABLE_EXAM_CARD_STATUSES = {
  ...EXAM_STATUS_MAP,
  ...VOUCHER_STATUS_MAP,
};

export const EXAMS_AVAILABLE = ['APPT_CREATED'];
export const PAST_EXAMS_AVAILABLE = ['APPT_CANCELED', 'EXAM_DELIVERED', 'NO_SHOW', 'NDA_REFUSED', 'EXPIRED'];

export const formatUserPayload = (formData) => {
  const phoneCountryCode = countries.find(
    (c) => c.cca2 === formData.dialingCode.value,
  )?.dialingCode?.replace('+', '') || '1';

  return {
    first_name: formData.firstName.value,
    last_name: formData.lastName.value,
    postal_code: formData.postalCode.value,
    phone_country_code: phoneCountryCode,
    state: formData.state.value,
    country: formData.country.value,
    city: formData.city.value,
    mailing_address: formData.address.value,
    phone_number: formData.phone.value,
  };
};

/**
 * Enum-like object containing all error codes returned by the SSO service.
 * These values must match the "s" query parameter.
 * @type {Record<string, string>}
 */
export const ERROR_CODES = {
  CANDIDATE_NOT_FOUND: 'ERROR_CANDIDATE_NOT_FOUND',
  CLIENT_NOT_SUPPORTED: 'ERROR_CLIENT_NOT_SUPPORTED',
  INVALID_PAYLOAD: 'ERROR_INVALID_PAYLOAD',
  MISSING_REQUIRED_PARAMETERS: 'ERROR_MISSING_REQUIRED_PARAMETERS',
  REGISTRATION_NOT_FOUND: 'ERROR_REGISTRATION_NOT_FOUND',
  SESSION_TIMEOUT: 'ERROR_SESSION_TIMEOUT',
  TEMPORARY: 'ERROR_TEMPORARY',
  VUE_WIDE_BLOCK: 'ERROR_VUE_WIDE_BLOCK',
  GENERIC: 'ERROR',
};

/**
 * Maps SSO error codes to their corresponding user-facing messages.
 * Used by the ExamErrorSSO page to render descriptive error text.
 * @type {Record<string, string>}
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.CANDIDATE_NOT_FOUND]: 'Candidate ID was not sent.',
  [ERROR_CODES.CLIENT_NOT_SUPPORTED]: 'Client is not configured in Pearson VUE website.',
  [ERROR_CODES.INVALID_PAYLOAD]: 'Payload authentication hash did not match.',
  [ERROR_CODES.MISSING_REQUIRED_PARAMETERS]: 'Required payload parameter was not sent.',
  [ERROR_CODES.REGISTRATION_NOT_FOUND]: 'Exam Registration ID sent in the request payload was not found.',
  [ERROR_CODES.SESSION_TIMEOUT]: 'Payload request has timed out.',
  [ERROR_CODES.TEMPORARY]: 'Planned temporary system issue is preventing login.',
  [ERROR_CODES.VUE_WIDE_BLOCK]: 'Your access to the Pearson VUE website has been restricted.',
  [ERROR_CODES.GENERIC]: 'Unexpected system error has occurred for the Pearson VUE website.',
};

/**
 * Workflow types passed through the "w" query parameter.
 * Used to determine the redirect behavior after showing an SSO error.
 * @type {{ PASSTHROUGH: string, DASHBOARD: string }}
 */
export const WORKFLOWS = {
  PASSTHROUGH: 'passthrough',
  DASHBOARD: 'dashboard',
};

/**
 * Base URL for IT Specialist information page.
 * @type {string}
 */
export const IT_SPECIALIST_URL = 'https://www.pearsonvue.com/us/en/itspecialist.html';

/**
 * Defines the redirect URLs used by the SSO error page.
 * @type {Record<string, string>}
 */
export const REDIRECT_URLS = {
  IT_SPECIALIST: IT_SPECIALIST_URL,
  DASHBOARD: '/dashboard',
  HOME: '/',
};

/**
 * Button labels displayed on the SSO error page.
 * @type {Record<string, string>}
 */
export const BUTTON_LABELS = {
  PASSTHROUGH: 'Return to IT Specialist',
  DASHBOARD: 'Return to Dashboard',
};

/**
 * Maps workflow types to their corresponding button labels.
 * @type {Record<string, string>}
 */
export const BUTTON_LABELS_MAP = {
  [WORKFLOWS.PASSTHROUGH]: BUTTON_LABELS.PASSTHROUGH,
  [WORKFLOWS.DASHBOARD]: BUTTON_LABELS.DASHBOARD,
};
