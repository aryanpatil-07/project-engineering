import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardStats } from '../api/mockApi';

// For testing different states: 'success' | 'error'
const TEST_STATE = 'success'; // Change this to test different states

// Add error variant if needed
const fetchDashboardStatsError = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  throw new Error('Failed to fetch dashboard statistics.');
};

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (TEST_STATE === 'error') {
        result = await fetchDashboardStatsError();
      } else {
        result = await fetchDashboardStats();
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
