import { logError } from '@edx/frontend-platform/logging';

import { handleGetVoucherDetails } from 'features/utils/globals';
import * as api from 'features/data/api';

jest.mock('features/data/api', () => ({
  getVoucherDetails: jest.fn(),
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
