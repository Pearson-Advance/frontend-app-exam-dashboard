import { format } from 'date-fns';

import * as constants from 'features/utils/constants';
import { examStatus, voucherStatus, EXAM_STATUS_MAP } from 'features/utils/constants';
import { getExamDetails } from 'features/utils/examDetailsHandlers';

describe('getExamDetails', () => {
  beforeEach(() => {
    jest.spyOn(constants, 'getExamLocation').mockReturnValue({ title: 'Location:', description: 'Online' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const baseExam = {
    start_at: '2025-01-01T10:00:00Z',
    vue_appointment_id: '123',
    grade: 'Pass',
  };

  test('should return formatted date and time for valid date', () => {
    const result = getExamDetails(baseExam, examStatus.SCHEDULED, {});
    const formattedDate = format(new Date(baseExam.start_at), 'MMM d, yyyy');
    const formattedTime = format(new Date(baseExam.start_at), 'h:mm a');

    expect(result.examDetails).toEqual([
      { title: 'Date:', description: formattedDate, isBold: true },
      { title: 'Time:', description: formattedTime, isBold: true },
      { title: 'Location:', description: 'Online' },
      { title: 'Result:', description: 'Pass', isBold: true },
    ]);
  });

  test('should handle invalid date gracefully', () => {
    const result = getExamDetails({ ...baseExam, start_at: 'invalid-date' }, examStatus.SCHEDULED, {});
    expect(result.examDetails[0].description).toBe('N/A');
    expect(result.examDetails[1].description).toBe('N/A');
  });

  test('should show grade for COMPLETE status exams', () => {
    const completeExam = { ...baseExam, status: 'EXAM_DELIVERED' };
    const result = getExamDetails(completeExam, examStatus.COMPLETE, {});

    expect(result.examDetails).toHaveLength(4);
    expect(result.examDetails[3]).toEqual({ title: 'Result:', description: 'Pass', isBold: true });
  });

  test('should show grade for status exams except for SCHEDULE', () => {
    const backendStatuses = Object.keys(EXAM_STATUS_MAP);

    const statusMappings = backendStatuses
      .filter(status => EXAM_STATUS_MAP[status] !== examStatus.SCHEDULED)
      .map(backendStatus => ({
        backendStatus,
        frontendStatus: EXAM_STATUS_MAP[backendStatus],
      }));

    statusMappings.forEach(({ backendStatus, frontendStatus }) => {
      const result = getExamDetails(
        { ...baseExam, status: backendStatus },
        frontendStatus,
        {},
      );

      const gradeDetail = result.examDetails.find(d => d.title === 'Result:');
      expect(gradeDetail).toBeDefined();
      expect(gradeDetail.description).toBe('Pass');
    });
  });

  test('should handle invalid grades gracefully for COMPLETE exams', () => {
    const completeExam = { ...baseExam, status: 'EXAM_DELIVERED' };

    const gradeNullResult = getExamDetails({ ...completeExam, grade: null }, examStatus.COMPLETE, {});
    expect(gradeNullResult.examDetails[3].description).toBe('N/A');

    const gradeUndefinedResult = getExamDetails({ ...completeExam, grade: undefined }, examStatus.COMPLETE, {});
    expect(gradeUndefinedResult.examDetails[3].description).toBe('N/A');

    const gradeEmptyResult = getExamDetails({ ...completeExam, grade: '' }, examStatus.COMPLETE, {});
    expect(gradeEmptyResult.examDetails[3].description).toBe('N/A');
  });

  test('should allow valid falsy values like null for grades in COMPLETE exams', () => {
    const completeExam = { ...baseExam, status: 'EXAM_DELIVERED', grade: null };
    const result = getExamDetails(completeExam, examStatus.COMPLETE, {});
    expect(result.examDetails[3].description).toBe('N/A');
  });

  test('should call handleRescheduleUrl and handleCancelExam when defined', () => {
    const handleRescheduleExam = jest.fn();
    const handleCancelExam = jest.fn();

    const result = getExamDetails(baseExam, examStatus.SCHEDULED, {
      exams: [{ vue_appointment_id: '123' }],
      actions: { handleRescheduleExam, handleCancelExam },
    });

    result.dropdownItems[0].onClick();
    result.dropdownItems[1].onClick();

    expect(handleRescheduleExam).toHaveBeenCalledWith(baseExam);
    expect(handleCancelExam).toHaveBeenCalledWith('123');
  });

  test('should return "View Score Report" only if result_id exists', () => {
    const examWithResult = { ...baseExam, result_id: 'result-1' };
    const handleGetScoreReportUrl = jest.fn();

    const result = getExamDetails(examWithResult, examStatus.COMPLETE, {
      exams: [{ vue_appointment_id: '123' }],
      actions: { handleGetScoreReportUrl },
    });

    expect(result.dropdownItems).toHaveLength(1);
    expect(result.dropdownItems[0].label).toBe('View Score Report');
    result.dropdownItems[0].onClick();
    expect(handleGetScoreReportUrl).toHaveBeenCalledWith('123');
  });

  test('should not include score report when result_id is missing', () => {
    const result = getExamDetails(baseExam, examStatus.COMPLETE, { exams: [] });
    expect(result.dropdownItems).toHaveLength(0);
  });

  test('should handle CANCELED, NO_SHOW, NDA_REFUSED, and EXPIRED statuses returning empty dropdown', () => {
    const statuses = [examStatus.CANCELED, examStatus.NO_SHOW, examStatus.NDA_REFUSED, examStatus.EXPIRED];
    statuses.forEach((status) => {
      const result = getExamDetails(baseExam, status, {});
      expect(result.dropdownItems).toEqual([]);
      expect(result.examDetails[0].title).toBe('Date:');
    });
  });

  test('should return voucher details for UNSCHEDULED voucher', () => {
    const voucher = { discount_code: 'ABC123' };
    const result = getExamDetails(voucher, voucherStatus.UNSCHEDULED);
    expect(result.examDetails).toEqual([{ title: 'Voucher number: ', description: 'ABC123' }]);
    expect(result.dropdownItems).toEqual([]);
  });

  test('should return empty arrays for unknown status', () => {
    const result = getExamDetails(baseExam, 'UNKNOWN');
    expect(result).toEqual({ examDetails: [], dropdownItems: [] });
  });

  test('should disable dropdown items based on loading flags', () => {
    const exams = [
      { vue_appointment_id: '123', loadingReschedule: true, loadingCancel: false },
    ];
    const result = getExamDetails(baseExam, examStatus.SCHEDULED, { exams });
    expect(result.dropdownItems[0].disabled).toBe(true);
    expect(result.dropdownItems[1].disabled).toBe(false);
  });

  test('should format grade text correctly', () => {
    const examComplete = { ...baseExam, status: 'EXAM_DELIVERED' };

    const cases = [
      { input: 'pass', output: 'Pass' },
      { input: 'PASS', output: 'Pass' },
      { input: 'pAsS', output: 'Pass' },
      { input: '  pass  ', output: 'Pass' },
      { input: 'fail', output: 'Fail' },
      { input: 'FAIL', output: 'Fail' },
      { input: 'fAiL', output: 'Fail' },
      { input: ' excellent ', output: 'Excellent' },
      { input: 'A', output: 'A' },
      { input: 'a', output: 'A' },
      { input: '  a  ', output: 'A' },
      { input: 'GOOD', output: 'Good' },
      { input: '  gOoD ', output: 'Good' },
    ];

    cases.forEach(({ input, output }) => {
      const result = getExamDetails({ ...examComplete, grade: input }, examStatus.COMPLETE, {});
      expect(result.examDetails[3].description).toBe(output);
    });

    const invalidCases = [
      null,
      undefined,
      '',
      '   ',
      123,
      {},
      [],
    ];

    invalidCases.forEach((input) => {
      const result = getExamDetails({ ...examComplete, grade: input }, examStatus.COMPLETE, {});
      expect(result.examDetails[3].description).toBe('N/A');
    });
  });
});
