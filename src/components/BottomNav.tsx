import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calculator, Dumbbell, Apple, TrendingUp } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Главная', icon: Home, path: '/' },
  { id: 'calculator', label: 'Калькулятор', icon: Calculator, path: '/calculator' },
  { id: 'workouts', label: 'Тренировки', icon: Dumbbell, path: '/workouts' },
  { id: 'nutrition', label: 'Питание', icon: Apple, path: '/nutrition' },
  { id: 'progress', label: 'Прогресс', icon: TrendingUp, path: '/progress' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
            >
              <Icon size={24} />
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
