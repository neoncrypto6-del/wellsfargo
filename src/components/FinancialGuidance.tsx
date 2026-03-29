import React from 'react';
export function FinancialGuidance() {
  const cards = [{
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600',
    title: 'Secure your next chapter',
    description: "Protect what you've built as you look ahead",
    buttonText: 'Unlock your options'
  }, {
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=600',
    title: 'Paze℠ offers added security',
    description: 'When checking out online, your actual card number is not shared with merchants',
    buttonText: 'Explore Paze'
  }, {
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&q=80&w=600',
    title: 'Your dreams, your plan',
    description: 'Start crafting the foundation for the future you see yourself in',
    buttonText: 'Get started'
  }];
  return <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12">
        <div className="w-12 h-[2px] bg-[#FFCD41] mx-auto mb-6"></div>
        <h2 className="text-[36px] font-normal text-[#2D2D2D]">
          Financial guidance and support
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="h-48 overflow-hidden">
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3">
                {card.title}
              </h3>
              <p className="text-[15px] text-[#2D2D2D] mb-8 flex-grow">
                {card.description}
              </p>
              <div>
                <button className="border border-[#2D2D2D] text-[#2D2D2D] px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm">
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </section>;
}