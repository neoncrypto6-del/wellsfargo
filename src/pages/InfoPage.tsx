import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
type InfoContent = {
  title: string;
  description: string;
  heroImage: string;
  sections: Array<{
    heading: string;
    content: string;
    image?: string;
  }>;
  features: string[];
  cta: string;
};
const INFO_CONTENT: Record<string, InfoContent> = {
  'investing-wealth-management': {
    title: 'Investing & Wealth Management',
    description:
    'Build and preserve your wealth with our comprehensive investment solutions and dedicated advisors.',
    heroImage:
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Personalized Investment Strategies',
      content:
      'Our dedicated financial advisors work closely with you to understand your goals, risk tolerance, and timeline. We create tailored investment portfolios that align with your unique financial picture.',
      image:
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Retirement Planning',
      content:
      'Whether you are just starting to save or nearing retirement, we offer comprehensive planning services to help ensure you have the resources you need for the lifestyle you want.'
    }],

    features: [
    'Dedicated Financial Advisors',
    'Retirement Planning',
    'Portfolio Management',
    'Estate Planning Services'],

    cta: 'Find an Advisor'
  },
  business: {
    title: 'Business Banking',
    description:
    "Solutions designed to help your small or mid-sized business thrive in today's economy.",
    heroImage:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Streamlined Operations',
      content:
      'Manage your cash flow efficiently with our suite of business checking, savings, and merchant services. Our digital tools make it easy to track expenses and process payments.',
      image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Financing for Growth',
      content:
      'Access the capital you need to expand your business. We offer lines of credit, term loans, and commercial real estate financing with competitive rates and flexible terms.'
    }],

    features: [
    'Business Checking & Savings',
    'Merchant Services',
    'Business Lines of Credit',
    'Payroll Solutions'],

    cta: 'Explore Business Solutions'
  },
  'commercial-banking': {
    title: 'Commercial Banking',
    description:
    'Strategic financial solutions for mid-market and large corporate enterprises.',
    heroImage:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Industry-Specific Expertise',
      content:
      'Our relationship managers specialize in various industries, bringing deep sector knowledge to help you navigate complex financial challenges and capitalize on opportunities.',
      image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Treasury Management',
      content:
      'Optimize your working capital with our advanced treasury management solutions. We provide robust tools for receivables, payables, and liquidity management.'
    }],

    features: [
    'Treasury Management',
    'Commercial Financing',
    'International Banking',
    'Industry Expertise'],

    cta: 'Contact Commercial Banking'
  },
  'corporate-investment-banking': {
    title: 'Corporate & Investment Banking',
    description:
    'Capital markets and advisory services for corporate, government, and institutional clients.',
    heroImage:
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Strategic Advisory',
      content:
      'We provide expert guidance on mergers, acquisitions, divestitures, and restructuring. Our global network and deep industry insights help you execute complex transactions successfully.',
      image:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Capital Raising',
      content:
      'Access global capital markets through our comprehensive debt and equity underwriting services. We help structure and execute optimal financing solutions.'
    }],

    features: [
    'Capital Raising',
    'Mergers & Acquisitions',
    'Corporate Finance',
    'Market Insights'],

    cta: 'Learn More'
  },
  'about-wells-fargo': {
    title: 'About Wells Fargo',
    description:
    'Learn about our history, our values, and our commitment to our customers and communities.',
    heroImage:
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Our Heritage',
      content:
      'Since 1852, we have been helping customers succeed financially. From the gold rush to the digital age, our commitment to service and innovation remains steadfast.',
      image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Community Impact',
      content:
      'We believe in strengthening the communities where we live and work. Through philanthropy and volunteerism, we support initiatives in housing, small business growth, and financial health.'
    }],

    features: [
    'Our History',
    'Corporate Responsibility',
    'Investor Relations',
    'Newsroom'],

    cta: 'Read Our Story'
  },
  checking: {
    title: 'Checking Accounts',
    description:
    'Find the right checking account for your everyday banking needs.',
    heroImage:
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Everyday Convenience',
      content:
      'Our checking accounts come with powerful digital tools, including mobile deposit, Zelle® for quick transfers, and customizable alerts to help you stay on top of your finances.',
      image:
      'https://images.unsplash.com/photo-1580519542036-ed47f3e42214?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Clear Access Banking',
      content:
      'A checkless account with no overdraft fees. Perfect for students and those looking for a simple, predictable way to manage their money.'
    }],

    features: [
    'Everyday Checking',
    'Clear Access Banking',
    'Premier Checking',
    'Mobile Banking Features'],

    cta: 'Compare Accounts'
  },
  'savings-cds': {
    title: 'Savings & CDs',
    description:
    'Grow your money securely with our range of savings accounts and Certificates of Deposit.',
    heroImage:
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Automated Savings',
      content:
      'Make saving effortless with Way2Save®. Set up automatic transfers from your checking account to build your savings balance steadily over time.',
      image:
      'https://images.unsplash.com/photo-1616514197671-15d99ce7a6f8?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Certificates of Deposit',
      content:
      'Lock in a guaranteed return with our CDs. Choose from a variety of terms to match your savings goals, from a few months to several years.'
    }],

    features: [
    'Way2Save® Savings',
    'Platinum Savings',
    'Standard CDs',
    'Special Rate CDs'],

    cta: 'Start Saving'
  },
  'credit-cards': {
    title: 'Credit Cards',
    description:
    'Cards that reward you for your everyday purchases, travel, and more.',
    heroImage:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Cash Back Rewards',
      content:
      'Earn unlimited cash rewards on your everyday purchases. Our Active Cash® card offers a simple, straightforward way to get more value from your spending.',
      image:
      'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Travel & Premium Cards',
      content:
      'Elevate your travel experience with premium rewards, no foreign transaction fees, and exclusive benefits designed for frequent travelers.'
    }],

    features: [
    'Cash Back Cards',
    'Travel Rewards Cards',
    '0% Intro APR Cards',
    'Build Credit Cards'],

    cta: 'Find Your Card'
  },
  'home-loans': {
    title: 'Home Loans',
    description:
    "Whether you're buying or refinancing, we have mortgage options to fit your needs.",
    heroImage:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'First-Time Homebuyers',
      content:
      'We offer specialized programs and low down payment options to help make your dream of homeownership a reality. Our mortgage consultants will guide you through every step.',
      image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Refinancing Options',
      content:
      'Lower your monthly payments, shorten your loan term, or tap into your home equity. We can help you find the right refinancing solution for your current financial situation.'
    }],

    features: [
    'Fixed-Rate Mortgages',
    'Adjustable-Rate Mortgages',
    'Jumbo Loans',
    'FHA & VA Loans'],

    cta: 'Check Mortgage Rates'
  },
  'personal-loans': {
    title: 'Personal Loans',
    description:
    'Flexible funding for home improvements, debt consolidation, or major purchases.',
    heroImage:
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Debt Consolidation',
      content:
      'Simplify your finances by combining multiple high-interest debts into a single, predictable monthly payment with a competitive fixed rate.',
      image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Quick Funding',
      content:
      'Apply online in minutes and, if approved, you could receive your funds as soon as the same or next business day.'
    }],

    features: [
    'Competitive Rates',
    'No Origination Fees',
    'Flexible Terms',
    'Quick Funding'],

    cta: 'Check Your Rate'
  },
  'auto-loans': {
    title: 'Auto Loans',
    description:
    'Financing for your next new or used vehicle, or refinance your current auto loan.',
    heroImage:
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Dealer Financing',
      content:
      'We partner with thousands of dealerships nationwide. Ask for Wells Fargo financing at the dealership for a seamless buying experience.',
      image:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Auto Refinancing',
      content:
      'You might be able to lower your monthly payment or reduce your interest rate by refinancing your current auto loan from another lender with us.'
    }],

    features: [
    'New Car Loans',
    'Used Car Loans',
    'Auto Refinancing',
    'Dealer Network'],

    cta: 'Apply for Auto Loan'
  },
  premier: {
    title: 'Wells Fargo Premier',
    description:
    'Elevated banking and wealth management for our most valued clients.',
    heroImage:
    'https://images.unsplash.com/photo-1565374391015-af898315e2ce?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Dedicated Support',
      content:
      'Enjoy priority service and access to a dedicated Premier team who understands your complex financial needs and provides personalized guidance.',
      image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Exclusive Benefits',
      content:
      'Receive fee waivers on everyday banking services, premium rewards on select credit cards, and exclusive insights from our investment strategy teams.'
    }],

    features: [
    'Dedicated Premier Team',
    'Fee Waivers',
    'Premium Rewards',
    'Exclusive Insights'],

    cta: 'Discover Premier'
  },
  'education-tools': {
    title: 'Education & Tools',
    description:
    'Resources to help you make informed financial decisions and reach your goals.',
    heroImage:
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Financial Health',
      content:
      'Explore our library of articles, videos, and interactive tools designed to help you build credit, manage debt, and improve your overall financial well-being.',
      image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Planning Calculators',
      content:
      'Use our calculators to estimate mortgage payments, plan for retirement, or see how long it will take to reach your savings goals.'
    }],

    features: [
    'Financial Health Tools',
    'Retirement Calculators',
    'Budgeting Worksheets',
    'Security Center'],

    cta: 'Explore Resources'
  },
  'atms-locations': {
    title: 'ATMs & Locations',
    description: 'Find a Wells Fargo branch or ATM near you.',
    heroImage:
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Extensive Network',
      content:
      'With thousands of branches and ATMs nationwide, you are never far from your money. Many of our ATMs offer envelope-free deposits and multiple denomination options.',
      image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Branch Services',
      content:
      'Schedule an appointment online to meet with a banker for complex transactions, account openings, or financial guidance.'
    }],

    features: [
    'Branch Locator',
    'ATM Locator',
    'Make an Appointment',
    'Branch Services'],

    cta: 'Find a Location'
  },
  help: {
    title: 'Help & Support',
    description: 'Get answers to your questions and support for your accounts.',
    heroImage:
    'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: '24/7 Customer Service',
      content:
      'Our support team is available around the clock to assist you with account inquiries, technical support, and urgent issues like lost or stolen cards.',
      image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Security Center',
      content:
      'Learn how to protect yourself from fraud and identity theft. Report suspicious activity immediately through our dedicated security channels.'
    }],

    features: ['Contact Us', 'FAQs', 'Report Fraud', 'Routing Numbers'],
    cta: 'Get Help'
  },
  espanol: {
    title: 'Wells Fargo en Español',
    description: 'Información y servicios bancarios en español.',
    heroImage:
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Servicios Bancarios',
      content:
      'Ofrecemos una amplia gama de productos y servicios financieros diseñados para satisfacer sus necesidades, con atención al cliente disponible en español.',
      image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
      heading: 'Educación Financiera',
      content:
      'Acceda a recursos y herramientas educativas en español para ayudarle a tomar decisiones financieras informadas y alcanzar sus metas.'
    }],

    features: [
    'Cuentas de Cheques',
    'Tarjetas de Crédito',
    'Préstamos',
    'Servicio al Cliente'],

    cta: 'Continuar en Español'
  },
  search: {
    title: 'Search',
    description: "Find what you're looking for across Wells Fargo.",
    heroImage:
    'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?auto=format&fit=crop&q=80&w=1200',
    sections: [
    {
      heading: 'Quick Answers',
      content:
      'Use our powerful search tool to quickly find information about accounts, rates, locations, and help topics.',
      image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    }],

    features: [
    'Search Accounts',
    'Search Help Topics',
    'Search Locations',
    'Search Rates'],

    cta: 'Start Searching'
  }
};
export function InfoPage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const content = INFO_CONTENT[slug || ''];
  if (!content) {
    return (
      <AuthLayout title="Page Not Found">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Page Not Found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-[#D71E28] hover:underline">
            
            Return to Home
          </button>
        </div>
      </AuthLayout>);

  }
  return (
    <AuthLayout title={content.title}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 md:h-80 w-full relative">
            <img
              src={content.heroImage}
              alt={content.title}
              className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-12">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {content.description}
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Sections */}
            <div className="space-y-12 mb-12">
              {content.sections.map((section, idx) =>
              <div
                key={idx}
                className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                      {section.heading}
                    </h2>
                    <p className="text-[#666] leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                  {section.image &&
                <div className="flex-1 w-full">
                      <img
                    src={section.image}
                    alt={section.heading}
                    className="w-full h-64 object-cover rounded-xl shadow-sm" />
                  
                    </div>
                }
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="bg-[#F5F5F5] rounded-xl p-8 mb-12">
              <h3 className="text-xl font-bold text-[#2D2D2D] mb-6 text-center">
                Key Features & Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.features.map((feature, idx) =>
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-3">
                  
                    <CheckCircleIcon className="w-5 h-5 text-[#D71E28] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2D2D2D] font-medium">
                      {feature}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="bg-[#D71E28] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#B21B1C] transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2">
                
                {content.cta}
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>);

}