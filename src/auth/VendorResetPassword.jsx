import React, { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

const VendorResetPassword = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const otpValue = watch("otp", "");

  const onSubmit = async (data) => {
    const toastid = toast.loading("Resetting password..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/changepassword`, data);
      toast.success(res.data.message, { id: toastid });
      navigate("/vendor/login");
    } catch (err) {
      toast.error(err?.response?.data?.message, { id: toastid });
    }
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2";
  const errorClass =
    "text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5 flex items-center gap-1";

  const renderBoxes = () =>
    [0, 1, 2, 3, 4, 5].map((index) => (
      <div
        key={index}
        className={`w-11 h-13 flex items-center justify-center border-2 rounded-xl text-lg font-bold transition-all select-none ${
          otpValue[index]
            ? "border-orange-500 bg-orange-50 text-orange-600"
            : "border-slate-200 bg-slate-50 text-slate-400"
        } ${otpValue.length === index ? "ring-2 ring-orange-400/50 border-orange-400" : ""}`}
      >
        {otpValue[index] || ""}
      </div>
    ));

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
            Reset your vendor password
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          {/* Card title */}
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">Set New Password</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Enter OTP & your new password</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* New Password */}
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters required" },
                })}
                className={inputClass}
              />
              {errors.password && <p className={errorClass}>· {errors.password.message}</p>}
            </div>

            {/* OTP Boxes */}
            <div>
              <label className={labelClass}>Verification Code</label>
              <div
                className="flex justify-between gap-2 relative cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                {renderBoxes()}
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: { value: 6, message: "Enter all 6 digits" },
                  })}
                  ref={(e) => {
                    register("otp").ref(e);
                    inputRef.current = e;
                  }}
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="absolute inset-0 opacity-0 cursor-default"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setValue("otp", val);
                  }}
                />
              </div>
              {errors.otp && <p className={errorClass + " justify-center mt-2"}>· {errors.otp.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : " Update Password"}
            </button>

          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Need help?{" "}
          <span
            onClick={() => navigate("/vendor/login")}
            className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
          >
            Back to Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default VendorResetPassword;