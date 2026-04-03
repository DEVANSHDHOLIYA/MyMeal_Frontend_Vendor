import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  BarChart3,
  Wallet,
  Users,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3.4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function VendorLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-100">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 pb-0.5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">

          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              className="w-16 h-12 group-hover:rotate-6 transition-transform duration-300 drop-shadow-sm"
              alt="logo"
            />
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="items-center gap-4 hidden sm:flex">
            <button
              onClick={() => navigate("/vendor/login")}
              className="text-sm font-bold text-gray-600 cursor-pointer hover:text-orange-500 transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/vendor/signup")}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Register as Vendor
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile nav */}
          <div className="sm:hidden">
            <button
              onClick={() => navigate("/vendor/login")}
              className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-70" />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Vendor Platform · MyMeal
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05]"
          >
            Grow Your Kitchen,{" "}
            <br className="hidden md:block" />
            <span className="text-orange-500">Your Way.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium"
          >
            List your tiffin service, manage daily subscriptions, track earnings, and serve hundreds of customers — all from one powerful vendor dashboard.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/vendor/signup")}
              className="w-full sm:w-auto bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Register as Vendor
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/vendor/login")}
              className="w-full sm:w-auto bg-white border cursor-pointer border-gray-200 text-gray-800 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            >
              Vendor Login
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-semibold tracking-wide"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500" /> Zero commission to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500" /> Full subscription control
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500" /> Direct UPI payouts
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Bento Grid Features ── */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">

          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-4">
                Built for vendors,{" "}
                <br />
                <span className="text-orange-500">not after-thoughts.</span>
              </h2>
              <div className="w-20 h-1.5 bg-orange-500 mt-4 mb-6 rounded-full" />
              <p className="text-gray-500 text-lg max-w-xl font-medium">
                Every tool you need to run a profitable tiffin business — built in, not bolted on.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">

            {/* Feature 1 — Large */}
            <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Meal Management</h3>
                <p className="text-gray-500 leading-relaxed max-w-md font-medium">
                  Create, edit, and publish your daily menus in seconds. Control availability, pricing, and portions — all from a single, clean dashboard built for speed.
                </p>
              </div>
            </div>

            {/* Feature 2 — Accent */}
            <div className="col-span-1 bg-orange-500 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between text-white group shadow-xl shadow-orange-500/20">
              <div className="w-14 h-14 bg-orange-400 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:rotate-12 transition-transform shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-2">Subscriber Overview</h3>
                <p className="text-orange-50 leading-relaxed text-sm font-medium">
                  See who's subscribed, track active plans, and manage customer preferences from one organised view.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-700 group-hover:scale-110 group-hover:rotate-3 group-hover:text-orange-500 transition-all">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Direct UPI Payouts</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Customers pay directly to your UPI ID. No middleman, no delays — earnings land where they should.
                </p>
              </div>
            </div>

            {/* Feature 4 — Large */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60" />
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform shadow-sm relative z-10">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-gray-800 mb-2">Analytics & Insights</h3>
                <p className="text-gray-500 leading-relaxed max-w-md font-medium">
                  Track your best-selling meals, monitor subscription trends, and make smarter decisions about your menu — all backed by real data from your customers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
              Up and running in <span className="text-orange-500">minutes.</span>
            </h2>
            <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
              No long setup. No technical headaches. Just register and start serving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: ClipboardList,
                title: "Register Your Kitchen",
                desc: "Sign up with your business details, UPI ID, and address. Verification is instant.",
              },
              {
                step: "02",
                icon: ChefHat,
                title: "List Your Meals",
                desc: "Add your daily menu with prices. Update it anytime — changes go live immediately.",
              },
              {
                step: "03",
                icon: Wallet,
                title: "Receive Orders & Earn",
                desc: "Customers subscribe to your tiffin. Payments land directly in your UPI account.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black text-gray-100 group-hover:text-orange-100 transition-colors select-none">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Developer Section ── */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-gray-50 border border-gray-100 p-8 md:p-12 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 hover:-rotate-3 transition-transform">
              <span className="text-4xl font-black tracking-tighter">DD</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-orange-500 uppercase mb-4">
                <span className="w-8 h-[2px] bg-orange-500 rounded-full" />
                The Developer
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">Devansh Dholiya</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-medium md:text-lg">
                Full-stack developer building modern, scalable web applications. MyMeal's vendor platform was designed to give kitchen owners a professional-grade tool that's just as powerful as it is simple to use.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://github.com/DEVANSHDHOLIYA"
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/devansh-dholiya-274017249/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <footer className="pt-32 pb-12 px-6 bg-white border-t border-gray-100 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">
          Ready to serve?
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg md:text-xl font-medium">
          Join the growing network of tiffin vendors using MyMeal to manage subscriptions and grow their business.
        </p>
        <button
          onClick={() => navigate("/vendor/signup")}
          className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:scale-105 transition-all active:scale-95"
        >
          Register Your Kitchen
        </button>

        <div className="mt-32 pt-8 border-t border-gray-100 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400 font-medium">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="w-8 h-6 grayscale opacity-50" />
            <span className="text-gray-500 font-bold text-base">MyMeal · Vendor</span>
          </div>
          <p>© {new Date().getFullYear()} MyMeal. Built for modern kitchens.</p>
        </div>
      </footer>

    </div>
  );
}