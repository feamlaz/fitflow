import React from 'react';
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        {/* Welcome Section */}
        <section className="welcome-section animate-slide-up">
          <h1 className="text-2xl font-bold mb-2">
            Добро пожаловать в FitFlow! 💪
          </h1>
          <p className="text-secondary">
            Твой персональный фитнес-тренер в кармане
          </p>
        </section>

        {/* Quick Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Flame size={24} color="var(--accent-primary)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">2,450</div>
              <div className="stat-label">Калории сегодня</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} color="var(--accent-success)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">85%</div>
              <div className="stat-label">Цель выполнена</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} color="var(--accent-secondary)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">7</div>
              <div className="stat-label">Дней подряд</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} color="var(--accent-warning)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">Сегодня</div>
              <div className="stat-label">День тренировки</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Быстрые действия</h2>
          
          <div className="action-grid">
            <button className="action-button primary">
              <span className="action-icon">🏃‍♂️</span>
              <span className="action-text">Начать тренировку</span>
            </button>

            <button className="action-button secondary">
              <span className="action-icon">🍽️</span>
              <span className="action-text">Записать прием пищи</span>
            </button>

            <button className="action-button secondary">
              <span className="action-icon">⚖️</span>
              <span className="action-text">Вес сегодня</span>
            </button>

            <button className="action-button secondary">
              <span className="action-icon">💧</span>
              <span className="action-text">Выпить воды</span>
            </button>
          </div>
        </section>

        {/* Today's Workout */}
        <section className="today-workout">
          <h2 className="section-title">Тренировка сегодня</h2>
          <div className="workout-card">
            <div className="workout-header">
              <h3>Домашняя тренировка</h3>
              <span className="workout-duration">25 мин</span>
            </div>
            <p className="workout-description">
              6 упражнений для всего тела. Никакого оборудования!
            </p>
            <button className="workout-start-btn">
              Начать сейчас
            </button>
          </div>
        </section>

        {/* Motivation */}
        <section className="motivation-section">
          <div className="motivation-card">
            <p className="motivation-quote">
              "Успех - это сумма маленьких усилий, повторяемых день за днем."
            </p>
            <p className="motivation-author">— Роберт Колльер</p>
          </div>
        </section>
      </div>
    </div>
  );
};
