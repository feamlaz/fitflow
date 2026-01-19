import React, { useState, useEffect } from 'react';
import { Flame, Target, TrendingUp, Dumbbell, Utensils, Weight, Droplets, Sun, Moon, Cloud } from 'lucide-react';
import { useSupabaseStore } from '../hooks/useSupabaseStore';
import { useNavigate } from 'react-router-dom';
import { generateAIRecommendation, generateTomorrowPrediction, generateMotivationBadges, generateNutritionTips } from '../utils/aiRecommendations';

export const Home: React.FC = () => {
  const { user, nutritionDays, workoutSessions } = useSupabaseStore();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    water: 0,
    workoutsCompleted: 0,
    goalProgress: 0
  });

  const [aiRecommendation, setAIRecommendation] = useState<any>(null);
  const [tomorrowPrediction, setTomorrowPrediction] = useState<any>(null);
  const [motivationBadges, setMotivationBadges] = useState<any[]>([]);
  const [nutritionTips, setNutritionTips] = useState<any[]>([]);
  const [streakDays] = useState(7); // Заглушка, потом из Supabase

  // Мотивационные цитаты
  const motivationalQuotes = [
    { text: "Успех - это сумма маленьких усилий, повторяемых день за днем.", author: "Роберт Колльер" },
    { text: "Твоё тело может выдержать почти всё. Твой ум - это тот, кому ты должен всё доказать.", author: "Дэвид Гоггинс" },
    { text: "Единственный плохой тренировок - это та, которой не было.", author: "Неизвестно" },
    { text: "Сильный человек - не тот, кто никогда не падает, а тот, кто после падения встает.", author: "Нельсон Мандела" },
    { text: "Начни с того, что необходимо, затем сделай то, что возможно, и вдруг ты обнаружишь, что делаешь невозможное.", author: "Святой Франциск Ассизский" }
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  // Получение времени суток
  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Приветствие в зависимости от времени
  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = {
      morning: 'Доброе утро',
      afternoon: 'Добрый день',
      evening: 'Добрый вечер'
    };
    return greetings[timeOfDay];
  };

  // Получение иконки времени суток
  const getTimeIcon = () => {
    const timeOfDay = getTimeOfDay();
    const icons = {
      morning: <Sun size={20} />,
      afternoon: <Cloud size={20} />,
      evening: <Moon size={20} />
    };
    return icons[timeOfDay];
  };

  // Расчет сегодняшней статистики
  useEffect(() => {
    const today = new Date().toDateString();
    const todayNutrition = nutritionDays.find(day => 
      new Date(day.date).toDateString() === today
    );
    const todayWorkouts = workoutSessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    );

    setTodayStats({
      calories: todayNutrition?.totalCalories || 0,
      water: todayNutrition?.water || 0,
      workoutsCompleted: todayWorkouts.length,
      goalProgress: user ? Math.round((todayNutrition?.totalCalories || 0) / 2000 * 100) : 0 // Используем стандартные 2000 ккал
    });

    // Генерируем AI рекомендации
    const recommendation = generateAIRecommendation(user as any, todayStats, workoutSessions as any, nutritionDays as any);
    setAIRecommendation(recommendation);

    // Генерируем предсказание на завтра
    const prediction = generateTomorrowPrediction(user as any, todayStats, workoutSessions as any, nutritionDays as any);
    setTomorrowPrediction(prediction);

    // Генерируем бейджи
    const badges = generateMotivationBadges(user as any, todayStats, streakDays);
    setMotivationBadges(badges);

    // Генерируем советы по питанию
    const tips = generateNutritionTips(user as any, todayStats, nutritionDays as any);
    setNutritionTips(tips);
  }, [nutritionDays, workoutSessions, user, streakDays]);

  // Обновление времени
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновляем каждую минуту

    // Устанавливаем случайную цитату при загрузке
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);

    return () => clearInterval(timer);
  }, []);

  // Функции быстрых действий
  const quickActions = [
    {
      id: 'workout',
      icon: <Dumbbell size={24} />,
      text: 'Начать тренировку',
      color: 'primary',
      action: () => navigate('/workouts')
    },
    {
      id: 'nutrition',
      icon: <Utensils size={24} />,
      text: 'Записать прием пищи',
      color: 'secondary',
      action: () => navigate('/nutrition')
    },
    {
      id: 'weight',
      icon: <Weight size={24} />,
      text: 'Вес сегодня',
      color: 'secondary',
      action: () => navigate('/progress')
    },
    {
      id: 'water',
      icon: <Droplets size={24} />,
      text: 'Выпить воды',
      color: 'secondary',
      action: () => navigate('/nutrition')
    }
  ];
  return (
    <div className="home-page">
      <div className="container">
        {/* Welcome Section */}
        <section className="welcome-section animate-slide-up">
          <div className="welcome-header">
            <div className="greeting-time">
              {getTimeIcon()}
              <span className="time-text">{currentTime.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, {user?.name || 'Пользователь'}! 💪
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
              <div className="stat-value">{todayStats.calories.toLocaleString()}</div>
              <div className="stat-label">Калории сегодня</div>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ 
                    width: `${Math.min(todayStats.goalProgress, 100)}%`,
                    background: 'var(--accent-primary)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} color="var(--accent-success)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{Math.min(todayStats.goalProgress, 100)}%</div>
              <div className="stat-label">Цель выполнена</div>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ 
                    width: `${Math.min(todayStats.goalProgress, 100)}%`,
                    background: 'var(--accent-success)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} color="var(--accent-secondary)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{todayStats.workoutsCompleted}</div>
              <div className="stat-label">Тренировок сегодня</div>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ 
                    width: `${Math.min(todayStats.workoutsCompleted * 33, 100)}%`,
                    background: 'var(--accent-secondary)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Droplets size={24} color="var(--accent-warning)" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{todayStats.water}мл</div>
              <div className="stat-label">Выпито воды</div>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ 
                    width: `${Math.min((todayStats.water / 2000) * 100, 100)}%`,
                    background: 'var(--accent-warning)'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="progress-overview">
          <h2 className="section-title">Прогресс дня</h2>
          <div className="progress-grid">
            <div className="progress-card">
              <div className="progress-header">
                <h3>Калории</h3>
                <span className="progress-percentage">{Math.min(todayStats.goalProgress, 100)}%</span>
              </div>
              <div className="progress-ring-large">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 35}
                    strokeDashoffset={2 * Math.PI * 35 * (1 - Math.min(todayStats.goalProgress, 100) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{
                      transition: 'stroke-dashoffset 0.5s ease'
                    }}
                  />
                </svg>
                <div className="progress-center">
                  <span className="progress-value">{todayStats.calories}</span>
                  <span className="progress-total">/ 2000</span>
                </div>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-header">
                <h3>Вода</h3>
                <span className="progress-percentage">{Math.min((todayStats.water / 2000) * 100, 100)}%</span>
              </div>
              <div className="progress-ring-large">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--accent-warning)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 35}
                    strokeDashoffset={2 * Math.PI * 35 * (1 - Math.min((todayStats.water / 2000) * 100, 100) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{
                      transition: 'stroke-dashoffset 0.5s ease'
                    }}
                  />
                </svg>
                <div className="progress-center">
                  <span className="progress-value">{todayStats.water}</span>
                  <span className="progress-total">мл</span>
                </div>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-header">
                <h3>Активность</h3>
                <span className="progress-percentage">{Math.min(todayStats.workoutsCompleted * 33, 100)}%</span>
              </div>
              <div className="progress-ring-large">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="var(--accent-secondary)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 35}
                    strokeDashoffset={2 * Math.PI * 35 * (1 - Math.min(todayStats.workoutsCompleted * 33, 100) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    style={{
                      transition: 'stroke-dashoffset 0.5s ease'
                    }}
                  />
                </svg>
                <div className="progress-center">
                  <span className="progress-value">{todayStats.workoutsCompleted}</span>
                  <span className="progress-total">/ 3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="ai-recommendations">
          <h2 className="section-title">AI Рекомендации</h2>
          
          {/* Основная рекомендация */}
          {aiRecommendation && (
            <div className="ai-card primary">
              <div className="ai-icon">{aiRecommendation.icon}</div>
              <div className="ai-content">
                <h3>{aiRecommendation.title}</h3>
                <p>{aiRecommendation.description}</p>
              </div>
              <div className="ai-priority">
                <span className={`priority-badge ${aiRecommendation.priority}`}>
                  {aiRecommendation.priority === 'high' ? 'Важно' : aiRecommendation.priority === 'medium' ? 'Совет' : 'Информация'}
                </span>
              </div>
            </div>
          )}

          {/* Предсказание на завтра */}
          {tomorrowPrediction && (
            <div className="ai-card secondary">
              <div className="ai-icon">🔮</div>
              <div className="ai-content">
                <h3>Завтра</h3>
                <p>{tomorrowPrediction.prediction}</p>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: `${tomorrowPrediction.confidence}%` }} />
                  <span className="confidence-text">{tomorrowPrediction.confidence}% уверенности</span>
                </div>
                {tomorrowPrediction.tips.length > 0 && (
                  <div className="prediction-tips">
                    {tomorrowPrediction.tips.map((tip: string, index: number) => (
                      <span key={index} className="tip">💡 {tip}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Motivation Badges */}
        {motivationBadges.length > 0 && (
          <section className="motivation-badges">
            <h2 className="section-title">Ваши достижения</h2>
            <div className="badges-grid">
              {motivationBadges.map((badge, index) => (
                <div key={index} className={`badge ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-info">
                    <h4>{badge.title}</h4>
                    <p>{badge.description}</p>
                  </div>
                  {badge.earned && <div className="badge-check">✓</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Nutrition Tips */}
        {nutritionTips.length > 0 && (
          <section className="nutrition-tips">
            <h2 className="section-title">Советы по питанию</h2>
            <div className="tips-grid">
              {nutritionTips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <div className="tip-category">{tip.category}</div>
                  <div className="tip-content">{tip.tip}</div>
                  <div className="tip-priority">
                    <span className={`priority-badge ${tip.priority}`}>
                      {tip.priority === 'high' ? 'Важно' : 'Совет'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Быстрые действия</h2>
          
          <div className="action-grid">
            {quickActions.map((action) => (
              <button 
                key={action.id}
                className={`action-button ${action.color}`}
                onClick={action.action}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-text">{action.text}</span>
              </button>
            ))}
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
              "{currentQuote.text}"
            </p>
            <p className="motivation-author">— {currentQuote.author}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
