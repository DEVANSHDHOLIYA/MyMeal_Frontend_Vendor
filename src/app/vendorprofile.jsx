import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { BACKEND_URL } from "../config/config.js";
import {
  User,
  Building2,
  Phone,
  MapPin,
  Mail,
  Star,
  Wallet,
  FileText,
  LogOut,
  Edit3,
  X,
  CheckCircle2,
} from "lucide-react";

// ── Skeleton tile ──────────────────────────────────────────────
const SkeletonTile = ({ wide }) => (
  <div className={`animate-pulse bg-white border border-slate-100 rounded-xl p-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)] ${wide ? "md:col-span-2" : ""}`}>
    <div className="h-2 w-16 bg-slate-100 rounded mb-3" />
    <div className="h-5 w-3/4 bg-slate-100 rounded" />
  </div>
);

// ── Field tile (view / edit) ──────────────────────────────────
const DataTile = ({ label, icon: Icon, name, value, isEditing, isTextArea, onChange, error, placeholder }) => (
  <div className={`bg-white border rounded-xl p-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)] transition-all ${error ? "border-red-300" : isEditing ? "border-orange-300" : "border-slate-200"}`}>
    <div className="flex items-center gap-1.5 mb-2">
      {Icon && <Icon size={11} className={error ? "text-red-400" : isEditing ? "text-orange-500" : "text-slate-400"} />}
      <p className={`text-[9px] font-bold uppercase tracking-widest ${error ? "text-red-500" : isEditing ? "text-orange-500" : "text-slate-400"}`}>
        {label}
        {error && <span className="ml-1 font-normal normal-case tracking-normal text-red-400">({error.message})</span>}
      </p>
    </div>

    {isEditing ? (
      isTextArea ? (
        <textarea
          name={name}
          rows="2"
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all"
        />
      ) : (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      )
    ) : (
      <p className="text-sm font-bold text-slate-900 px-0.5 min-h-[1.25rem] truncate">
        {value || <span className="text-slate-300 font-normal italic">Not set</span>}
      </p>
    )}
  </div>
);

// ── Main component ─────────────────────────────────────────────
const VendorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const vendor_token = localStorage.getItem("vendor_token");

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "", email: "", phoneno: "", companyname: "", rating: 0,
      address: "", city: "", state: "", country: "", pincode: "", about: "", upiid: "",
    },
  });

  const formData = watch();

  const Vendor_Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${vendor_token}`,
    },
  };

  const fetchVendorProfile = useCallback(async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/profile/vendor/get_profile`, {}, Vendor_Authorization_Header);
      if (res.data?.data) {
        reset(res.data.data);
        localStorage.setItem("vendor_profile", JSON.stringify(res.data.data));
      }
    } catch (err) {
      if (err.response?.status !== 401) toast.error("Could not sync vendor profile");
    } finally {
      setFetching(false);
    }
  }, [reset]);

  useEffect(() => {
    const cached = localStorage.getItem("vendor_profile");
    if (cached) { reset(JSON.parse(cached)); setFetching(false); }
    fetchVendorProfile();
  }, [fetchVendorProfile, reset]);

  const onSave = async (data) => {
    setIsSaving(true);
    const toastid = toast.loading("Updating Profile..");
    try {
      const res = await axios.post(`${BACKEND_URL}/profile/vendor/update_profile`, data, Vendor_Authorization_Header);
      toast.success(res.data.message || "Vendor Profile Updated", { id: toastid });
      setIsEditing(false);
      localStorage.setItem("vendor_profile", JSON.stringify(data));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", { id: toastid });
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Vendor Logged out Successfully");
  };

  const fields = [
    { label: "Owner Name",        name: "name",        icon: User,      rules: { required: "Required" } },
    { label: "Company Name",      name: "companyname", icon: Building2, rules: { required: "Required" } },
    { label: "Phone Number",      name: "phoneno",     icon: Phone,     rules: { required: "Required", pattern: { value: /^\d{10}$/, message: "10 digits only" } } },
    { label: "City",              name: "city",        icon: MapPin,    rules: { required: "Required" } },
    { label: "State",             name: "state",       icon: MapPin,    rules: { required: "Required" } },
    { label: "Country",           name: "country",     icon: MapPin,    rules: { required: "Required" } },
    { label: "UPI ID",            name: "upiid",       icon: Wallet,    rules: { required: "Required" } },
    { label: "Postal Pincode",    name: "pincode",     icon: MapPin,    rules: { required: "Required", pattern: { value: /^\d{6}$/, message: "6 digits only" } } },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-10 pb-20">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {fetching ? (
                <span className="inline-block w-48 h-8 bg-slate-100 rounded animate-pulse" />
              ) : (
                formData.companyname || "Vendor Profile"
              )}
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Manage your business registration and contact details.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); reset(); }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  form="profile-form"
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={13} /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={fetching}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-red-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                >
                  <LogOut size={13} /> Log Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Rating + identity strip ───────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Avatar + name */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 flex-1 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            {fetching ? (
              <div className="w-14 h-14 bg-slate-100 rounded-xl animate-pulse shrink-0" />
            ) : (
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-sm shadow-orange-500/20 shrink-0">
                {formData.name?.charAt(0) || "V"}
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Registered Owner</p>
              {fetching ? (
                <div className="w-36 h-5 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-base font-bold text-slate-900">{formData.name || "—"}</p>
              )}
              <p className="text-xs text-slate-400 font-medium mt-0.5">{formData.email}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-orange-500 border border-orange-500 rounded-xl p-5 flex items-center gap-4 shadow-sm shadow-orange-500/20 min-w-[180px]">
            <div className="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center shrink-0">
              <Star size={18} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100 mb-0.5">Store Rating</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{formData.rating || 0}</span>
                <span className="text-sm font-bold text-orange-200">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile form ─────────────────────────────────────── */}
        <form id="profile-form" onSubmit={handleSubmit(onSave)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {fetching ? (
              Array(8).fill(0).map((_, i) => <SkeletonTile key={i} />)
            ) : (
              fields.map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  rules={field.rules}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DataTile
                      label={field.label}
                      icon={field.icon}
                      name={field.name}
                      value={value}
                      isEditing={isEditing}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      error={error}
                    />
                  )}
                />
              ))
            )}

            {/* Email — read only */}
            {!fetching && (
              <div className="md:col-span-1">
                <DataTile label="Registered Email" icon={Mail} name="email" value={formData.email} isEditing={false} />
              </div>
            )}

            {/* About */}
            {!fetching && (
              <div className="md:col-span-1">
                <Controller
                  name="about"
                  control={control}
                  rules={{ required: "About section is required" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DataTile
                      label="About Business" icon={FileText} name="about" value={value}
                      isEditing={isEditing} isTextArea
                      placeholder="Describe your food services..."
                      onChange={onChange} error={error}
                    />
                  )}
                />
              </div>
            )}

            {/* Address — full width */}
            {!fetching && (
              <div className="md:col-span-2">
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DataTile
                      label="Store Address" icon={MapPin} name="address" value={value}
                      isEditing={isEditing} isTextArea
                      placeholder="Enter full business address"
                      onChange={onChange} error={error}
                    />
                  )}
                />
              </div>
            )}

            {fetching && (
              <>
                <SkeletonTile />
                <SkeletonTile />
                <SkeletonTile wide />
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default VendorProfile;