import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AuthLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}
export function AuthLayout({
  children,
  showBack = true,
  title
}: AuthLayoutProps) {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[#F5F5F5]" style={{
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  }}>
      {/* Top Red Bar */}
      <div className="bg-[#D71E28] text-white px-4 md:px-8 py-3 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80">
          <span className="text-2xl font-bold tracking-wider" style={{
          fontFamily: 'Georgia, serif'
        }}>
            WELLS FARGO
          </span>
        </button>
        {title && <span className="text-sm font-medium hidden md:block">{title}</span>}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {showBack && <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#2D2D2D] hover:text-[#D71E28] mb-6 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>}
        {children}
      </div>
    </div>;
}