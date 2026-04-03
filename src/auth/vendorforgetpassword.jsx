import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const VendorForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastid = toast.loading("Sending OTP..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/resetpassword`, data);
      toast.success(res.data.message, { id: toastid });
      navigate("/vendor/resetpassword");
    } catch (err) {
      toast.error(err?.response?.data?.message || "User not found or error sending mail", { id: toastid });
    }
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2";
  const errorClass =
    "text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5 flex items-center gap-1";

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* BRAND HEADER */}
        <div className="text-center mb-5">
          <img src="/logo.png" alt="MyMeal" className="w-16 h-16 object-contain mx-auto mb-2" />
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            My<span className="text-orange-500">Meal</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Vendor account recovery
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          {/* Card title */}
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">Forgot Password</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">We'll send a 6-digit OTP to your email</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className={labelClass}>Registered Email</label>
              <input
                type="email"
                placeholder="vendor@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email address",
                  },
                })}
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>· {errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/vendor/login")}
            className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  );
};

export default VendorForgotPassword;