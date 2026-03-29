import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube, Twitter, BoxIcon } from 'lucide-react';
export function Footer() {
  return <footer className="bg-[#F5F5F5] pt-8 pb-16 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Top Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#2D2D2D] mb-8">
          <a href="#" className="hover:underline">
            Privacy, Cookies, Security & Legal
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Do Not Sell or Share My Personal Information
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Notice of Data Collection
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            General Terms of Use
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Online Access Agreement
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Report Fraud
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            About Wells Fargo
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Careers
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Inclusion and Accessibility
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="hover:underline">
            Sitemap
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mb-8">
          <a href="#" aria-label="Facebook" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" aria-label="Instagram" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" aria-label="BoxIcon" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <div className="w-5 h-5" />
          </a>
          <a href="#" aria-label="YouTube" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" aria-label="X (Twitter)" className="text-[#2D2D2D] hover:text-[#D71E28]">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Investment Warning Box */}
        <div className="border border-gray-300 bg-[#F9F9F9] p-4 mb-8 max-w-3xl">
          <h4 className="font-bold text-sm text-[#2D2D2D] mb-2">
            Investment and Insurance Products are:
          </h4>
          <ul className="list-disc pl-5 text-sm text-[#2D2D2D] space-y-1 font-bold">
            <li>Not Insured by the FDIC or Any Federal Government Agency</li>
            <li>
              Not a Deposit or Other Obligation of, or Guaranteed by, the Bank
              or Any Bank Affiliate
            </li>
            <li>
              Subject to Investment Risks, Including Possible Loss of the
              Principal Amount Invested
            </li>
          </ul>
        </div>

        {/* Fine Print */}
        <div className="text-[11px] text-[#666666] space-y-4 leading-relaxed max-w-5xl">
          <p>
            Investment products and services are offered through Wells Fargo
            Advisors. Wells Fargo Advisors is a trade name used by Wells Fargo
            Clearing Services, LLC (WFCS) and Wells Fargo Advisors Financial
            Network, LLC, Members{' '}
            <a href="#" className="underline">
              SIPC
            </a>
            , separate registered broker-dealers and non-bank affiliates of
            Wells Fargo & Company.
          </p>
          <p>
            1. Availability may be affected by your mobile carrier's coverage
            area. Your mobile carrier's message and data rates may apply. Fargo
            is only available on the smartphone versions of the Wells Fargo
            Mobile® app.
          </p>
          <p>
            Android, Google Play, Chrome, Pixel and other marks are trademarks
            of Google LLC.
          </p>
          <p>
            Apple, the Apple logo, Apple Pay, Apple Watch, Face ID, iCloud
            Keychain, iPad, iPad Pro, iPhone, iTunes, Mac, Safari, and Touch ID
            are trademarks of Apple Inc., registered in the U.S. and other
            countries. Apple Wallet is a trademark of Apple Inc. App Store is a
            service mark of Apple Inc.
          </p>
          <p>Deposit products offered by Wells Fargo Bank, N.A. Member FDIC.</p>

          <div className="flex items-center pt-2">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.8l5 4.5v7.7H7v-7.7l5-4.5z" />
            </svg>
            <span className="font-bold">Equal Housing Lender</span>
          </div>

          <p>PM-09282026-7798034.1.1</p>
          <p>LRC-0325</p>
          <p>© 1999 - 2026 Wells Fargo. NMLSR ID 399801</p>
        </div>
      </div>
    </footer>;
}