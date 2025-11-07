import { format, isValid } from 'date-fns';
import {
  examStatus, voucherStatus, getExamLocation, EXAM_STATUS_MAP,
} from 'features/utils/constants';

/**
 * Builds the exam details array with date, time and location.
 *
 * @param {Object} exam - The exam object containing location data.
 * @param {Date} startAt - The exam start date and time.
 * @returns {Array<{ title: string, description: string }>}
 * An array of exam detail objects formatted for display.
 */
function buildExamDetails(exam, startAt) {
  const date = new Date(startAt);
  const hasValidDate = isValid(date);
  const hasValidGrade = typeof exam?.grade === 'string' && exam.grade.trim().length > 0;

  const showGrade = EXAM_STATUS_MAP[exam.status] !== examStatus.SCHEDULED;

  const formatGradeLabel = (grade) => grade.trim().charAt(0).toUpperCase() + grade.trim().slice(1).toLowerCase();

  const details = [
    {
      title: 'Date:',
      description: hasValidDate ? format(date, 'MMM d, yyyy') : 'N/A',
      isBold: true,
    },
    {
      title: 'Time:',
      description: hasValidDate ? format(date, 'h:mm a') : 'N/A',
      isBold: true,
    },
    getExamLocation(exam),
  ];

  if (showGrade) {
    const description = hasValidGrade ? formatGradeLabel(exam.grade) : 'N/A';
    details.push({ title: 'Grade:', description, isBold: true });
  }

  return details;
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
const examHandlers = {
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
          onClick: () => actions.handleRescheduleExam?.(exam),
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

const voucherHandler = {
  [voucherStatus.UNSCHEDULED]: (voucher) => ({
    examDetails: [
      { title: 'Voucher number: ', description: voucher.discount_code },
    ],
    dropdownItems: [],
  }),
};

const availableHandlers = { ...examHandlers, ...voucherHandler };

export const getExamDetails = (exam, statusLabel, services = {}) => {
  const handler = availableHandlers[statusLabel];
  return handler
    ? handler(exam, services)
    : { examDetails: [], dropdownItems: [] };
};
