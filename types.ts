
export type Currency = 'RUB' | 'EUR';

export interface Car {
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

// Add Telegram Web App types for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        openTelegramLink: (url: string) => void;
        // Add other properties and methods you might use
      };
    };
  }
}