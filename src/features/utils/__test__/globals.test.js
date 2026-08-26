import { logError } from '@edx/frontend-platform/logging';

import {
  handleGetVoucherDetails,
  getWorkflowType,
  redirectToCancelExam,
  redirectToReschedule,
  scheduleExam,
} from 'features/utils/globals';
import { WORKFLOWS } from 'features/utils/constants';
import * as api from 'features/data/api';

jest.mock('features/data/api', () => ({
  getVoucherDetails: jest.fn(),
  updateUserData: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    WEBNG_PLUGIN_API_BASE_URL: 'https://example.com/api',
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('handleGetVoucherDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful API Calls', () => {
    test('returns formatted voucher when matching exam is found', async () => {
      const mockResponse = {
        data: {
          results: [
            { exam: 123, discount_code: 'SUMMER2025' },
            { exam: 456, discount_code: 'WINTER2025' },
          ],
        },
      };

      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(123);

      expect(api.getVoucherDetails).toHaveBeenCalledWith(123);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'SUMMER2025' },
      ]);
    });

    test('returns "No voucher found" when no results exist', async () => {
      const mockResponse = { data: { results: [] } };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(123);

      expect(result).toEqual([
        { title: 'Discount Code:', description: 'No voucher found for this exam' },
      ]);
    });

    test('returns "N/A" when discount_code is null', async () => {
      const mockResponse = {
        data: { results: [{ exam: 999, discount_code: null }] },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(999);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'N/A' },
      ]);
    });

    test('returns "N/A" when discount_code is undefined', async () => {
      const mockResponse = {
        data: { results: [{ exam: 101, discount_code: undefined }] },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(101);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'N/A' },
      ]);
    });

    test('handles no matching exam in results', async () => {
      const mockResponse = {
        data: {
          results: [{ exam: 1, discount_code: 'CODE1' }],
        },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(999);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'N/A' },
      ]);
    });
  });

  describe('Data Structure Handling', () => {
    test('logs warning when data is missing', async () => {
      const mockResponse = { data: null };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(123);

      expect(logError).toHaveBeenCalledWith('No data received from API');
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'Error retrieving voucher information' },
      ]);
    });

    test('logs warning when examId is missing', async () => {
      const mockResponse = { data: { results: [] } };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      await handleGetVoucherDetails(undefined);

      expect(logError).toHaveBeenCalledWith('Exam ID is required');
    });
  });

  describe('Error Handling', () => {
    test('returns descriptive message when API fails', async () => {
      const mockError = new Error('Network error');
      api.getVoucherDetails.mockRejectedValue(mockError);

      const result = await handleGetVoucherDetails(123);

      expect(logError).toHaveBeenCalledWith('Error fetching voucher details:', mockError);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'Error retrieving voucher information' },
      ]);
    });

    test('handles 404 error gracefully', async () => {
      const mockError = {
        response: { status: 404, data: { detail: 'Voucher not found' } },
      };
      api.getVoucherDetails.mockRejectedValue(mockError);

      const result = await handleGetVoucherDetails(404);

      expect(logError).toHaveBeenCalledWith('Error fetching voucher details:', mockError);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'Error retrieving voucher information' },
      ]);
    });
  });

  describe('Edge Cases', () => {
    test('returns "N/A" for empty string discount code', async () => {
      const mockResponse = {
        data: { results: [{ exam: 5, discount_code: '' }] },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(5);
      expect(result).toEqual([
        { title: 'Discount Code:', description: 'N/A' },
      ]);
    });

    test('handles long discount code', async () => {
      const longCode = 'X'.repeat(500);
      const mockResponse = {
        data: { results: [{ exam: 7, discount_code: longCode }] },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(7);
      expect(result[0].description).toBe(longCode);
    });

    test('handles unicode/special chars', async () => {
      const mockResponse = {
        data: { results: [{ exam: 9, discount_code: '💥SPECIAL-2025-¡OK!' }] },
      };
      api.getVoucherDetails.mockResolvedValue(mockResponse);

      const result = await handleGetVoucherDetails(9);
      expect(result[0].description).toBe('💥SPECIAL-2025-¡OK!');
    });
  });
});

describe('getWorkflowType', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    delete global.window;
    global.window = {
      location: {
        pathname: '/',
      },
    };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  test('returns PASSTHROUGH when pathname ends with exam', () => {
    window.location.pathname = '/exam-dashboard/exam';
    expect(getWorkflowType()).toBe(WORKFLOWS.PASSTHROUGH);
  });

  test('returns DASHBOARD when pathname ends with dashboard', () => {
    window.location.pathname = '/exam-dashboard/dashboard';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('returns DASHBOARD for root path', () => {
    window.location.pathname = '/';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('returns DASHBOARD for empty pathname', () => {
    window.location.pathname = '';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('handles trailing slash on exam path', () => {
    window.location.pathname = '/exam-dashboard/exam/';
    expect(getWorkflowType()).toBe(WORKFLOWS.PASSTHROUGH);
  });

  test('handles trailing slash on dashboard path', () => {
    window.location.pathname = '/exam-dashboard/dashboard/';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('returns DASHBOARD for unknown last segment', () => {
    window.location.pathname = '/exam-dashboard/unknown';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('handles multiple slashes in path', () => {
    window.location.pathname = '/exam-dashboard//exam';
    expect(getWorkflowType()).toBe(WORKFLOWS.PASSTHROUGH);
  });

  test('ignores exam in middle of path', () => {
    window.location.pathname = '/exam/dashboard';
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });

  test('handles deeply nested exam path', () => {
    window.location.pathname = '/a/b/c/d/exam';
    expect(getWorkflowType()).toBe(WORKFLOWS.PASSTHROUGH);
  });

  test('handles window being undefined', () => {
    const newWindow = global.window;
    delete global.window;
    global.window = undefined;

    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);

    global.window = newWindow;
  });

  test('handles location being undefined', () => {
    global.window = {};
    expect(getWorkflowType()).toBe(WORKFLOWS.DASHBOARD);
  });
});

describe('redirect helpers', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    delete global.window;
    global.window = {
      location: {
        href: '',
        pathname: '/exam-dashboard/dashboard',
      },
    };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  test('includes candidate_id when redirecting to reschedule', () => {
    redirectToReschedule({ vue_appointment_id: '123', candidate: 77 });

    expect(window.location.href).toBe('https://example.com/api/appointment/reschedule/?registration_id=123&candidate_id=77&w=dashboard');
  });

  test('includes candidate_id when redirecting to cancel', () => {
    redirectToCancelExam({ vue_appointment_id: '456', candidate_id: 88 });

    expect(window.location.href).toBe('https://example.com/api/appointment/cancel/?registration_id=456&candidate_id=88&w=dashboard');
  });
});

describe('scheduleExam', () => {
  test('includes candidate_id in CDD payload when provided', async () => {
    api.updateUserData.mockResolvedValue({});

    await scheduleExam({
      formData: {
        firstName: { value: 'John' },
        lastName: { value: 'Doe' },
        dialingCode: { value: 'US' },
        phone: { value: '1111111111' },
        address: { value: '123 Main St' },
        city: { value: 'Miami' },
        state: { value: 'FL' },
        postalCode: { value: '12345' },
        country: { value: 'USA' },
      },
      shouldRedirectToSchedule: false,
      candidateId: 42,
    });

    expect(api.updateUserData).toHaveBeenCalledWith(expect.objectContaining({
      candidate_id: 42,
    }));
  });
});
