import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Calendar,
  Search,
  X,
  ExternalLink,
  CheckCircle2,
  PauseCircle,
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
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastid,
      });
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
      toast.success(res.data.message || "Price updated successfully", {
        id: toastid,
      });
      setIsEditModalOpen(false);
      resetEdit();
      getsubscriptions();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed", {
        id: toastid,
      });
    }
  };

  if (plans.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-60 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-2xl" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="w-20 h-4 bg-gray-200 rounded-full" />
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-px bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-8 w-48 bg-gray-200 rounded-xl" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 md:p-10 font-sans">
      {/* --- ADD PLAN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-orange-50">
              <h3 className="text-xl font-bold text-gray-800">
                Add Subscription Plan
              </h3>
              <button
                onClick={toggleModal}
                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-orange-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(addSubscription)}
              className="p-6 space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Select Duration
                </label>
                <select
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                >
                  <option value="">Select Duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
                {errors.duration && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Description
                </label>
                <textarea
                  placeholder="e.g. 2 Meals/Day, Free Delivery..."
                  rows="3"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs ml-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-400 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95 transition"
                >
                  {isSubmitting ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UPDATE PRICE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-orange-50">
              <h3 className="text-xl font-bold text-gray-800">
                Update Plan Price
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-orange-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmitEdit(updatePrice)}
              className="p-6 space-y-5"
            >
              <input type="hidden" {...registerEdit("_id")} />
              <div className="bg-gray-50 p-4 rounded-xl mb-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Plan Duration
                </p>
                <p className="text-lg font-bold text-gray-700">
                  {selectedPlan?.duration}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  New Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                  {...registerEdit("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />
                {editErrors.price && (
                  <p className="text-red-500 text-xs ml-1">
                    {editErrors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  New Description
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                  {...registerEdit("description", {
                    required: "Description is required",
                  })}
                />
                {editErrors.description && (
                  <p className="text-red-500 text-xs ml-1">
                    {editErrors.description.message}
                  </p>
                )}
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-gray-400 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95 transition"
                >
                  {isEditing ? "Updating..." : "Update Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Subscriptions
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-1">
              Manage meal durations and pricing tiers.
            </p>
          </div>
          <button
            onClick={toggleModal}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-wider"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Add Plan</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="flex flex-col bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-orange-100 transition-colors duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                  <Calendar size={20} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-50 px-3 py-1 rounded-full">
                  Tier
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  {plan.duration}
                </h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-400 text-xs font-medium lowercase">
                    /plan
                  </span>
                </div>
              </div>
              <div className="flex-grow mb-8">
                <div className="h-px w-full bg-gray-100 mb-6" />
                <div className="flex gap-3 items-start">
                  <CheckCircle2
                    size={16}
                    className="text-orange-500 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {plan.description ||
                      "Standard meal subscription with scheduled delivery."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openEditModal(plan)}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-orange-100"
              >
                <Edit2 size={14} strokeWidth={2.5} />
                Manage Plan
              </button>
            </div>
          ))}
        </div>

        {/* --- SUBSCRIBERS TABLE --- */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              Active Subscribers
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none w-64 text-sm font-medium placeholder:text-gray-300"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-4 text-orange-600">Customer</th>
                  <th className="px-8 py-4 text-orange-600">Plan</th>
                  <th className="px-8 py-4 text-orange-600">Status</th>
                  <th className="px-8 py-4 text-orange-600">Expiry</th>
                  <th className="px-8 py-4 text-orange-600">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.map((item) => {
                  // Basic date formatting
                  const expiryDate = new Date(item.enddate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  );

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      {/* User Info from user_id object */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {item.user_id?.name}
                          </span>
                        </div>
                      </td>

                      {/* Plan Info from subscription_id object */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase w-fit">
                            {item.subscription_id?.duration || item.duration}
                          </span>
                        
                        </div>
                      </td>

                      {/* Status Logic using ispaused and pausedate */}
                      <td className="px-8 py-5">
                        {item.ispaused ? (
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-tight">
                              <PauseCircle size={14} /> Paused
                            </span>
                            {item.pausedate && (
                              <span className="text-[10px] text-amber-400 italic">
                                Since{" "}
                                {new Date(item.pausedate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                            <CheckCircle2 size={14} /> Active
                          </span>
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-gray-700 text-xs font-bold">
                            {expiryDate}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium lowercase">
                            {item.ispaid
                              ? "Payment Verified"
                              : "Pending Payment"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span className="text-gray-800 font-bold">
                          ₹{item.subscription_id?.price || item.price}
                        </span>
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Subscriptions;
