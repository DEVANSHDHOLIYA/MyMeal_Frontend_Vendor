import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
      
      const res = await axios.post(
        `${BACKEND_URL}/auth/vendor/resetpassword`, 
        data
      );

      toast.success(res.data.message,{id:toastid});

      navigate("/vendor/resetpassword");

    } catch (err) {
      toast.error(err?.response?.data?.message || "User not found or error sending mail",{id:toastid});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-24 h-20 object-contain" />
          <h1 className="text-xl font-bold text-gray-800 mt-2">My<span className="text-orange-500" >Meal</span></h1>
          <p className="text-xs text-gray-500 text-center px-4">
            Enter your email to receive a 6-digit verification code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 ml-1">Registered Email</label>
            <input
              type="email"
              placeholder="e.g. vendor@mymeal.com"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format"
                }
              })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1 italic">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 cursor-pointer hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-2.5 rounded-lg text-sm transition shadow-md active:scale-95"
          >
            {isSubmitting ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-xs">
              Remembered your password?{" "}
              <span
                onClick={() => navigate("/vendor/login")}
                className="text-orange-500 font-semibold cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default VendorForgotPassword;