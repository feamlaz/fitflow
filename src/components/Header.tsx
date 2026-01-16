import React from 'react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'FitFlow', 
  showBack = false, 
  onBack 
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
          {/* Место для дополнительных кнопок */}
        </div>
      </div>
    </header>
  );
};

export default Header;
