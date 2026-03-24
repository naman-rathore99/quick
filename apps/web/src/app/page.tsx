import React from "react";

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Logo / Brand Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-600">
            QuickDidi
          </h1>
          <p className="text-sm font-medium text-blue-400 tracking-widest uppercase">
            Coming Soon
          </p>
        </div>

        {/* Hero Content */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Your Home, Perfectly Managed.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We are building the smartest way to book reliable maids for house cleaning, dishwashing, bathroom deep-cleaning, and daily cooking. 
          </p>
        </div>

      
        {/* Footer Area */}
        <div className="pt-8 border-t border-slate-100 mt-8">
          <p className="text-sm text-slate-500">
            Launching soon at <span className="font-semibold">quickdidi.com</span>
          </p>
        </div>

      </div>
    </main>
  );
}