import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRightIcon } from 'lucide-react';
const FEATURES: Record<string, {
  title: string;
  image: string;
  description: string;
  details: string[];
}> = {
  '1': {
    title: 'New customer? Say hello to a $125 bonus',
    image: "/image_1.png",
    description: 'Open a Clear Access Banking account, great for students & more, and complete offer requirements to earn a $125 bonus.',
    details: ['Open a new Clear Access Banking account online or in a branch', 'Receive qualifying direct deposits totaling $500 or more within 90 days', 'Maintain a minimum daily balance of $25 for 90 days', 'Bonus will be deposited within 30 days of meeting all requirements', 'Available to new Wells Fargo checking customers only']
  },
  '2': {
    title: 'Earn 60,000 bonus points',
    image: "/image_2.png",
    description: 'When you spend $4,000 in purchases in the first 3 months. Terms apply.',
    details: ['Apply for the Wells Fargo Active Cash® Card', 'Earn 2% cash rewards on purchases with no category restrictions', 'Spend $4,000 in the first 3 months to earn 60,000 bonus points', '0% intro APR for 12 months on purchases and balance transfers', 'No annual fee']
  },
  '3': {
    title: 'Open a savings account',
    image: "/image_3.png",
    description: 'Explore our savings accounts and find the right fit for you.',
    details: ['Way2Save® Savings — Build your savings automatically', 'Platinum Savings — Earn a higher interest rate with qualifying balances', 'No minimum opening deposit required for Way2Save', 'Access your savings online, via mobile, or at any branch', 'Set up automatic transfers to grow your savings effortlessly']
  },
  '4': {
    title: 'Interest rates today',
    image: "/image_4.png",
    description: 'Check current interest rates for savings, CDs, mortgages, and more.',
    details: ['Savings account rates: Up to 4.25% APY', 'CD rates: Up to 4.75% APY for 12-month terms', 'Mortgage rates: Starting from 6.5% for 30-year fixed', 'Auto loan rates: Starting from 5.49% APR', 'Rates are subject to change and may vary by region']
  }
};
export function FeaturePage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const feature = FEATURES[id || ''];
  if (!feature) {
    return <AuthLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Feature not found
          </h1>
          <button onClick={() => navigate('/')} className="text-[#D71E28] hover:underline">
            Return to home
          </button>
        </div>
      </AuthLayout>;
  }
  return <AuthLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-center py-8 bg-[#F5F5F5]">
            <img src={feature.image} alt={feature.title} className="h-48 object-contain" />
          </div>
          <div className="p-8 md:p-10">
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-4">
              {feature.title}
            </h1>
            <p className="text-lg text-[#666] mb-8">{feature.description}</p>

            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">
              Key Details
            </h2>
            <ul className="space-y-3 mb-8">
              {feature.details.map((detail, i) => <li key={i} className="flex items-start gap-3">
                  <ArrowRightIcon className="w-4 h-4 text-[#D71E28] mt-1 flex-shrink-0" />
                  <span className="text-[#2D2D2D]">{detail}</span>
                </li>)}
            </ul>

            <button onClick={() => navigate('/enroll')} className="bg-[#D71E28] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>;
}