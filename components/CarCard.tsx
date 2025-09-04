import React, { useState } from 'react';
import type { Car } from '../types';
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CarCardProps {
  car: Car;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasDiscount = car.discountPrice && car.discountPrice > 0;
  const displayPrice = hasDiscount ? car.discountPrice! : car.price;
  const displayCurrency = hasDiscount ? car.discountPriceCurrency! : car.priceCurrency;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % car.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Посмотрите этот автомобиль: ${car.name} - ${formatCurrency(displayPrice, displayCurrency)}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const availabilityStyles: { [key: string]: string } = {
    'В наличии': 'bg-[#21CC50] text-white',
    'В пути': 'bg-[#82B6D1] text-white',
  };
  const availabilityClass = availabilityStyles[car.availability] || 'bg-gray-100 text-gray-600';

  const showElectro = !car.engineVolume || car.engineVolume === '-';

  return (
    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col h-full group">
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900 leading-tight min-h-[3.5rem] line-clamp-2 flex-grow pr-2">{car.name}</h2>
          <button
            onClick={handleShare}
            className="bg-black text-white rounded-full p-2.5 flex-shrink-0 hover:bg-gray-800 transition-colors"
            aria-label="Поделиться"
          >
            <ArrowUpRightIcon />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">{car.year} год</p>
         <div className="flex flex-col items-start my-4">
           <div className="text-xl font-bold">
             {hasDiscount && (
                 <span className="line-through text-gray-400 text-base font-medium mr-2">
                   {formatCurrency(car.price, car.priceCurrency)}
                 </span>
               )}
               {formatCurrency(displayPrice, displayCurrency)}
           </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${availabilityClass}`}>{car.availability}</div>
              {showElectro ? (
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Электро</div>
              ) : (
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{car.engineVolume} см²</div>
              )}
              {car.enginePower && (
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{car.enginePower} л.с.</div>
              )}
            </div>
         </div>

        <div className="relative w-full aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden mt-auto">
          {car.images.length > 0 ? (
            <>
              <img
                src={car.images[currentImageIndex]}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              {car.images.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={prevImage} className="bg-black bg-opacity-40 text-white p-2 rounded-full ml-2 hover:bg-opacity-60">
                    <ChevronLeftIcon />
                  </button>
                  <button onClick={nextImage} className="bg-black bg-opacity-40 text-white p-2 rounded-full mr-2 hover:bg-opacity-60">
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">Нет фото</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
           <button className="w-full h-14 bg-black text-white text-base font-bold rounded-full hover:bg-gray-800 transition-all transform active:scale-95">
              Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;