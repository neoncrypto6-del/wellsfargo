import React from 'react';
import { MapPin, Calendar, HelpCircle } from 'lucide-react';
export function HowCanWeHelp() {
  return <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 border-t border-gray-200">
      <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
        How can we help?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="#" className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
            <MapPin className="w-5 h-5 text-[#666666]" />
          </div>
          <span className="text-[#2D2D2D] font-medium group-hover:underline flex items-center">
            Find a location <span className="ml-1 text-gray-400">&gt;</span>
          </span>
        </a>

        <a href="#" className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
            <Calendar className="w-5 h-5 text-[#666666]" />
          </div>
          <span className="text-blue-700 font-medium group-hover:underline">
            Make an appointment
          </span>
        </a>

        <a href="#" className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-gray-200 transition-colors">
            <HelpCircle className="w-5 h-5 text-[#666666]" />
          </div>
          <span className="text-[#2D2D2D] font-medium group-hover:underline flex items-center">
            Quick help <span className="ml-1 text-gray-400">&gt;</span>
          </span>
        </a>
      </div>
    </section>;
}