import { useState, useEffect, useCallback } from 'react';
import { fetchCustomers, fetchCustomersError, fetchCustomersEmpty } from '../api/mockApi';

// For testing different states: 'success' | 'error' | 'empty'
const TEST_STATE = 'success'; // Change this to test different states

export const useCustomers = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (TEST_STATE === 'error') {
        result = await fetchCustomersError();
      } else if (TEST_STATE === 'empty') {
        result = await fetchCustomersEmpty();
      } else {
        result = await fetchCustomers();
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
