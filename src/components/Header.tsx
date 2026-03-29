import React from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full font-sans">
      {/* Top Red Bar */}
      <div
        className="bg-[#D71E28] text-white px-4 md:px-8 py-3 flex justify-between items-center"
        style={{
          borderBottom: '4px solid #FFCD41' // ✅ clean bottom border only
        }}>
        
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold tracking-wider hover:opacity-90 transition-opacity"
            style={{
              fontFamily: 'Georgia, serif'
            }}>
            
            WELLS FARGO
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 text-sm">
          <Link
            to="/info/atms-locations"
            className="hover:underline hidden md:inline-block">
            
            ATMs/Locations
          </Link>

          <Link
            to="/info/help"
            className="hover:underline hidden md:inline-block">
            
            Help
          </Link>

          <Link
            to="/info/espanol"
            className="hover:underline hidden md:inline-block">
            
            Español
          </Link>

          <Link
            to="/info/search"
            aria-label="Search"
            className="hover:opacity-80">
            
            <Search className="w-5 h-5" />
          </Link>

          <button
            onClick={() => navigate('/login')}
            className="bg-white text-[#D71E28] font-semibold px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
            
            Sign On
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-8">
        <ul className="flex space-x-8 text-[15px] font-medium text-[#2D2D2D] overflow-x-auto whitespace-nowrap">
          <li className="py-4 border-b-4 border-[#D71E28]">
            <Link to="/" className="hover:text-[#D71E28]">
              Personal
            </Link>
          </li>

          <li className="py-4 border-b-4 border-transparent hover:border-gray-300">
            <Link
              to="/info/investing-wealth-management"
              className="hover:text-[#D71E28]">
              
              Investing & Wealth Management
            </Link>
          </li>

          <li className="py-4 border-b-4 border-transparent hover:border-gray-300">
            <Link to="/info/business" className="hover:text-[#D71E28]">
              Business
            </Link>
          </li>

          <li className="py-4 border-b-4 border-transparent hover:border-gray-300">
            <Link
              to="/info/commercial-banking"
              className="hover:text-[#D71E28]">
              
              Commercial Banking
            </Link>
          </li>

          <li className="py-4 border-b-4 border-transparent hover:border-gray-300">
            <Link
              to="/info/corporate-investment-banking"
              className="hover:text-[#D71E28]">
              
              Corporate & Investment Banking
            </Link>
          </li>

          <li className="py-4 border-b-4 border-transparent hover:border-gray-300">
            <Link to="/info/about-wells-fargo" className="hover:text-[#D71E28]">
              About Wells Fargo
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sub Navigation */}
      <nav className="bg-[#F5F5F5] px-4 md:px-8 py-3 border-b border-gray-200">
        <ul className="flex space-x-6 text-sm text-[#2D2D2D] overflow-x-auto whitespace-nowrap">
          <li>
            <Link to="/info/checking" className="hover:underline">
              Checking
            </Link>
          </li>

          <li>
            <Link to="/info/savings-cds" className="hover:underline">
              Savings & CDs
            </Link>
          </li>

          <li>
            <Link to="/info/credit-cards" className="hover:underline">
              Credit Cards
            </Link>
          </li>

          <li>
            <Link to="/info/home-loans" className="hover:underline">
              Home Loans
            </Link>
          </li>

          <li>
            <Link to="/info/personal-loans" className="hover:underline">
              Personal Loans
            </Link>
          </li>

          <li>
            <Link to="/info/auto-loans" className="hover:underline">
              Auto Loans
            </Link>
          </li>

          <li>
            <Link to="/info/premier" className="hover:underline">
              Premier
            </Link>
          </li>

          <li>
            <Link to="/info/education-tools" className="hover:underline">
              Education & Tools
            </Link>
          </li>
        </ul>
      </nav>
    </header>);

}