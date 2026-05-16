// Test configuration - controls which API state is returned
// Change these values to test different states
export const TEST_CONFIG = {
  // 'success' | 'error' | 'empty'
  ORDERS_STATE: 'success',
  PRODUCTS_STATE: 'success',
  CUSTOMERS_STATE: 'success',
  DASHBOARD_STATE: 'success',
};

export const setTestState = (screen, state) => {
  TEST_CONFIG[`${screen.toUpperCase()}_STATE`] = state;
};
