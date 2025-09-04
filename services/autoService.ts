import type { Car, Currency } from '../types';

const FEED_URL = 'https://autos.autocrm.ru/api/auto-ru/feed?id=jtEjHMTcfwjkVwRngrnbRw%3D%3D&isUsed=0';
// Using a more reliable CORS proxy to prevent recurring data fetching errors.
const PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(FEED_URL)}`;


const getSafeTextContent = (element: Element, tagName: string): string => {
  return element.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
};

const getPriceInfo = (priceStr: string): { value: number; currency: Currency } => {
  const value = parseInt(priceStr, 10) || 0;
  // If price is 6 digits or less, it's EUR. 7 or more, it's RUB.
  const currency: Currency = priceStr.length > 6 ? 'RUB' : 'EUR';
  return { value, currency };
};

export const fetchAndParseCars = async (): Promise<Car[]> => {
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
    }).filter(car => car.id); // Ensure cars with no ID are filtered out
  } catch (error) {
    console.error("Error in fetchAndParseCars:", error);
    throw new Error("Could not retrieve or process car data. Please check the network connection and feed format.");
  }
};