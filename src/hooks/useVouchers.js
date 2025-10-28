import { useState, useEffect, useCallback } from 'react';

import { getVouchers } from 'features/data/api';

/**
 * Custom React hook for fetching and managing available vouchers.
 *
 * This hook handles data retrieval, loading state, and toast notifications
 * related to the vouchers endpoint. It automatically fetches vouchers on mount.
 *
 * @function useVouchers
 * @returns {Object} The vouchers data and control handlers.
 * @property {Array} vouchers - The list of available vouchers.
 * @property {boolean} isLoading - Indicates whether voucher data is currently being fetched.
 * @property {{show: boolean, message: string}} toast - Toast state for displaying user feedback.
 * @property {Function} setToast - Setter function for updating toast messages.
 */
export const useVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchVouchers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getVouchers();
      const data = Array.isArray(response?.data) ? response.data : [];
      setVouchers(data);
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to load vouchers. Please try again later.',
      });
      setVouchers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return {
    vouchers,
    isLoading,
    toast,
    setToast,
  };
};
