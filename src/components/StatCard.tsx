import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, className, subtitle }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
      <div className={`absolute inset-0 bg-gradient-to-br ${className} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <p className="text-white text-xs font-medium">{title}</p>
          <Icon className="h-5 w-5 text-white opacity-80 group-hover:scale-110 transition-transform" />
        </div>
        <p className="mt-2 text-lg font-bold text-white group-hover:scale-105 transition-transform">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-white/80">{subtitle}</p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 group-hover:bg-white/30 transition-colors" />
    </div>
  );
};

export default StatCard;