import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onLogin = async (data) => {
    const toastid = toast.loading("Logging in..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/login`, data);
      toast.success(res.data.message, { id: toastid });
      if (res.data.token) {
        localStorage.setItem("vendor_token", res.data.token);
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      if (err?.response?.data?.message === "Verify your account first. mail has been sent to your email") {
        navigate("/vendor/verify_otp");
      }
      toast.error(err?.response?.data?.message || "Login failed", { id: toastid });
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
            Sign in to your vendor account
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          {/* Card title */}
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">Vendor Login</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Enter your credentials to continue</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onLogin)} className="space-y-3">
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

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className={inputClass}
              />
              {errors.password && <p className={errorClass}>· {errors.password.message}</p>}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <span
                onClick={() => navigate("/vendor/forgetpassword")}
                className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm shadow-orange-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Log in "}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Not registered as vendor?{" "}
          <span
            onClick={() => navigate("/vendor/signup")}
            className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
          >
            Register Vendor
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;