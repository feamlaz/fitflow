import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Flame, Target } from 'lucide-react';
import { BMRResult, UserProfile } from '../types';

export const Calculator: React.FC = () => {
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    age: 30,
    gender: 'male',
    height: 180,
    weight: 80,
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [result, setResult] = useState<BMRResult | null>(null);

  const calculateBMR = () => {
    if (!userProfile.age || !userProfile.height || !userProfile.weight || !userProfile.gender || !userProfile.activityLevel || !userProfile.goal) {
      return;
    }

    // Mifflin-St Jeor equation
    let bmr: number;
    if (userProfile.gender === 'male') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }

    // TDEE calculation based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityMultipliers[userProfile.activityLevel];

    // Goal adjustment
    let goalCalories = tdee;
    if (userProfile.goal === 'lose_weight') {
      goalCalories = tdee * 0.85; // -15%
    } else if (userProfile.goal === 'gain_muscle') {
      goalCalories = tdee * 1.15; // +15%
    }

    // Macro calculation (40/40/20 split for muscle gain, adjusted for goals)
    let proteinRatio = 0.3;
    let carbsRatio = 0.4;
    let fatRatio = 0.3;

    if (userProfile.goal === 'gain_muscle') {
      proteinRatio = 0.35; // Higher protein for muscle gain
      carbsRatio = 0.45;
      fatRatio = 0.2;
    }

    const protein = (goalCalories * proteinRatio) / 4; // 4 calories per gram
    const carbs = (goalCalories * carbsRatio) / 4; // 4 calories per gram
    const fat = (goalCalories * fatRatio) / 9; // 9 calories per gram

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    });
  };

  return (
    <div className="calculator-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Калькулятор калорий</h1>
          <p className="text-secondary">
            Рассчитай свою норму калорий и БЖУ
          </p>
        </div>

        <div className="calculator-form">
          <div className="form-group">
            <label htmlFor="age">Возраст</label>
            <input
              type="number"
              id="age"
              value={userProfile.age || ''}
              onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Пол</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userProfile.gender === 'male'}
                  onChange={(e) => setUserProfile({...userProfile, gender: e.target.value as 'male' | 'female'})}
                />
                Мужской
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userProfile.gender === 'female'}
                  onChange={(e) => setUserProfile({...userProfile, gender: e.target.value as 'male' | 'female'})}
                />
                Женский
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="height">Рост (см)</label>
            <input
              type="number"
              id="height"
              value={userProfile.height || ''}
              onChange={(e) => setUserProfile({...userProfile, height: parseInt(e.target.value)})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Вес (кг)</label>
            <input
              type="number"
              id="weight"
              value={userProfile.weight || ''}
              onChange={(e) => setUserProfile({...userProfile, weight: parseInt(e.target.value)})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity">Уровень активности</label>
            <select
              id="activity"
              value={userProfile.activityLevel}
              onChange={(e) => setUserProfile({...userProfile, activityLevel: e.target.value as UserProfile['activityLevel']})}
              className="form-select"
            >
              <option value="sedentary">Сидячий образ жизни</option>
              <option value="light">Легкая активность (1-3 раза в неделю)</option>
              <option value="moderate">Умеренная активность (3-5 раза в неделю)</option>
              <option value="active">Высокая активность (6-7 раза в неделю)</option>
              <option value="very_active">Очень высокая активность</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goal">Цель</label>
            <select
              id="goal"
              value={userProfile.goal}
              onChange={(e) => setUserProfile({...userProfile, goal: e.target.value as UserProfile['goal']})}
              className="form-select"
            >
              <option value="lose_weight">Похудение</option>
              <option value="maintain">Поддержание веса</option>
              <option value="gain_muscle">Набор мышечной массы</option>
            </select>
          </div>

          <button onClick={calculateBMR} className="calculate-btn">
            <CalculatorIcon size={20} />
            Рассчитать
          </button>
        </div>

        {result && (
          <div className="results-section animate-slide-up">
            <h2 className="section-title">Результаты расчета</h2>
            
            <div className="result-cards">
              <div className="result-card">
                <div className="result-icon">
                  <Flame size={24} color="var(--accent-primary)" />
                </div>
                <div className="result-content">
                  <div className="result-value">{result.bmr}</div>
                  <div className="result-label">BMR (базовый метаболизм)</div>
                </div>
              </div>

              <div className="result-card">
                <div className="result-icon">
                  <Target size={24} color="var(--accent-success)" />
                </div>
                <div className="result-content">
                  <div className="result-value">{result.goalCalories}</div>
                  <div className="result-label">Калории в день</div>
                </div>
              </div>
            </div>

            <div className="macros-section">
              <h3>Рекомендуемый БЖУ</h3>
              <div className="macros-grid">
                <div className="macro-item">
                  <div className="macro-value">{result.protein}г</div>
                  <div className="macro-label">Белки</div>
                  <div className="macro-calories">{result.protein * 4} ккал</div>
                </div>
                <div className="macro-item">
                  <div className="macro-value">{result.carbs}г</div>
                  <div className="macro-label">Углеводы</div>
                  <div className="macro-calories">{result.carbs * 4} ккал</div>
                </div>
                <div className="macro-item">
                  <div className="macro-value">{result.fat}г</div>
                  <div className="macro-label">Жиры</div>
                  <div className="macro-calories">{result.fat * 9} ккал</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
