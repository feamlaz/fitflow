import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  user?: User;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'FitFlow', 
  showBack = false, 
  onBack,
  user
}) => {
  return (
    <header className="header">
      <div className="header-content">
        {showBack && (
          <button 
            className="back-button"
            onClick={onBack}
            aria-label="Назад"
          >
            ←
          </button>
        )}
        <h1 className="header-title">{title}</h1>
        <div className="header-actions">
          {user && (
            <Link 
              to="/profile" 
              className="profile-button text-2xl hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-primary)' }}
              aria-label="Профиль"
            >
              👤
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
