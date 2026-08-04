import { React, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  updateCartItem,
  removeProductFromCart,
} from "../../../redux/thunks/cartThunk";

import {
  selectCartItems,
} from "../../../redux/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();

  const cartItems =
    useSelector(
      selectCartItems
    );
  console.log(cartItems);

  useEffect(() => {

    dispatch(
      fetchCart()
    );

  }, [
    dispatch,
  ]);

 const removeFromCart = async (productId) => {
  await dispatch(removeProductFromCart(productId));

  dispatch(fetchCart());
};

 const updateQuantity = async (productId, quantity) => {
  if (quantity < 1) return;

  await dispatch(
    updateCartItem({
      productId,
      quantity,
    })
  );

  dispatch(fetchCart());
};

  // Derived State Calculations
  const subtotal =
    (cartItems || []).reduce(
      (acc, item) =>
        acc +
        (
          (item.price || 0) *
          (item.quantity || 1)
        ),
      0
    );
  const tax = subtotal * 0.18; // 18% GST example
  const shipping = subtotal > 2000 ? 0 : 150; // Free shipping above ₹2000
  const grandTotal = subtotal + tax + shipping;

  // Render Empty State
  if (
    !cartItems?.length
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-20 h-20 text-[#8B4513] opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any products to your cart yet. Let's get you started!
        </p>
        <Link
          to="/products"
          className="bg-[#8B4513] hover:bg-[#6b3410] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-5   ">
      <div className="flex items-center gap-3 mt-8 mb-8">
        <ShoppingBag className="w-8 h-8 text-[#8B4513]" />
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium ml-2">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div  key={item.productId?._id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center">

                  {/* Product Info */}
                  <div className="col-span-1 sm:col-span-6 flex gap-4">
                    <div className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <Link to={`/products/${item.productId?._id}`}>
                      <img
                        src={
                          item?.productId?.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={
                          item?.productId?.title
                        }
                        className="w-full h-full object-cover"
                      />
                      </Link>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">{item.productId?.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Price: ₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="col-span-1 sm:col-span-3 flex items-center justify-start sm:justify-center">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button
                       onClick={() =>
  updateQuantity(
    item.productId._id,
    item.quantity - 1
  )
}
                        className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                       onClick={() =>
  updateQuantity(
    item.productId._id,
    item.quantity + 1
  )
}
                        className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Total Price Per Item */}
                  <div className="hidden sm:block col-span-2 text-right">
                    <span className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Remove Button (Desktop) */}
                  <div className="hidden sm:flex col-span-1 justify-center">
                    <button
                     onClick={() =>
  removeFromCart(
    item.productId._id
  )
}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Mobile View Summary */}
                  <div className="sm:hidden flex justify-between items-center w-full mt-2 border-t border-gray-100 pt-3">
                    <span className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                     onClick={() =>
  removeFromCart(
    item.productId._id
  )
}
                      className="text-sm text-red-500 font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (18%)</span>
                <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-medium text-green-600">Free</span>
                ) : (
                  <span className="font-medium text-gray-900">₹{shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-[#8B4513]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-[#8B4513] hover:bg-[#6b3410] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl">
              Proceed to Checkout <ArrowRight size={20} />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={18} className="text-green-600" />
              <span>Secure & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}