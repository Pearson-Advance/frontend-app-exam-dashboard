import provinces from 'provinces-ca';
import states from 'states-us';
import countriesData from 'world-countries';

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

  return { title: 'Location', description };
}

export const examStatus = {
  SCHEDULED: 'scheduled',
  UNSCHEDULED: 'unscheduled',
  COMPLETE: 'complete',
};

/**
 * Maps backend exam status to status defined for exam cards.
 * Key: Backend status string from API
 * Value: status label used for exam cards
 */
export const EXAM_STATUS_MAP = {
  APPT_CREATED: examStatus.SCHEDULED,
  EXAM_DELIVERED: examStatus.COMPLETE,
};
