import React from 'react';
export function AskFargo() {
  return <section className="bg-[#4A443E] w-full py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        {/* Left: Phone Image */}
        <div className="relative w-[280px] flex-shrink-0">
          <img src="/image_7.png" alt="Wells Fargo app showing spending insights" className="w-full object-contain" />
        </div>

        {/* Right: Content */}
        <div className="max-w-xl text-white">
          <h2 className="text-[40px] font-bold mb-6 leading-tight">
            Need help? Ask Fargo®
          </h2>
          <p className="text-[22px] leading-relaxed mb-8 text-gray-100">
            Fargo¹ gives you valuable insights like a summary of your spending
            by category, retailer and across accounts. Find it only in the Wells
            Fargo Mobile® app.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {/* Fake App Store Badges */}
            <button className="bg-black border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.73 3.65 1.89-3.13 1.86-2.61 5.91.46 7.15-.69 1.66-1.57 3.05-2.78 3.89zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-none">Download on the</div>
                <div className="text-sm font-semibold leading-tight">
                  App Store
                </div>
              </div>
            </button>
            <button className="bg-black border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-900 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.98 1.98 0 0 1-.514-1.29V3.104c0-.496.182-.95.513-1.29zM14.92 13.128l2.67 2.67-12.26 7.08a1.96 1.96 0 0 1-1.02.26l10.61-10.01zm0-2.256L4.31.862a1.96 1.96 0 0 1 1.02.26l12.26 7.08-2.67 2.67zm1.13 1.13l3.22 3.22a1.98 1.98 0 0 1 0 2.8l-3.22 3.22-3.8-3.8 3.8-3.8z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-none">GET IT ON</div>
                <div className="text-sm font-semibold leading-tight">
                  Google Play
                </div>
              </div>
            </button>
          </div>

          <p className="text-xs text-gray-400">*Screen image is simulated</p>
        </div>
      </div>
    </section>;
}