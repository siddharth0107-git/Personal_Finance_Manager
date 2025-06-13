import React from 'react';
import { NavItem } from '../types';

interface NavigationProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (label: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ items, isOpen, onClose, onItemClick }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="space-y-6">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => onItemClick(item.label)}
                className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;