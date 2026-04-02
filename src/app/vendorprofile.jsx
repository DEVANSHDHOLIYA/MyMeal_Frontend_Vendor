import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { BACKEND_URL } from "../config/config.js";



// --- Skeleton Component ---
const SkeletonTile = ({ isLarge }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 border border-gray-50 ${isLarge ? 'h-32' : 'h-20'}`}>
    <div className="p-4">
      <div className="h-2 w-12 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// --- DataTile Component ---
const DataTile = ({ label, name, value, isEditing, isTextArea, onChange, error, inputRef, placeholder }) => (
  <div className={`p-4 rounded-xl border ${error ? 'border-red-200 bg-red-50/10' : 'border-gray-100 bg-white'} shadow-sm transition-all duration-300`}>
    <p className={`text-[9px] font-bold uppercase tracking-wider mb-2 transition-colors ${error ? 'text-red-500' : isEditing ? 'text-orange-600' : 'text-gray-400'}`}>
      {label} {error && <span className="lowercase font-normal">({error.message})</span>}
    </p>
    
    {isEditing ? (
      <div className="relative">
        {isTextArea ? (
          <textarea
            name={name}
            className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-lg p-2.5 font-bold text-gray-900 outline-none resize-none text-sm transition-all focus:border-orange-500 focus:bg-white"
            rows="2"
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
          />
        ) : (
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            ref={inputRef}
            className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-lg px-3 py-2 font-bold text-gray-900 outline-none text-sm transition-all focus:border-orange-500 focus:bg-white"
            value={value || ""}
            onChange={onChange}
          />
        )}
      </div>
    ) : (
      <p className="font-bold text-gray-800 truncate text-sm px-1 min-h-[1.25rem]">
        {value || <span className="text-gray-300 font-normal italic">Not set</span>}
      </p>
    )}
  </div>
);

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
    }
  });

  const formData = watch();

  const Vendor_Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${vendor_token}`
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
    if (cached) {
        reset(JSON.parse(cached));
        setFetching(false);
    }
    fetchVendorProfile();
  }, [fetchVendorProfile, reset]);

  const onSave = async (data) => {
    setIsSaving(true);
    const toastid=toast.loading("Updating Profile..");
    try {
      const res = await axios.post(`${BACKEND_URL}/profile/vendor/update_profile`, data, Vendor_Authorization_Header);
      toast.success(res.data.message || "Vendor Profile Updated",{id:toastid});
      setIsEditing(false);
      localStorage.setItem("vendor_profile", JSON.stringify(data));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed",{id:toastid});
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Vendor Logged out Successfully");
  };

  return (
    <div className="h-fit bg-[#FBFBFC] p-4 flex items-start justify-center font-sans text-gray-900">
      
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden h-fit">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col items-center md:items-start text-center md:text-left">
          {fetching ? (
            <div className="w-20 h-20 bg-gray-200 rounded-2xl animate-pulse mb-4"></div>
          ) : (
            <div className="animate-fade-in w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-orange-100">
              {formData.name?.charAt(0) || "V"}
            </div>
          )}

          {fetching ? (
            <div className="space-y-2 mb-6 w-full flex flex-col items-center md:items-start">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-lg font-black text-gray-900 leading-tight">{formData.companyname || "Business Name"}</h1>
              <p className="text-gray-400 font-semibold text-[10px] mb-6">{formData.email}</p>
            </div>
          )}

          <nav className="flex flex-col gap-2 w-full">
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold text-xs transition-all ${!isEditing && !fetching ? 'bg-orange-600 text-white shadow-md shadow-orange-100 hover:bg-orange-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={isEditing || fetching}
            >
              Edit Business Info
            </button>
            <button onClick={logout} className="w-full cursor-pointer text-left px-4 py-2.5 rounded-lg font-bold text-xs text-red-500 hover:bg-red-50 transition-all">
              Log Out
            </button>
          </nav>

          {/* RATING CARD */}
          <div className="w-full bg-orange-600 rounded-2xl mt-5 p-4 mb-6 shadow-lg shadow-orange-100 text-white transition-all duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Store Rating</p>
            {fetching ? (
              <div className="h-8 w-16 bg-white/20 rounded animate-pulse mt-1"></div>
            ) : (
              <div className="animate-fade-in flex items-end gap-1 mt-1">
                <span className="text-3xl font-black">{formData.rating || 0}</span>
                <span className="text-lg font-bold opacity-80 mb-1">/ 5.0</span>
              </div>
            )}
            <div className="flex gap-0.5 mt-2 justify-center md:justify-start">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(formData.rating || 0) ? 'text-yellow-300' : 'text-orange-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Form */}
        <form onSubmit={handleSubmit(onSave)} className="p-6 md:p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Vendor Profile</h2>
              <p className="text-gray-400 text-[11px]">Manage your business registration and contact details.</p>
            </div>
            {isEditing && (
              <div className="animate-fade-in flex gap-2">
                <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="px-4 py-2 bg-white border cursor-pointer border-gray-200 rounded-lg font-bold text-[10px] uppercase text-gray-500 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold cursor-pointer text-[10px] uppercase shadow-lg disabled:opacity-50 hover:bg-orange-700 transition-all">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${!fetching ? 'animate-fade-in' : ''}`}>
            {fetching ? (
              Array(8).fill(0).map((_, i) => <SkeletonTile key={i} />)
            ) : (
              [
                { label: "Owner Name", name: "name", rules: { required: "Required" } },
                { label: "Company Name", name: "companyname", rules: { required: "Required" } },
                { label: "Phone Number", name: "phoneno", rules: { required: "Required", pattern: { value: /^\d{10}$/, message: "10 digits only" } } },
                { label: "City", name: "city", rules: { required: "Required" } },
                { label: "State", name: "state", rules: { required: "Required" } },
                { label: "Country", name: "country", rules: { required: "Required" } },
                { label: "UPI ID", name: "upiid", rules: { required: "Required" } },
                { label: "Postal Pincode", name: "pincode", rules: { required: "Required", pattern: { value: /^\d{6}$/, message: "6 digits only" } } },
              ].map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  rules={field.rules}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DataTile 
                      label={field.label} name={field.name} value={value} 
                      isEditing={isEditing} onChange={onChange} 
                      placeholder={field.placeholder} error={error} 
                    />
                  )}
                />
              ))
            )}

            {!fetching && (
              <>
                <div className="md:col-span-1">
                  <DataTile label="Registered Email" name="email" value={formData.email} isEditing={false} />
                </div>
                <div className="md:col-span-1">
                  <Controller
                    name="about"
                    control={control}
                    rules={{ required: "About section is required" }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <DataTile 
                        label="About Business" name="about" value={value} 
                        isEditing={isEditing} isTextArea 
                        placeholder="Describe your food services..."
                        onChange={onChange} error={error} 
                      />
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <DataTile 
                        label="Store Address" name="address" value={value} 
                        isEditing={isEditing} isTextArea 
                        placeholder="Enter full business address"
                        onChange={onChange} error={error} 
                      />
                    )}
                  />
                </div>
              </>
            )}

            {fetching && (
              <>
                <div className="md:col-span-1"><SkeletonTile /></div>
                <div className="md:col-span-1"><SkeletonTile /></div>
                <div className="md:col-span-2"><SkeletonTile isLarge /></div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;