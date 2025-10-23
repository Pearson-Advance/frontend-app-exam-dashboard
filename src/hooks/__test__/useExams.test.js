import { waitFor } from '@testing-library/react';
import { logError } from '@edx/frontend-platform/logging';
import { renderHook, act } from '@testing-library/react-hooks';

import { useExams } from 'hooks/useExams';
import { getExams } from 'features/data/api';
import {
  redirectToReschedule,
  redirectToScoreReport,
  redirectToCancelExam,
} from 'features/utils/globals';

jest.mock('features/data/api');
jest.mock('features/utils/globals');
jest.mock('@edx/frontend-platform/logging');

describe('useExams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  const defer = () => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };

  test('should initialize with default values (loading=true until API resolves)', async () => {
    const d = defer();
    getExams.mockReturnValue(d.promise);

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    expect(result.current.exams).toEqual([]);
    expect(result.current.isLoadingExams).toBe(true);
    expect(result.current.toast).toEqual({ show: false, message: '' });

    await act(async () => {
      d.resolve({ data: { results: [] } });
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });
  });

  test('should fetch exams successfully on mount', async () => {
    const mockExams = [{ vue_appointment_id: '123', name: 'Exam 1' }];
    getExams.mockResolvedValue({ data: { results: mockExams } });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    expect(result.current.exams).toEqual(mockExams);
    expect(result.current.toast).toEqual({ show: false, message: '' });
    expect(getExams).toHaveBeenCalledTimes(1);
  });

  test('should handle API error and show toast', async () => {
    getExams.mockRejectedValue(new Error('Network error'));

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    expect(result.current.exams).toEqual([]);
    expect(result.current.toast).toEqual({
      show: true,
      message: 'Failed to load exams data. Please try again later.',
    });
    expect(logError).toHaveBeenCalled();
  });

  test('should handle unexpected response (missing results)', async () => {
    getExams.mockResolvedValue({ data: {} });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    expect(result.current.exams).toEqual([]);
  });

  test('should handle reschedule action successfully', async () => {
    const mockExam = { vue_appointment_id: '1', name: 'Exam 1' };
    getExams.mockResolvedValue({ data: { results: [mockExam] } });
    redirectToReschedule.mockResolvedValue({ data: { url: 'https://example.com/reschedule' } });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    await act(async () => {
      await result.current.actions.handleRescheduleUrl('1');
    });

    expect(window.location.href).toBe('https://example.com/reschedule');
    expect(result.current.exams[0].loadingReschedule).toBe(false);
  });

  test('should show toast when reschedule action fails', async () => {
    const mockExam = { vue_appointment_id: '1' };
    getExams.mockResolvedValue({ data: { results: [mockExam] } });
    redirectToReschedule.mockRejectedValue(new Error('Error'));

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    await act(async () => {
      await result.current.actions.handleRescheduleUrl('1');
    });

    expect(result.current.toast).toEqual({
      show: true,
      message: 'An error occurred while rescheduling the exam.',
    });
  });

  test('should show toast when response has no URL', async () => {
    const mockExam = { vue_appointment_id: '1' };
    getExams.mockResolvedValue({ data: { results: [mockExam] } });
    redirectToScoreReport.mockResolvedValue({ data: {} });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    await act(async () => {
      await result.current.actions.handleGetScoreReportUrl('1');
    });

    expect(result.current.toast).toEqual({
      show: true,
      message: 'Unexpected response from the server.',
    });
  });

  test('should handle cancel exam successfully', async () => {
    const mockExam = { vue_appointment_id: '1' };
    getExams.mockResolvedValue({ data: { results: [mockExam] } });
    redirectToCancelExam.mockResolvedValue({ data: { url: 'https://cancel.com' } });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    await act(async () => {
      await result.current.actions.handleCancelExam('1');
    });

    expect(window.location.href).toBe('https://cancel.com');
  });

  test('should update toast manually with setToast', async () => {
    getExams.mockResolvedValue({ data: { results: [] } });

    let result;
    await act(async () => {
      ({ result } = renderHook(() => useExams()));
    });

    await act(async () => {
      await waitFor(() => expect(result.current.isLoadingExams).toBe(false));
    });

    const newToast = { show: true, message: 'Manual toast message' };

    act(() => {
      result.current.setToast(newToast);
    });

    expect(result.current.toast).toEqual(newToast);
  });
});
