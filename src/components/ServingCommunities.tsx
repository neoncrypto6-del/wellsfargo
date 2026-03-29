import React from 'react';
export function ServingCommunities() {
  const cards = [{
    image: "/image_8.png",
    title: 'Who we are',
    description: 'Wells Fargo helps strengthen communities through inclusion, economic empowerment, and sustainability.',
    buttonText: 'About Wells Fargo'
  }, {
    image: "/image_9.png",
    title: "Why we're committed to communities",
    description: "We don't just serve our communities—we are our communities. We're committed to helping customers and neighborhoods across the country thrive.",
    buttonText: 'Wells Fargo Stories'
  }];
  return <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <div className="w-12 h-[2px] bg-[#FFCD41] mx-auto mb-6"></div>
        <h2 className="text-[36px] font-normal text-[#2D2D2D] mb-6">
          Serving our customers and communities
        </h2>
        <p className="text-xl text-[#2D2D2D]">
          It doesn't happen with one transaction, in one day on the job, or in
          one quarter. It's earned relationship by relationship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, index) => <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="h-64 overflow-hidden">
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-4">
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