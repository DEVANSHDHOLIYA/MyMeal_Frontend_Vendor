import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config.js";
import {
  Users,
  Calendar,
  Star,
  TrendingUp,
  ChefHat,
  Wallet,
  CheckCircle2,
  PauseCircle,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className={`bg-white border rounded-xl p-5 flex items-center gap-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)] ${accent ? "border-orange-500" : "border-slate-200"}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20" : "bg-slate-50 border border-slate-100 text-slate-500"}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold tracking-tight text-slate-900">{value ?? "—"}</p>
    </div>
  </div>
);

function VendorDashboard() {
  const [profile, setProfile] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const vendor_token = localStorage.getItem("vendor_token");
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${vendor_token}`,
    },
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, subRes, planRes] = await Promise.allSettled([
        axios.post(`${BACKEND_URL}/profile/vendor/get_profile`, {}, headers),
        axios.get(`${BACKEND_URL}/subscription/getsubscriberinfo`, headers),
        axios.get(`${BACKEND_URL}/subscription/vendor/showsubscription`, headers),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data?.data);
      if (subRes.status === "fulfilled") setSubscribers(subRes.value.data?.data || []);
      if (planRes.status === "fulfilled") setPlans(planRes.value.data?.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const activeCount = subscribers.filter((s) => !s.ispaused).length;
  const pausedCount = subscribers.filter((s) => s.ispaused).length;

  // ── Skeleton ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans px-6 md:px-12 py-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="pb-8 border-b border-slate-200 space-y-2">
            <div className="h-8 w-52 bg-slate-100 rounded" />
            <div className="h-4 w-72 bg-slate-50 rounded" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 flex items-center gap-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <div className="w-16 h-2 bg-slate-100 rounded" />
                  <div className="w-10 h-6 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-t border-slate-50">
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {profile?.companyname || "Dashboard"}
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Welcome back — here's your kitchen at a glance.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Live</span>
          </div>
        </div>

        {/* ── Stats grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Subscribers" value={subscribers.length} icon={Users} accent />
          <StatCard label="Active"             value={activeCount}         icon={CheckCircle2} />
          <StatCard label="Paused"             value={pausedCount}         icon={PauseCircle} />
          <StatCard label="Store Rating"       value={`${profile?.rating || 0} / 5`} icon={Star} />
        </div>

        {/* ── Plans quick view ─────────────────────────────────── */}
        {plans.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Your Plans</h2>
              </div>
              <button
                onClick={() => navigate("/vendor/subscriptions")}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
              >
                Manage <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-[4px_4px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors"
                >
                  <div className="w-9 h-9 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                    <ChefHat size={16} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{plan.duration}</p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">₹{plan.price}</p>
                  <div className="border-t border-slate-100 mt-4 pt-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-500 font-medium leading-snug">{plan.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Subscribers table ────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Recent Subscribers</h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-100 bg-orange-50">
              <TrendingUp size={11} className="text-orange-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-orange-600">{subscribers.length} total</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            {subscribers.length === 0 ? (
              <div className="py-14 flex flex-col items-center text-center px-6">
                <Users size={28} className="text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No subscribers yet</p>
                <p className="text-xs text-slate-300 mt-1">Customers who subscribe will appear here.</p>
              </div>
            ) : (
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
                        day: "2-digit", month: "short", year: "numeric",
                      });
                      return (
                        <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800">{item.user_id?.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              {item.subscription_id?.duration || item.duration}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {item.ispaused ? (
                              <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-tight">
                                <PauseCircle size={13} /> Paused
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                                <CheckCircle2 size={13} /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-700 text-xs font-bold block">{expiryDate}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.ispaid ? "Payment Verified" : "Pending Payment"}
                            </span>
                          </td>
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
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default VendorDashboard;