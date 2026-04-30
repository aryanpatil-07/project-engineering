import { useState, useEffect, useCallback } from 'react';
import { fetchOrders, fetchOrdersError, fetchOrdersEmpty } from '../api/mockApi';

// For testing different states: 'success' | 'error' | 'empty'
const TEST_STATE = 'success'; // Change this to test different states

export const useOrders = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (TEST_STATE === 'error') {
        result = await fetchOrdersError();
      } else if (TEST_STATE === 'empty') {
        result = await fetchOrdersEmpty();
      } else {
        result = await fetchOrders();
      }
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};
