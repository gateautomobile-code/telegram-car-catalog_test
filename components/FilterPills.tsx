import React from 'react';

interface FilterPillsProps {
  options: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ options, activeFilter, onFilterChange }) => {
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

export default FilterPills;