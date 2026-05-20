import React from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

const Orders = () => {
  const { data: orders, isLoading, error, refetch } = useOrders();

  // Move 8: Integrate state logic with four-state pattern
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
          <button disabled className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed">
            Export Report
          </button>
        </div>
        <SkeletonCard count={4} height={80} variant="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
        </div>
        <ErrorMessage 
          message="We couldn't load your orders. Check your connection and try again."
          errorDetail={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
        </div>
        <EmptyState 
          title="No Orders Yet"
          message="You don't have any orders to display. Orders will appear here as soon as customers place them."
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recent Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
