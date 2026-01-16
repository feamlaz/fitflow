import React from 'react';
import { TrendingUp, Camera, Calendar } from 'lucide-react';

export const Progress: React.FC = () => {
  return (
    <div className="progress-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Прогресс</h1>
          <p className="text-secondary">
            Отслеживай свои результаты
          </p>
        </div>

        <div className="progress-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} color="var(--accent-success)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">-2.5 кг</div>
              <div className="stat-label">За месяц</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} color="var(--accent-primary)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">21 день</div>
              <div className="stat-label">Подряд тренировок</div>
            </div>
          </div>
        </div>

        <div className="weight-chart-section">
          <h2 className="section-title">Динамика веса</h2>
          <div className="chart-placeholder">
            <p>График веса будет здесь</p>
            <div className="chart-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        <div className="measurements-section">
          <div className="section-header">
            <h2 className="section-title">Замеры</h2>
            <button className="add-measurement-btn">
              + Добавить
            </button>
          </div>

          <div className="measurements-grid">
            <div className="measurement-item">
              <span className="measurement-label">Грудь</span>
              <span className="measurement-value">102 см</span>
              <span className="measurement-change">-2 см</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Талия</span>
              <span className="measurement-value">78 см</span>
              <span className="measurement-change">-4 см</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Бедра</span>
              <span className="measurement-value">95 см</span>
              <span className="measurement-change">-3 см</span>
            </div>
            <div className="measurement-item">
              <span className="measurement-label">Руки</span>
              <span className="measurement-value">35 см</span>
              <span className="measurement-change">+1 см</span>
            </div>
          </div>
        </div>

        <div className="photos-section">
          <div className="section-header">
            <h2 className="section-title">Фотографии прогресса</h2>
            <button className="add-photo-btn">
              <Camera size={20} />
              Добавить фото
            </button>
          </div>

          <div className="photos-grid">
            <div className="photo-card">
              <div className="photo-placeholder">
                <Camera size={32} />
                <span>Спереди</span>
              </div>
              <span className="photo-date">1 января</span>
            </div>
            <div className="photo-card">
              <div className="photo-placeholder">
                <Camera size={32} />
                <span>Сбоку</span>
              </div>
              <span className="photo-date">1 января</span>
            </div>
            <div className="photo-card">
              <div className="photo-placeholder">
                <Camera size={32} />
                <span>Сзади</span>
              </div>
              <span className="photo-date">1 января</span>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h2 className="section-title">Достижения</h2>
          <div className="achievements-grid">
            <div className="achievement-card unlocked">
              <div className="achievement-icon">🏃‍♂️</div>
              <div className="achievement-info">
                <h4>Неделя тренировок</h4>
                <p>7 дней подряд</p>
              </div>
            </div>
            <div className="achievement-card unlocked">
              <div className="achievement-icon">💪</div>
              <div className="achievement-info">
                <h4>Сила воли</h4>
                <p>21 день подряд</p>
              </div>
            </div>
            <div className="achievement-card locked">
              <div className="achievement-icon">🎯</div>
              <div className="achievement-info">
                <h4>Цель достигнута</h4>
                <p>Потеря 5 кг</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
