import React from 'react';
export function MortgageBanner() {
  return <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        {/* Background Image */}
        <img src="/image_6.png" alt="Woman sitting on porch with dog" className="absolute inset-0 w-full h-full object-cover object-center" />

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent w-full md:w-2/3"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-xl">
          <h2 className="text-[40px] font-normal text-[#2D2D2D] mb-4 leading-tight">
            A home of your own
          </h2>
          <p className="text-xl text-[#2D2D2D] mb-8">
            With low down payment options on a fixed-rate mortgage
          </p>
          <div>
            <button className="bg-white border border-[#2D2D2D] text-[#2D2D2D] px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>;
}