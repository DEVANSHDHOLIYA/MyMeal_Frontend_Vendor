import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Filter, Calendar, X, Loader2, MoreHorizontal, ChefHat, Upload, Camera, Globe, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config.js";

const vendor_token = localStorage.getItem("vendor_token");
const Vendor_Authorization_Header = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${vendor_token}`,
  },
};
const meal_Authorization_Header = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${vendor_token}`,
    },
  };


// ── COMPONENTS ─────────────────────────────────────────────

const MealCard = ({ meal }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all hover:-translate-y-1 group">
    <div className="relative h-48 overflow-hidden bg-slate-100">
      <img
        src={meal.mealphoto?.url || "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&q=80&w=400"}
        alt="Meal"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 flex gap-2">
         {meal.subscription_id ? (
           <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
              <Lock size={8} /> Subscription
           </span>
         ) : (
           <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
              <Globe size={8} /> Normal Meal
           </span>
         )}
      </div>
      <div className="absolute top-3 right-3">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
          meal.mealtime === 'lunch' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-white'
        }`}>
          {meal.mealtime}
        </span>
      </div>
    </div>
    
    <div className="p-5 space-y-4 flex flex-col h-[calc(100%-12rem)]">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {Array.isArray(meal.items) ? meal.items[0] : meal.items?.split(',')[0] || "Meal Package"}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Array.isArray(meal.items) ? meal.items.map((item, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {item}
            </span>
          )) : meal.items?.split(',').filter(item => item.trim() !== "").map((item, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {item.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Price</p>
          <p className="text-base font-bold text-slate-900">₹{meal.price}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
          <p className={`text-[10px] font-black uppercase tracking-tight ${meal.isavilable ? 'text-emerald-500' : 'text-rose-500'}`}>
            {meal.isavilable ? 'Available' : 'Sold Out'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-orange-500" />
          <span className="text-xs font-bold text-slate-500">
            {meal.meal_date ? new Date(meal.meal_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
          </span>
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  </div>
);

const MealCardSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col animate-pulse min-h-[380px]">
    <div className="h-48 bg-slate-100 w-full shrink-0"></div>
    <div className="p-5 space-y-4 flex flex-col flex-1">
      <div className="flex-1">
        <div className="h-5 w-3/4 bg-slate-100 rounded-md mb-3"></div>
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-slate-50 border border-slate-100 rounded"></div>
          <div className="h-4 w-12 bg-slate-50 border border-slate-100 rounded"></div>
          <div className="h-4 w-20 bg-slate-50 border border-slate-100 rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
        <div>
          <div className="h-2 w-10 bg-slate-100 rounded mb-2"></div>
          <div className="h-4 w-12 bg-slate-200 rounded"></div>
        </div>
        <div>
          <div className="h-2 w-12 bg-slate-100 rounded mb-2"></div>
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-slate-200 rounded-full"></div>
          <div className="h-3 w-16 bg-slate-100 rounded"></div>
        </div>
        <div className="h-4 w-4 bg-slate-100 rounded-full"></div>
      </div>
    </div>
  </div>
);

const Meals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingMeals, setFetchingMeals] = useState(true);
  
  const [plans, setPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [newMeal, setNewMeal] = useState({
    items: "",
    meal_date: new Date().toISOString().split('T')[0],
    price: "",
    subscription_id: "",
    mealtime: "lunch",
    image: null,
    mealType: "subscription"
  });

  // API CALL: Fetch Subscriptions
  const fetchPlans = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/subscription/vendor/showsubscription`, Vendor_Authorization_Header);
      const plansData = res.data.data || [];
      setPlans(plansData);
      if (plansData.length > 0 && !newMeal.subscription_id) {
        setNewMeal(prev => ({ ...prev, subscription_id: plansData[0]._id }));
      }
    } catch (err) {
      console.log(err);
    }
  }, [newMeal.subscription_id]);

  // API CALL: Fetch Meals
  const fetchMeals = useCallback(async () => {
    setFetchingMeals(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/meals/getmeals`, Vendor_Authorization_Header);
      setMeals(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setFetchingMeals(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchMeals();
  }, [fetchPlans, fetchMeals]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMeal({ ...newMeal, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // API CALL: Add Meal
  const handleAddMeal = async (e) => {
    e.preventDefault();
    

    const toastId = toast.loading("Adding meal to inventory...");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("meal_date", newMeal.meal_date);
      
      if (newMeal.mealType === "subscription") {
        formData.append("subscription_id", newMeal.subscription_id);
      }
      
      formData.append("items", newMeal.items.trim()); 
      formData.append("price", newMeal.price);
      formData.append("mealtime", newMeal.mealtime);
      formData.append("photo", newMeal.image); 
      
      const res = await axios.post(`${BACKEND_URL}/meals/addmeal`, formData, meal_Authorization_Header);
      
      const mockNewMeal = {
        _id: res.data?.data?._id || `meal_${Date.now()}`,
        mealphoto: res.data?.data?.mealphoto || { url: imagePreview },
        subscription_id: newMeal.mealType === "subscription" ? newMeal.subscription_id : null,
        mealtime: newMeal.mealtime,
        items: newMeal.items,
        price: newMeal.price,
        isavilable: true,
        meal_date: newMeal.meal_date,
      };

      setMeals(prev => [mockNewMeal, ...prev]);
      toast.success(res.data.message || "Meal added successfully!", { id: toastId });
      setIsModalOpen(false);
      resetForm();
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewMeal({
      items: "",
      meal_date: new Date().toISOString().split('T')[0],
      price: "",
      subscription_id: plans[0]?._id || "",
      mealtime: "lunch",
      image: null,
      mealType: "subscription"
    });
    setImagePreview(null);
  };

  const filteredMeals = Array.isArray(meals) ? meals.filter(meal => 
    (Array.isArray(meal.items) && meal.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (typeof meal.items === 'string' && meal.items.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  return (
    <div className="min-h-screen font-sans text-slate-900 space-y-10 pb-20">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Meals <span className="text-orange-500">Inventory</span>
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Manage your kitchen's daily offerings based on your plans.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[2px_4px_12px_rgba(249,115,22,0.25)] active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Meal
        </button>
      </div>

      {/* ── Search & Filter ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by items (e.g., Paneer, Dal)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fetchingMeals ? (
           Array(8).fill(0).map((_, i) => (
             <MealCardSkeleton key={i} />
           ))
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredMeals.map((meal) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={meal._id}
                  className="h-full"
                >
                  <MealCard meal={meal} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredMeals.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <ChefHat size={40} className="text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No meals found</p>
                <p className="text-xs text-slate-300 mt-1">Ready to cook? Add your first meal above.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Add New Meal</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live API Enabled</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                
                {/* Compact Image Upload */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-all overflow-hidden group"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera size={14} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Upload</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest leading-none">Meal Photo</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Upload an image for this meal.<br/>
                      <span className="text-orange-500/80 font-bold">Image sent to API instantly.</span>
                    </p>
                  </div>
                </div>

                {/* Meal Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meal Audience</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'subscription', label: 'Subscription Only', icon: Lock, color: 'text-indigo-500' },
                      { id: 'all', label: 'All Users (Normal)', icon: Globe, color: 'text-emerald-500' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewMeal({...newMeal, mealType: type.id})}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition-all cursor-pointer ${
                          newMeal.mealType === type.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_4px_12px_rgba(15,23,42,0.15)]' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <type.icon size={14} className={newMeal.mealType === type.id ? 'text-white' : type.color} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meal Price (₹)</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 150"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold"
                      value={newMeal.price}
                      onChange={(e) => setNewMeal({...newMeal, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meal Time</label>
                    <div className="flex gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                      {[
                        { id: 'lunch', label: 'Lunch' },
                        { id: 'dinner', label: 'Dinner' }
                      ].map((time) => (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => setNewMeal({...newMeal, mealtime: time.id})}
                          className={`flex-1 py-1.5 rounded-lg cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-all ${
                            newMeal.mealtime === time.id ? 'bg-orange-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Items Included</label>
                  <textarea
                    required
                    placeholder="E.g. Paneer, Roti, Dal..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold min-h-[80px] resize-none"
                    value={newMeal.items}
                    onChange={(e) => setNewMeal({...newMeal, items: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meal Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" size={16} />
                    <input
                      required
                      type="date"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer"
                      value={newMeal.meal_date}
                      onChange={(e) => setNewMeal({...newMeal, meal_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign to Plan</label>
                    <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{plans.length} Available</span>
                  </div>
                  
                  {newMeal.mealType === 'all' ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Globe size={14} />
                      </div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Available for all users directly</p>
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between">
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">No active plans found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {plans.map((plan) => (
                        <button
                          key={plan._id}
                          type="button"
                          onClick={() => setNewMeal({...newMeal, subscription_id: plan._id})}
                          className={`flex flex-col gap-2 p-3 border rounded-xl transition-all text-left cursor-pointer group ${
                            newMeal.subscription_id === plan._id 
                              ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            newMeal.subscription_id === plan._id ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          }`}>
                            <ChefHat size={12} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{plan.duration}</p>
                            <p className={`text-sm font-bold leading-none ${newMeal.subscription_id === plan._id ? 'text-orange-700' : 'text-slate-900'}`}>₹{plan.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    disabled={isLoading}
                    className="w-full py-4 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-[2px_4px_12px_rgba(249,115,22,0.25)] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={15} />
                        <span>Add Vendor Meal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Meals;
