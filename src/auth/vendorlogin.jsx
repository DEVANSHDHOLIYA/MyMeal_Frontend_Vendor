import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onLogin = async (data) => {
    const toastid= toast.loading("Logging in..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/login`, data);

      toast.success(res.data.message,{id:toastid});

      if (res.data.token) {
        localStorage.setItem("vendor_token", res.data.token);
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      if(err?.response?.data?.message ==="Verify your account first. mail has been sent to your email"){navigate("/verify_otp");}
      toast.error(err?.response?.data?.message || "Login failed",{id:toastid});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="logo"
            className="w-24 h-20 object-contain"
          />

          <h1 className="text-xl font-bold text-gray-800 mt-2">
            My<span className="text-orange-500" >Meal</span>
          </h1>

          <p className="text-xs text-gray-500">
            Vendor Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-2">
            <span
              onClick={() => navigate("/vendor/forgetpassword")}
              className="text-xs text-orange-500 cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 cursor-pointer hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-2.5 rounded-lg text-sm transition"
          >
            {isSubmitting ? "Logging in..." : "Vendor Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Not registered as vendor?{" "}
          <span
            onClick={() => navigate("/vendor/signup")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Register Vendor
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;