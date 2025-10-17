import { format } from 'date-fns';
import { examStatus, getExamLocation } from 'features/utils/constants';

/**
 * Builds the exam details array with date, time and location.
 *
 * @param {Object} exam - The exam object containing location data.
 * @param {Date} startAt - The exam start date and time.
 * @returns {Array<{ title: string, description: string }>}
 * An array of exam detail objects formatted for display.
 */
function buildExamDetails(exam, startAt) {
  return [
    { title: 'Date', description: format(startAt, 'MMM d, yyyy') },
    { title: 'Time', description: format(startAt, 'h:mm a') },
    getExamLocation(exam),
  ];
}

/**
 * Handlers configuration for different exam statuses.
 *
 * Each key corresponds to a specific exam status and defines how to
 * generate exam details, additional details, and dropdown items.
 *
 * @property {Function} UNSCHEDULED
 *   Generates details for unscheduled exams.
 *   @param {Object} exam - The exam object.
 *   @param {Array<Object>} exams - List of all exams.
 *   @param {Object<string, Function>} actions - Map of available action functions.
 *   @returns {Object} Exam details configuration.
 *
 * @property {Function} SCHEDULED
 *   Generates details and dropdown items for scheduled exams.
 *   @param {Object} exam - The exam object.
 *   @param {Array<Object>} exams - List of all exams.
 *   @param {Object<string, Function>} actions - Map of available action functions.
 *   @returns {Object} Exam details configuration.
 *
 * @property {Function} COMPLETE
 *   Generates details, additional details, and dropdown items for completed exams.
 *   @param {Object} exam - The exam object.
 *   @param {Array<Object>} exams - List of all exams.
 *   @param {Object<string, Function>} actions - Map of available action functions.
 *   @returns {Object} Exam details configuration.
 */
const handlers = {
  [examStatus.UNSCHEDULED]: (exam) => {
    const createdDate = format(new Date(exam.created), 'MMM d, yyyy');

    return {
      examDetails: [
        { title: 'Voucher: ', description: exam.vue_appointment_id },
        { title: 'Issue date: ', description: createdDate },
        getExamLocation(exam),
      ],
      dropdownItems: [],
    };
  },

  [examStatus.SCHEDULED]: (exam, { exams = [], actions = {} }) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [
        {
          label: 'Reschedule Exam',
          disabled: exams.find((e) => e.vue_appointment_id === exam.vue_appointment_id)?.loadingReschedule,
          onClick: () => actions.handleRescheduleUrl?.(exam.vue_appointment_id),
        },
        {
          label: 'Cancel Exam',
          disabled: exams.find((e) => e.vue_appointment_id === exam.vue_appointment_id)?.loadingCancel,
          onClick: () => actions.handleCancelExam?.(exam.vue_appointment_id),
        },
      ],
    };
  },

  [examStatus.COMPLETE]: (exam, { exams = [], actions = {} }) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [
        ...(exam?.result_id
          ? [{
            label: 'View Score Report',
            disabled: exams.find((e) => e.vue_appointment_id === exam.vue_appointment_id)?.loadingScoreReport,
            onClick: () => actions.handleGetScoreReportUrl?.(exam.vue_appointment_id),
          }]
          : []),
      ],
    };
  },

  [examStatus.CANCELED]: (exam) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [],
    };
  },

  [examStatus.NO_SHOW]: (exam) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [],
    };
  },

  [examStatus.NDA_REFUSED]: (exam) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [],
    };
  },

  [examStatus.EXPIRED]: (exam) => {
    const startAt = new Date(exam.start_at);

    return {
      examDetails: [
        ...buildExamDetails(exam, startAt),
      ],
      dropdownItems: [],
    };
  },
};

export const getExamDetails = (exam, statusLabel, services = {}) => {
  const handler = handlers[statusLabel];
  return handler
    ? handler(exam, services)
    : { examDetails: [], dropdownItems: [] };
};
