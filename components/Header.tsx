
import React from 'react';
import { BoltIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/60 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <BoltIcon className="h-10 w-10 text-yellow-400" />
            <h1 className="ml-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Impulse Generator Simulator
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            High Voltage Engineering Tool
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
