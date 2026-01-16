import React from 'react';
import { Apple, Plus, Search } from 'lucide-react';

export const Nutrition: React.FC = () => {
  return (
    <div className="nutrition-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Питание</h1>
          <p className="text-secondary">
            Отслеживай калории и БЖУ
          </p>
        </div>

        <div className="nutrition-summary">
          <div className="summary-card">
            <div className="summary-header">
              <h3>Сегодня</h3>
              <span className="date">16 января</span>
            </div>
            <div className="calories-progress">
              <div className="progress-circle">
                <span className="calories-current">1,850</span>
                <span className="calories-goal">/ 2,450 ккал</span>
              </div>
            </div>
            <div className="macros-bar">
              <div className="macro-item protein">
                <span>Б</span>
                <div className="macro-bar"></div>
              </div>
              <div className="macro-item carbs">
                <span>Ж</span>
                <div className="macro-bar"></div>
              </div>
              <div className="macro-item fat">
                <span>У</span>
                <div className="macro-bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="meals-section">
          <div className="section-header">
            <h2>Приемы пищи</h2>
            <button className="add-meal-btn">
              <Plus size={20} />
            </button>
          </div>

          <div className="meals-list">
            <div className="meal-card">
              <div className="meal-header">
                <h3>Завтрак</h3>
                <span className="meal-calories">450 ккал</span>
              </div>
              <div className="meal-items">
                <div className="food-item">
                  <span>Овсянка с бананом</span>
                  <span>320 ккал</span>
                </div>
                <div className="food-item">
                  <span>Кофе с молоком</span>
                  <span>130 ккал</span>
                </div>
              </div>
            </div>

            <div className="meal-card">
              <div className="meal-header">
                <h3>Обед</h3>
                <span className="meal-calories">680 ккал</span>
              </div>
              <div className="meal-items">
                <div className="food-item">
                  <span>Куриная грудка на гриле</span>
                  <span>280 ккал</span>
                </div>
                <div className="food-item">
                  <span>Гречка с овощами</span>
                  <span>320 ккал</span>
                </div>
                <div className="food-item">
                  <span>Салат</span>
                  <span>80 ккал</span>
                </div>
              </div>
            </div>

            <div className="meal-card">
              <div className="meal-header">
                <h3>Ужин</h3>
                <span className="meal-calories">520 ккал</span>
              </div>
              <div className="meal-items">
                <div className="food-item">
                  <span>Рыба запеченная</span>
                  <span>320 ккал</span>
                </div>
                <div className="food-item">
                  <span>Картофельное пюре</span>
                  <span>200 ккал</span>
                </div>
              </div>
            </div>

            <div className="meal-card empty">
              <div className="meal-header">
                <h3>Перекус</h3>
                <span className="meal-calories">0 ккал</span>
              </div>
              <button className="add-food-btn">
                <Plus size={16} />
                Добавить продукт
              </button>
            </div>
          </div>
        </div>

        <div className="water-section">
          <div className="water-card">
            <h3>Водный баланс</h3>
            <div className="water-progress">
              <div className="water-glasses">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`water-glass ${i < 5 ? 'filled' : ''}`}>
                    💧
                  </div>
                ))}
              </div>
              <span className="water-amount">1.5L / 2.0L</span>
            </div>
            <button className="add-water-btn">
              + 250мл
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
