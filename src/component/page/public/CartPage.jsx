import React, { useEffect } from 'react';
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

import { C } from "../../../constants/theme";

export default function CartPage() {
  const dispatch = useDispatch();

  const cartItems =
    useSelector(
      selectCartItems
    );

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4" style={{ background: C.ivory }}>
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-6 shadow-sm" style={{ background: C.paleCoral }}>
          <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20" style={{ color: C.coral }} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md text-sm sm:text-base">
          Looks like you haven't added any products to your cart yet. Let's get you started!
        </p>
        <Link
          to="/products"
          className="text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
          style={{ background: C.coral }}
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ background: C.ivory, minHeight: '100vh' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl shadow-sm" style={{ background: C.paleCoral }}>
          <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: C.coral }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">Shopping Cart</h1>
        <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-2 shadow-xs" style={{ background: C.paleTeal, color: C.darkTeal }}>
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Side: Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.productId?._id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center">

                  {/* Product Info */}
                  <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                    <div className="w-20 h-20 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-[#FBF6F2]">
                      <Link to={`/products/${item.productId?._id}`}>
                        <img
                          src={
                            item?.productId?.images?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={
                            item?.productId?.title
                          }
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <Link to={`/products/${item.productId?._id}`} className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-[#F16937] transition-colors">
                        {item.productId?.title}
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Price: ₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="col-span-1 sm:col-span-3 flex items-center justify-between sm:justify-center">
                    <span className="sm:hidden text-xs text-gray-400 font-semibold uppercase tracking-wider">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-full bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId._id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-3ila disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId._id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Total Price Per Item */}
                  <div className="hidden sm:block col-span-2 text-right">
                    <span className="font-bold text-base sm:text-lg text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Remove Button (Desktop) */}
                  <div className="hidden sm:flex col-span-1 justify-center">
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.productId._id
                        )
                      }
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Mobile View Summary Row */}
                  <div className="sm:hidden flex justify-between items-center w-full mt-2 border-t border-gray-100 pt-3">
                    <span className="font-bold text-base text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.productId._id
                        )
                      }
                      className="text-xs text-red-500 font-semibold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-7 sticky top-24">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

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
                  <span className="font-semibold" style={{ color: C.green }}>Free</span>
                ) : (
                  <span className="font-medium text-gray-900">₹{shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: C.coral }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="w-full text-white py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.99]"
              style={{ background: C.coral }}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 py-3 rounded-2xl">
              <ShieldCheck size={18} style={{ color: C.green }} />
              <span>Secure & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}