import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config.js";
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp,
  User,
  Truck
} from "lucide-react";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const vendor_token = localStorage.getItem("vendor_token");
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${vendor_token}`,
    },
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/order/vendororders`, headers);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (orderId) => {
    setActionLoading(true);
    const toastId = toast.loading("Updating delivery status...");
    try {
      const res = await axios.post(`${BACKEND_URL}/order/markdelivered/${orderId}`, {}, headers);
      if (res.data.success) {
        toast.success("Order marked as delivered!", { id: toastId });
        await fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans px-6 md:px-12 py-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="pb-8 border-b border-slate-200 space-y-2">
            <div className="h-8 w-52 bg-slate-100 rounded" />
            <div className="h-4 w-72 bg-slate-50 rounded" />
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-50 border border-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => !o.isDelivered);
  const completedOrders = orders.filter(o => o.isDelivered);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Meal <span className="text-orange-500">Orders</span>
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Manage one-time individual orders placed by non-subscribers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-100 bg-orange-50">
            <Truck size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
              {pendingOrders.length} Pending Order{pendingOrders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Content Tabs/Grids */}
        {orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <ShoppingBag size={40} className="text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              No orders received yet
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Individual orders placed by customers will be shown here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pending Section */}
            {pendingOrders.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pending Deliveries</h2>
                <div className="grid grid-cols-1 gap-6">
                  {pendingOrders.map((order) => {
                    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    });
                    return (
                      <div key={order._id} className="bg-white border-2 border-orange-100 rounded-xl p-6 shadow-[4px_4px_0_rgba(249,115,22,0.03)] flex flex-col lg:flex-row justify-between gap-6 hover:border-orange-200 transition-colors">
                        <div className="space-y-4 flex-1">
                          {/* Top Row: Qty and Status */}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-2.5 py-1 rounded bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                              Qty: {order.quantity}
                            </span>
                            <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                              Paid (₹{order.total})
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{orderDate}</span>
                          </div>

                          {/* Meal Info */}
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{order.meal_id?.meals?.primary}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wider">Scheduled for: {order.meal_id?.mealtime} ({new Date(order.meal_id?.meal_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })})</p>
                          </div>

                          {/* User Address */}
                          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-start gap-4 text-xs font-semibold text-slate-600">
                            <div className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {order.user_id?.name}</div>
                            <div className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> {order.user_id?.phoneno || "N/A"}</div>
                            <div className="flex items-start gap-1.5 flex-1"><MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" /> {order.user_id?.address}, {order.user_id?.city}</div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center shrink-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleMarkDelivered(order._id)}
                            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-lg transition-colors shadow-sm shadow-orange-500/20 cursor-pointer"
                          >
                            <CheckCircle2 size={14} /> Mark Delivered
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Completed Section */}
            {completedOrders.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Completed Deliveries</h2>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {["Order Details", "Customer", "Scheduled Delivery", "Delivered", "Price"].map((col) => (
                            <th key={col} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {completedOrders.map((order) => {
                          const orderDate = new Date(order.updatedAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                          });
                          return (
                            <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 block">{order.meal_id?.meals?.primary}</span>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Qty: {order.quantity}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 block">{order.user_id?.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{order.user_id?.phoneno}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-semibold text-slate-700 block uppercase">{order.meal_id?.mealtime}</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(order.meal_id?.meal_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="flex items-center gap-1 text-emerald-600 font-bold uppercase tracking-tight">
                                  <CheckCircle2 size={13} /> {orderDate}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-slate-800 font-bold block">₹{order.total}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
