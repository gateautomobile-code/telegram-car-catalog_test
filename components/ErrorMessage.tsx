import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
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

export default ErrorMessage;