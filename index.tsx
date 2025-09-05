import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- START OF TYPES ---
type Currency = 'RUB' | 'EUR';

interface Car {
  id: string;
  name: string;
  brand: string;
  color: string;
  availability: string;
  year: number;
  price: number;
  priceCurrency: Currency;
  discountPrice?: number;
  discountPriceCurrency?: Currency;
  images: string[];
  engineVolume?: string;
  enginePower?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        openTelegramLink: (url: string) => void;
      };
    };
  }
}
// --- END OF TYPES ---


// --- START OF ICONS ---
const Logo: React.FC = () => (
<svg width="99" height="27" viewBox="0 0 99 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_117_213)">
<path d="M72.67 3.82V0H51.52V3.82H60.44V18.13H64.25V3.82H72.67Z" fill="currentColor"/>
<path d="M98.4298 18.13V14.32H81.0898V10.97H90.4598V7.56H81.0898V3.82H98.4298V0H77.2798V18.13H98.4298Z" fill="currentColor"/>
<path d="M21.15 18.13V7.61H7.97V10.97H17.34V14.77H3.82V3.82H21.15V0H0V18.13H21.15Z" fill="currentColor"/>
<path d="M29.5698 18.13V10.97H43.0898V18.13H46.9098V0H25.7598V18.13H29.5798H29.5698ZM29.5698 7.56V3.81H43.0898V7.56H29.5698Z" fill="currentColor"/>
<path d="M62.09 24.8401H0V25.5501H62.09V24.8401Z" fill="currentColor"/>
<path d="M68.5902 24.03H68.5802C68.3102 23.66 67.9602 23.48 67.5302 23.48C67.0602 23.48 66.6802 23.64 66.3902 23.95C66.1002 24.27 65.9502 24.66 65.9502 25.14C65.9502 25.62 66.1002 26.02 66.3902 26.34C66.6802 26.66 67.0702 26.81 67.5302 26.81C67.9502 26.81 68.3002 26.62 68.5802 26.25H68.5902V26.71H69.3602V23.56H68.5902V24.02V24.03ZM68.3302 25.83C68.1602 26.02 67.9402 26.11 67.6702 26.11C67.4002 26.11 67.1902 26.02 67.0102 25.83C66.8402 25.64 66.7502 25.41 66.7502 25.15C66.7502 24.89 66.8402 24.67 67.0102 24.47C67.1802 24.28 67.4002 24.19 67.6702 24.19C67.9402 24.19 68.1502 24.28 68.3302 24.47C68.5002 24.66 68.5902 24.89 68.5902 25.15C68.5902 25.41 68.5002 25.64 68.3302 25.83Z" fill="currentColor"/>
<path d="M72.1703 25.4101C72.1703 25.6101 72.1003 25.7701 71.9703 25.9101C71.8403 26.0401 71.6703 26.1101 71.4803 26.1101C71.2903 26.1101 71.1303 26.0401 71.0003 25.9101C70.8703 25.7801 70.8003 25.6101 70.8003 25.4101V23.5701H70.0303V25.4801C70.0303 25.8701 70.1403 26.2001 70.3703 26.4501C70.6003 26.7001 70.8903 26.8201 71.2603 26.8201C71.4803 26.8201 71.6803 26.7701 71.8503 26.6701C72.0203 26.5701 72.1503 26.4401 72.2403 26.2701H72.2503V26.7201H72.9603V23.5701H72.1903V25.4101H72.1703Z" fill="currentColor"/>
<path d="M74.4702 22.8601H73.7001V23.5701H73.4102V24.1701H73.7001V25.7901C73.7001 26.0701 73.7902 26.3001 73.9602 26.4701C74.1402 26.6401 74.3702 26.7201 74.6502 26.7201H75.0002V26.0301H74.6502C74.6002 26.0301 74.5601 26.0101 74.5201 25.9801C74.4801 25.9401 74.4702 25.9001 74.4702 25.8401V24.1601H75.0102V23.5601H74.4702V22.8501V22.8601Z" fill="currentColor"/>
<path d="M76.98 23.48C76.5 23.48 76.09 23.64 75.75 23.96C75.42 24.28 75.25 24.68 75.25 25.15C75.25 25.62 75.42 26.02 75.75 26.34C76.08 26.66 76.49 26.82 76.98 26.82C77.47 26.82 77.87 26.66 78.21 26.34C78.54 26.02 78.71 25.62 78.71 25.15C78.71 24.68 78.54 24.29 78.21 23.96C77.88 23.64 77.47 23.48 76.98 23.48ZM77.65 25.86C77.48 26.04 77.26 26.13 76.98 26.13C76.7 26.13 76.48 26.04 76.31 25.85C76.14 25.67 76.06 25.43 76.06 25.14C76.06 24.85 76.14 24.62 76.31 24.44C76.48 24.25 76.7 24.16 76.98 24.16C77.26 24.16 77.48 24.25 77.65 24.44C77.82 24.62 77.9 24.85 77.9 25.14C77.9 25.43 77.82 25.67 77.65 25.85V25.86Z" fill="currentColor"/>
<path d="M82.6403 23.48C82.4603 23.48 82.2903 23.53 82.1103 23.63C81.9403 23.73 81.7903 23.86 81.6803 24.02C81.4503 23.66 81.1603 23.48 80.8003 23.48C80.4403 23.48 80.1803 23.65 79.9803 24H79.9703V23.57H79.2603V26.72H80.0303V24.74C80.0303 24.58 80.0803 24.45 80.1903 24.35C80.3003 24.24 80.4303 24.19 80.5803 24.19C80.7303 24.19 80.8703 24.24 80.9703 24.35C81.0803 24.46 81.1302 24.59 81.1302 24.74V26.72H81.9003V24.74C81.9003 24.58 81.9502 24.45 82.0602 24.35C82.1702 24.24 82.3002 24.19 82.4502 24.19C82.6002 24.19 82.7402 24.24 82.8402 24.35C82.9502 24.46 83.0003 24.59 83.0003 24.74V26.72H83.7702V24.77C83.7702 24.38 83.6703 24.07 83.4703 23.83C83.2703 23.59 82.9903 23.47 82.6403 23.47V23.48Z" fill="currentColor"/>
<path d="M86.0401 23.48C85.5601 23.48 85.1501 23.64 84.8101 23.96C84.4801 24.28 84.3101 24.68 84.3101 25.15C84.3101 25.62 84.4801 26.02 84.8101 26.34C85.1401 26.66 85.5501 26.82 86.0401 26.82C86.5301 26.82 86.9301 26.66 87.2701 26.34C87.6001 26.02 87.7701 25.62 87.7701 25.15C87.7701 24.68 87.6001 24.29 87.2701 23.96C86.9401 23.64 86.5301 23.48 86.0401 23.48ZM86.7101 25.86C86.5401 26.04 86.3201 26.13 86.0401 26.13C85.7601 26.13 85.5401 26.04 85.3701 25.85C85.2001 25.67 85.1201 25.43 85.1201 25.14C85.1201 24.85 85.2001 24.62 85.3701 24.44C85.5401 24.25 85.7601 24.16 86.0401 24.16C86.3201 24.16 86.5401 24.25 86.7101 24.44C86.8801 24.62 86.9601 24.85 86.9601 25.14C86.9601 25.43 86.8801 25.67 86.7101 25.85V25.86Z" fill="currentColor"/>
<path d="M90.1401 23.4801C89.7101 23.4801 89.3601 23.6601 89.0901 24.0301H89.0801V22.6401H88.3101V26.7201H89.0801V26.2601H89.0901C89.3701 26.6301 89.7201 26.8201 90.1401 26.8201C90.6101 26.8201 90.9901 26.6601 91.2801 26.3501C91.5701 26.0301 91.7201 25.6301 91.7201 25.1501C91.7201 24.6701 91.5701 24.2701 91.2801 23.9601C90.9901 23.6401 90.6001 23.4901 90.1401 23.4901V23.4801ZM90.6601 25.8301C90.4901 26.0201 90.2701 26.1101 90.0001 26.1101C89.7301 26.1101 89.5201 26.0201 89.3401 25.8301C89.1701 25.6401 89.0801 25.4101 89.0801 25.1501C89.0801 24.8901 89.1701 24.6701 89.3401 24.4701C89.5101 24.2801 89.7301 24.1901 90.0001 24.1901C90.2701 24.1901 90.4801 24.2801 90.6601 24.4701C90.8301 24.6601 90.9201 24.8901 90.9201 25.1501C90.9201 25.4101 90.8301 25.6401 90.6601 25.8301Z" fill="currentColor"/>
<path d="M92.66 22.55C92.54 22.55 92.44 22.59 92.36 22.68C92.27 22.76 92.23 22.86 92.23 22.98C92.23 23.1 92.27 23.2001 92.36 23.2801C92.44 23.3601 92.55 23.4 92.66 23.4C92.77 23.4 92.88 23.3601 92.96 23.2801C93.04 23.2001 93.09 23.1 93.09 22.98C93.09 22.86 93.05 22.76 92.96 22.68C92.87 22.6 92.77 22.55 92.66 22.55Z" fill="currentColor"/>
<path d="M93.04 23.5701H92.27V26.7201H93.04V23.5701Z" fill="currentColor"/>
<path d="M94.4702 22.6401H93.7002V26.7201H94.4702V22.6401Z" fill="currentColor"/>
<path d="M98.4303 25.15C98.4303 24.68 98.2603 24.29 97.9303 23.97C97.6003 23.65 97.2003 23.49 96.7303 23.49C96.2603 23.49 95.8403 23.65 95.5103 23.97C95.1803 24.29 95.0103 24.69 95.0103 25.16C95.0103 25.63 95.1803 26.03 95.5103 26.35C95.8403 26.67 96.2503 26.83 96.7203 26.83C97.0803 26.83 97.3902 26.74 97.6702 26.55C97.9502 26.36 98.1503 26.11 98.2603 25.79H97.4202C97.3502 25.9 97.2502 25.99 97.1302 26.06C97.0002 26.13 96.8703 26.16 96.7203 26.16C96.5103 26.16 96.3203 26.1 96.1503 25.97C95.9903 25.84 95.8802 25.69 95.8402 25.51H98.3802C98.4102 25.38 98.4202 25.26 98.4202 25.16L98.4303 25.15ZM95.8603 24.83C95.9003 24.63 96.0103 24.46 96.1603 24.33C96.3203 24.2 96.5102 24.13 96.7402 24.13C96.9702 24.13 97.1502 24.2 97.3102 24.33C97.4702 24.46 97.5603 24.63 97.6103 24.83H95.8603Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_117_213">
<rect width="98.43" height="26.82" fill="white"/>
</clipPath>
</defs>
</svg>
);

const TelegramIcon: React.FC = () => (
<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800 hover:text-black transition-colors">
<g clipPath="url(#clip0_1_2125)">
<path d="M2.32955 7.83223C8.77692 5.12482 17.1203 1.82391 18.272 1.36705C21.293 0.17126 22.22 0.400427 21.7579 3.0486C21.4258 4.95196 20.4682 11.2536 19.7048 15.176C19.2518 17.5019 18.2355 17.7776 16.6375 16.7712C15.8691 16.287 11.9903 13.8386 11.1485 13.2637C10.38 12.7398 9.32018 12.1096 10.6494 10.8682C11.1223 10.4261 14.2229 7.60013 16.6386 5.40051C16.9551 5.11159 16.5575 4.6371 16.1923 4.86871C12.9363 6.92976 8.42192 9.79045 7.84736 10.1631C6.97936 10.7257 6.14575 10.9838 4.64933 10.5734C3.51868 10.2635 2.41419 9.89377 1.98431 9.75275C0.328855 9.21018 0.721813 8.5075 2.32955 7.83223Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1_2125">
<rect width="22" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
);

const PhoneIcon: React.FC = () => (
  <svg viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 hover:text-black transition-colors">
    <path d="M12.2279 13.1233C11.9232 12.0998 10.2993 10.6717 10.2993 10.6717C9.93047 10.3551 9.43122 10.2271 9.10449 10.5928C9.10449 10.5928 8.35417 11.1726 8.17989 11.2426C7.38382 11.5617 6.74111 11.4133 6.22397 10.6463L5.02213 8.8637L3.8203 7.08112C3.30315 6.31409 3.41906 5.68114 4.03671 5.09735C4.17204 4.9696 5.01716 4.53039 5.01716 4.53039C5.4919 4.38379 5.56993 3.88746 5.41827 3.43213C5.41827 3.43213 4.71854 1.41373 3.87514 0.734332C3.51635 0.445249 3.00598 0.417944 2.61678 0.666528L1.80802 1.18309C-0.75765 2.8218 -0.209371 5.36773 1.47429 7.86496L3.01304 10.1472L4.55179 12.4295C6.23545 14.9268 8.41689 16.4296 10.9826 14.7909L11.7913 14.2743C12.1807 14.025 12.3577 13.5583 12.2279 13.1233Z" fill="currentColor"/>
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertTriangleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ArrowUpRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

const ChevronLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const FilterIcon: React.FC = () => (
<svg width="23" height="14" viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500">
<rect y="2" width="14" height="3" rx="1.5" fill="currentColor"/>
<rect x="17" y="2" width="6" height="3" rx="1.5" fill="currentColor"/>
<circle cx="15.5" cy="3.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
<rect x="23" y="12" width="14" height="3" rx="1.5" transform="rotate(-180 23 12)" fill="currentColor"/>
<rect x="6" y="12" width="6" height="3" rx="1.5" transform="rotate(-180 6 12)" fill="currentColor"/>
<circle cx="7.5" cy="10.5" r="2.5" transform="rotate(-180 7.5 10.5)" stroke="currentColor" strokeWidth="2"/>
</svg>
);

const ArrowUpDownIcon: React.FC = () => (
<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500">
<path d="M4.14282 1V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.28571 8.85715L4.14286 12L1 8.85715" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.2144 12L11.2144 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8.07146 4.14285L11.2143 0.999995L14.3572 4.14285" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
);
// --- END OF ICONS ---


// --- START OF SERVICES ---
const FEED_URL = 'https://autos.autocrm.ru/api/auto-ru/feed?id=jtEjHMTcfwjkVwRngrnbRw%3D%3D&isUsed=0';
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`;

const getSafeTextContent = (element: Element, tagName: string): string => {
  return element.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
};

const getPriceInfo = (priceStr: string): { value: number; currency: Currency } => {
  const value = parseInt(priceStr, 10) || 0;
  const currency: Currency = priceStr.length > 6 ? 'RUB' : 'EUR';
  return { value, currency };
};

const fetchAndParseCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(PROXY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('Failed to parse XML feed.');
    }
    const carNodes = Array.from(xmlDoc.getElementsByTagName('car'));
    return carNodes.map(node => {
      const priceStr = getSafeTextContent(node, 'price');
      const discountPriceStr = getSafeTextContent(node, 'discount_price');
      const brand = getSafeTextContent(node, 'mark_id');
      const model = getSafeTextContent(node, 'folder_id');
      const complectation = getSafeTextContent(node, 'complectation_name');
      let carName = `${brand} ${model}`;
      if (complectation) {
        carName += ` ${complectation}`;
      }
      const car: Car = {
        id: getSafeTextContent(node, 'unique_id'),
        name: carName,
        brand: brand,
        color: getSafeTextContent(node, 'color'),
        availability: getSafeTextContent(node, 'availability'),
        year: parseInt(getSafeTextContent(node, 'year'), 10) || new Date().getFullYear(),
        price: getPriceInfo(priceStr).value,
        priceCurrency: getPriceInfo(priceStr).currency,
        images: Array.from(node.getElementsByTagName('image')).map(img => img.textContent ?? '').filter(Boolean),
        engineVolume: getSafeTextContent(node, 'engine_volume'),
        enginePower: getSafeTextContent(node, 'engine_power'),
      };
      if (discountPriceStr) {
        const discountInfo = getPriceInfo(discountPriceStr);
        car.discountPrice = discountInfo.value;
        car.discountPriceCurrency = discountInfo.currency;
      }
      return car;
    }).filter(car => car.id);
  } catch (error) {
    console.error("Error in fetchAndParseCars:", error);
    throw new Error("Не удалось загрузить данные об автомобилях. Пожалуйста, проверьте ваше интернет-соединение и попробуйте еще раз.");
  }
};
// --- END OF SERVICES ---


// --- START OF COMPONENTS ---
const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  );
};

const ErrorMessage: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-10 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <AlertTriangleIcon />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">Что-то пошло не так</h3>
      <p className="mt-2 text-sm text-gray-500 px-4">{message}</p>
      <div className="mt-6">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

const FilterPills: React.FC<{ options: string[]; activeFilter: string; onFilterChange: (filter: string) => void; }> = ({ options, activeFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {options.map(option => (
        <button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black ${
            activeFilter === option
              ? 'bg-black text-white border-black shadow'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const CarCard: React.FC<{ car: Car; }> = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasDiscount = car.discountPrice && car.discountPrice > 0;
  const displayPrice = hasDiscount ? car.discountPrice! : car.price;
  const displayCurrency = hasDiscount ? car.discountPriceCurrency! : car.priceCurrency;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

const Footer: React.FC = () => (
  <footer className="text-center py-6 mt-12 border-t border-gray-200">
    <p className="text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Gate Automobile. Все права защищены ©
    </p>
  </footer>
);
// --- END OF COMPONENTS ---


// --- START OF APP ---
type SortOrder = 'default' | 'price-asc' | 'price-desc';

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeAvailability, setActiveAvailability] = useState<string>('Все');
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('Все бренды');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCars = await fetchAndParseCars();
      setCars(fetchedCars);
      const uniqueBrands = ['Все бренды', ...Array.from(new Set(fetchedCars.map(car => car.brand)))];
      setBrands(uniqueBrands);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const availabilityOptions = useMemo(() => ['Все', ...Array.from(new Set(cars.map(c => c.availability)))], [cars]);

  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars;

    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeAvailability !== 'Все') {
      filtered = filtered.filter(car => car.availability === activeAvailability);
    }

    if (selectedBrand !== 'Все бренды') {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'default':
      default:
        break;
    }

    return filtered;
  }, [cars, searchTerm, activeAvailability, selectedBrand, sortOrder]);

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorMessage message={error} onRetry={loadCars} />;
    }
    if (filteredAndSortedCars.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            Автомобили не найдены
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6">
        {filteredAndSortedCars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <header className="flex justify-between items-center mb-6">
          <Logo />
          <div className="flex items-center space-x-4">
            <a href="https://t.me/gateauto" target="_blank" rel="noopener noreferrer" aria-label="Telegram канал">
              <TelegramIcon />
            </a>
            <a href="tel:+74993020609" aria-label="Позвонить">
              <PhoneIcon />
            </a>
          </div>
        </header>

        <main>
          <div className="mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Каталог автомобилей</h1>
          </div>
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-12 py-2 text-base bg-white rounded-full border border-gray-200 focus:ring-2 focus:ring-black focus:border-black outline-none transition-shadow"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
                aria-label="Очистить поиск"
              >
                <XIcon />
              </button>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <FilterPills options={availabilityOptions} activeFilter={activeAvailability} onFilterChange={setActiveAvailability} />
            <div className="flex flex-wrap gap-4 items-center sm:justify-start">
              <div className="relative">
                <select 
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none bg-transparent py-2 pl-10 pr-4 text-gray-700 font-medium cursor-pointer focus:outline-none"
                  aria-label="Фильтр по бренду"
                >
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon />
                </div>
              </div>

              <div className="relative">
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="appearance-none bg-transparent py-2 pl-10 pr-4 text-gray-700 font-medium cursor-pointer focus:outline-none"
                  aria-label="Сортировка"
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Дешевле</option>
                  <option value="price-desc">Дороже</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ArrowUpDownIcon />
                </div>
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};
// --- END OF APP ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);