import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function VerifyOTP() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const otpValue = watch("otp", "");
  const inputRef = useRef(null);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const verify = async (data) => {
    const toastid = toast.loading("Verifying OTP..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/verify_otp`, data);
      toast.success(res.data.message, { id: toastid });
      navigate("/vendor/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed", { id: toastid });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/resend_otp`, { email });
      toast.success(res.data.message || "OTP resent successfully");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
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
            Verify your vendor account
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          {/* Card title */}
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
             
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">Email Verification</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Enter the 6-digit code sent to your email</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(verify)} className="space-y-4">

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                placeholder="vendor@example.com"
                {...register("email", { required: "Email is required" })}
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>· {errors.email.message}</p>}
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
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </button>

            {/* Resend */}
            <p className="text-xs text-slate-400 text-center">
              {canResend ? (
                <>
                  Didn't receive code?{" "}
                  <span
                    onClick={handleResend}
                    className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
                  >
                    Resend OTP
                  </span>
                </>
              ) : (
                <>
                  Resend code in{" "}
                  <span className="font-mono font-bold text-slate-600">{timer}s</span>
                </>
              )}
            </p>

          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Already verified?{" "}
          <span
            onClick={() => navigate("/vendor/login")}
            className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
          >
            Vendor Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default VerifyOTP;