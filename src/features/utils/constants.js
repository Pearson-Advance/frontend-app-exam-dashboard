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
