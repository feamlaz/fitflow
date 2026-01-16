import React from 'react';
import { Dumbbell, Play, Clock } from 'lucide-react';

export const Workouts: React.FC = () => {
  return (
    <div className="workouts-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Тренировки</h1>
          <p className="text-secondary">
            6 упражнений для домашней тренировки
          </p>
        </div>

        <div className="workout-list">
          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Отжимания</h3>
              <p>Грудь, плечи, трицепсы</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 3 подхода по 15 повторений</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>

          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Приседания</h3>
              <p>Ноги, ягодицы</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 4 подхода по 20 повторений</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>

          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Планка</h3>
              <p>Кор, спина</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 3 подхода по 60 секунд</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>

          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Скручивания</h3>
              <p>Пресс</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 3 подхода по 25 повторений</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>

          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Выпады</h3>
              <p>Ноги, ягодицы</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 3 подхода по 15 повторений</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>

          <div className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={32} />
            </div>
            <div className="workout-info">
              <h3>Берпи</h3>
              <p>Все тело, кардио</p>
              <div className="workout-meta">
                <span><Clock size={16} /> 3 подхода по 10 повторений</span>
              </div>
            </div>
            <button className="workout-play-btn">
              <Play size={20} />
            </button>
          </div>
        </div>

        <button className="start-workout-btn">
          Начать полную тренировку
        </button>
      </div>
    </div>
  );
};
