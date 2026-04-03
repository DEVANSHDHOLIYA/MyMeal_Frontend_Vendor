import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Calendar,
  ChefHat,
  Search,
  X,
  CheckCircle2,
  PauseCircle,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config";

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    getsubscriptions();
    getsubscribers();
  }, []);

  const vendor_token = localStorage.getItem("vendor_token");
  const Vendor_Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${vendor_token}`,
    },
  };

  const getsubscriptions = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/subscription/vendor/showsubscription`,
        Vendor_Authorization_Header,
      );
      setPlans(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const getsubscribers = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/subscription/getsubscriberinfo`,
        Vendor_Authorization_Header,
      );
      setSubscribers(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    reset();
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setEditValue("_id", plan._id);
    setEditValue("price", plan.price);
    setEditValue("description", plan.description);
    setIsEditModalOpen(true);
  };

  const addSubscription = async (data) => {
    const toastid = toast.loading("Adding Subscription..");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/subscription/vendor/addsubscription`,
        data,
        Vendor_Authorization_Header,
      );
      toast.success(res.data.message, { id: toastid });
      toggleModal();
      getsubscriptions();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastid });
    }
  };

  const updatePrice = async (data) => {
    const toastid = toast.loading("Updating Subscription..");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/subscription/vendor/updatesubscription`,
        data,
        Vendor_Authorization_Header,
      );
      toast.success(res.data.message || "Price updated successfully", { id: toastid });
      setIsEditModalOpen(false);
      resetEdit();
      getsubscriptions();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", { id: toastid });
    }
  };

  // ── Shared form input styles ──────────────────────────────────
  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2";
  const errorClass =
    "text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5";

  // ── Skeleton loading state ────────────────────────────────────
  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans px-6 md:px-12 py-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-center pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <div className="h-8 w-44 bg-slate-100 rounded" />
              <div className="h-4 w-64 bg-slate-50 rounded" />
            </div>
            <div className="h-10 w-32 bg-slate-100 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl space-y-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <div className="w-16 h-4 bg-slate-50 rounded" />
                </div>
                <div className="h-5 w-24 bg-slate-100 rounded" />
                <div className="h-8 w-20 bg-slate-100 rounded" />
                <div className="h-px bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-50 rounded" />
                  <div className="h-3 bg-slate-50 rounded w-4/5" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-slate-100 rounded" />
              <div className="h-8 w-48 bg-slate-50 rounded-xl" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-t border-slate-50">
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-10 pb-20">

      {/* ── ADD PLAN MODAL ─────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Subscription Plan</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Set a new pricing tier for customers</p>
              </div>
              <button
                onClick={toggleModal}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(addSubscription)} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Select Duration</label>
                <select
                  className={inputClass + " cursor-pointer"}
                  {...register("duration", { required: "Duration is required" })}
                >
                  <option value="">Select Duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
                {errors.duration && <p className={errorClass}>· {errors.duration.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className={inputClass}
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
                {errors.price && <p className={errorClass}>· {errors.price.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  placeholder="e.g. 2 Meals/Day, Free Delivery..."
                  rows="3"
                  className={inputClass + " resize-none"}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className={errorClass}>· {errors.description.message}</p>}
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── UPDATE PRICE MODAL ─────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Update Plan Price</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Modify pricing for this subscription tier</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit(updatePrice)} className="p-6 space-y-4">
              <input type="hidden" {...registerEdit("_id")} />
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                <p className={labelClass + " mb-0.5"}>Plan Duration</p>
                <p className="text-base font-bold text-slate-900">{selectedPlan?.duration}</p>
              </div>
              <div>
                <label className={labelClass}>New Price (₹)</label>
                <input
                  type="number"
                  className={inputClass}
                  {...registerEdit("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
                {editErrors.price && <p className={errorClass}>· {editErrors.price.message}</p>}
              </div>
              <div>
                <label className={labelClass}>New Description</label>
                <textarea
                  rows="3"
                  className={inputClass + " resize-none"}
                  {...registerEdit("description", { required: "Description is required" })}
                />
                {editErrors.description && <p className={errorClass}>· {editErrors.description.message}</p>}
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isEditing ? "Updating..." : "Update Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">

        {/* ── PAGE HEADER ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Subscriptions
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Manage meal durations and pricing tiers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Plan count pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {plans.length} {plans.length === 1 ? "Plan" : "Plans"}
              </span>
            </div>
            <button
              onClick={toggleModal}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-xl transition-colors shadow-sm shadow-orange-500/20 active:scale-95 text-xs uppercase tracking-widest cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Plan
            </button>
          </div>
        </div>

        {/* ── PLAN CARDS ───────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Subscription Tiers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col shadow-[4px_4px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors"
              >
                {/* Icon */}
                <div className="w-9 h-9 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                  <ChefHat size={16} />
                </div>

                {/* Duration + price */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{plan.duration}</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">₹{plan.price}</p>

                {/* Description */}
                <div className="border-t border-slate-100 mt-4 pt-3 mb-5 flex-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-500 font-medium leading-snug">
                      {plan.description || "Standard meal subscription with scheduled delivery."}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => openEditModal(plan)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm shadow-orange-500/20 cursor-pointer mt-auto"
                >
                  <Edit2 size={13} strokeWidth={2.5} />
                  Manage Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── SUBSCRIBERS TABLE ────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Active Subscribers</h2>
              {/* Live count pills */}
              <div className="flex items-center gap-2 ml-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {subscribers.filter(s => !s.ispaused).length} Active
                </span>
                {subscribers.filter(s => s.ispaused).length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {subscribers.filter(s => s.ispaused).length} Paused
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none w-52 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Customer", "Plan", "Status", "Expiry", "Price"].map((col) => (
                      <th key={col} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((item) => {
                    const expiryDate = new Date(item.enddate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{item.user_id?.name}</span>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {item.subscription_id?.duration || item.duration}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {item.ispaused ? (
                            <div className="flex flex-col">
                              <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-tight">
                                <PauseCircle size={13} /> Paused
                              </span>
                              {item.pausedate && (
                                <span className="text-[10px] text-amber-400 mt-0.5">
                                  Since {new Date(item.pausedate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                              <CheckCircle2 size={13} /> Active
                            </span>
                          )}
                        </td>

                        {/* Expiry */}
                        <td className="px-6 py-4">
                          <span className="text-slate-700 text-xs font-bold block">{expiryDate}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.ispaid ? "Payment Verified" : "Pending Payment"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-slate-800 font-bold">
                            ₹{item.subscription_id?.price || item.price}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {subscribers.length === 0 && (
                <div className="py-14 flex flex-col items-center text-center border-t border-slate-100">
                  <Users size={28} className="text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No subscribers yet</p>
                  <p className="text-xs text-slate-300 mt-1">Customers who subscribe will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Subscriptions;
