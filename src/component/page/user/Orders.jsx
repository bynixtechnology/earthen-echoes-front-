import React from "react";
import { Package } from "lucide-react";

const Orders = () => {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and track all your orders.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
              <Package className="w-10 h-10 text-orange-600" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500 text-center max-w-md">
              You haven't placed any orders yet. Once you place an
              order, it will appear here.
            </p>

            <button
              onClick={() => (window.location.href = "/products")}
              className="mt-8 px-6 py-3 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;