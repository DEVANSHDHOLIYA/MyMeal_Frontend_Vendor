import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const signup = async (data) => {
    const toastid= toast.loading("Creating account..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/vendor/register`, data);
      toast.success(res.data.message,{id:toastid});
      navigate("/vendor/verify_otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong",{id:toastid});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-24 h-20 object-contain" />
          <h1 className="text-xl font-bold text-gray-800 mt-2">My<span className="text-orange-500" >Meal</span></h1>
          <p className="text-xs text-gray-500">Vendor Registration</p>
        </div>

        <form onSubmit={handleSubmit(signup)} className="space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Required" })}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phoneno"
                {...register("phoneno", { required: "Required" })}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.phoneno && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Company"
                {...register("companyname", { required: "Required" })}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.companyname && <p className="text-red-500 text-xs">{errors.companyname.message}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Required" })}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 cursor-pointer hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-2.5 rounded-lg text-sm transition"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center mt-5">
          Already registered?{" "}
          <span
            onClick={() => navigate("/vendor/login")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Vendor Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;