import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useVouchers } from 'hooks/useVouchers';
import { getVouchers } from 'features/data/api';

jest.mock('features/data/api');

describe('useVouchers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', async () => {
    getVouchers.mockResolvedValue({ data: [] });

    await act(async () => {
      const { result } = renderHook(() => useVouchers());

      expect(result.current.vouchers).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.toast).toEqual({ show: false, message: '' });
      expect(typeof result.current.setToast).toBe('function');
    });
  });

  test('should fetch vouchers successfully on mount', async () => {
    const mockVouchers = [
      { id: 1, code: 'VOUCHER1', discount: 10 },
      { id: 2, code: 'VOUCHER2', discount: 20 },
    ];
    getVouchers.mockResolvedValue({ data: [...mockVouchers] });

    const { result } = renderHook(() => useVouchers());

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    expect(result.current.vouchers).toEqual(mockVouchers);
    expect(result.current.toast).toEqual({ show: false, message: '' });
    expect(getVouchers).toHaveBeenCalledTimes(1);
  });

  test('should handle empty results array', async () => {
    getVouchers.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useVouchers());

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    expect(result.current.vouchers).toEqual([]);
    expect(result.current.toast).toEqual({ show: false, message: '' });
  });

  test('should handle API errors and show toast', async () => {
    getVouchers.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useVouchers());

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    expect(result.current.vouchers).toEqual([]);
    expect(result.current.toast).toEqual({
      show: true,
      message: 'Failed to load vouchers. Please try again later.',
    });
    expect(getVouchers).toHaveBeenCalledTimes(1);
  });

  test('should update toast state when setToast is called', async () => {
    getVouchers.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useVouchers());

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    const newToast = { show: true, message: 'Custom message' };

    act(() => {
      result.current.setToast(newToast);
    });

    expect(result.current.toast).toEqual(newToast);
  });

  test('should set isLoading to false after successful fetch', async () => {
    const mockVouchers = [{ id: 1, code: 'TEST' }];
    getVouchers.mockResolvedValue({ data: [...mockVouchers] });

    const { result } = renderHook(() => useVouchers());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });

  test('should set isLoading to false after failed fetch', async () => {
    getVouchers.mockRejectedValue(new Error('Error'));

    const { result } = renderHook(() => useVouchers());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });
});
