import React from 'react';
import { Link } from 'react-router-dom';
export function PromoCards() {
  const promos = [
  {
    id: '1',
    image: "/image_1.png",

    title: 'Promo 1'
  },
  {
    id: '2',
    image: "/image_2.png",

    title: 'Promo 2'
  },
  {
    id: '3',
    image: "/image_3.png",

    title: 'Promo 3'
  },
  {
    id: '4',
    image: "/image_4.png",

    title: 'Promo 4'
  }];

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {promos.map((promo) =>
        <Link
          key={promo.id}
          to={`/feature/${promo.id}`}
          className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          
            <img
            src={promo.image}
            alt={promo.title}
            className="w-full h-auto object-cover" />
          
          </Link>
        )}
      </div>
    </section>);

}