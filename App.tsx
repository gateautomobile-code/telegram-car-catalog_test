import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAndParseCars } from './services/autoService';
import type { Car } from './types';
import CarCard from './components/CarCard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import FilterPills from './components/FilterPills';
import { SearchIcon, XIcon, Logo, TelegramIcon, PhoneIcon, FilterIcon, ArrowUpDownIcon } from './components/Icons';

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
        // Keep original order, or could sort by ID, etc.
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
              {/* Brand Filter */}
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

              {/* Sort Order */}
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
      </div>
    </div>
  );
};

export default App;