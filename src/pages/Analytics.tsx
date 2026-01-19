import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, Target, Calendar, Filter, Flame } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../hooks/useAppStore';
import { generateAnalyticsData, calculateWeeklyStats, generateAIRecommendations, calculateGoalProgress, generateMacroData } from '../utils/analytics';
import { AnalyticsCard } from '../components/AnalyticsCard';

export const Analytics: React.FC = () => {
  const { userProfile, workoutSessions, nutritionDays, weightEntries } = useAppStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'workouts' | 'progress'>('progress');

  // Получение аналитических данных
  const analyticsData = generateAnalyticsData(workoutSessions, nutritionDays, weightEntries);
  const weeklyStats = calculateWeeklyStats(workoutSessions, nutritionDays, weightEntries);
  const aiRecommendations = userProfile ? generateAIRecommendations(userProfile, weeklyStats, workoutSessions) : [];
  const goalsProgress = userProfile ? calculateGoalProgress(userProfile, weightEntries, workoutSessions) : [];
  const macroData = generateMacroData(nutritionDays);

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Аналитика и прогресс</h1>
          <p className="text-secondary">Детальная статистика ваших достижений</p>
        </div>

        {/* Фильтры */}
        <div className="analytics-filters">
          <div className="filter-group">
            <Calendar size={16} />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="filter-select"
            >
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="year">Год</option>
            </select>
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="filter-select"
            >
              <option value="progress">Общий прогресс</option>
              <option value="weight">Вес</option>
              <option value="calories">Калории</option>
              <option value="workouts">Тренировки</option>
            </select>
          </div>
        </div>

        {/* Ключевые метрики */}
        <div className="metrics-grid">
          <AnalyticsCard
            title="Средний вес"
            value={`${weeklyStats.avgWeight.toFixed(1)} кг`}
            change={weeklyStats.weightChange}
            icon={TrendingDown}
            color="#ff6b35"
            trend={weeklyStats.weightChange < 0 ? 'down' : 'up'}
          />
          <AnalyticsCard
            title="Тренировок"
            value={weeklyStats.totalWorkouts.toString()}
            change={15}
            icon={Target}
            color="#4ecdc4"
            trend="up"
          />
          <AnalyticsCard
            title="Сожжено калорий"
            value={weeklyStats.totalCalories.toLocaleString()}
            change={8}
            icon={Flame}
            color="#45b7d1"
            trend="up"
          />
          <AnalyticsCard
            title="Дней подряд"
            value={weeklyStats.streakDays.toString()}
            change={0}
            icon={Award}
            color="#f7b731"
            trend="neutral"
          />
        </div>

        {/* График прогресса */}
        <div className="chart-section">
          <h2 className="section-title">Динамика прогресса</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#ff6b35" 
                  fill="#ff6b35" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Макронутриенты */}
        <div className="chart-row">
          <div className="chart-section half">
            <h2 className="section-title">Баланс БЖУ</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="macro-legend">
              {macroData.map((item) => (
                <div key={item.name} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: item.color }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-section half">
            <h2 className="section-title">Прогресс по целям</h2>
            <div className="goals-list">
              {goalsProgress.map((goal) => (
                <div key={goal.name} className="goal-item">
                  <div className="goal-info">
                    <h4 className="goal-name">{goal.name}</h4>
                    <p className="goal-progress">
                      {goal.current} / {goal.target} {goal.unit}
                    </p>
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-fill" 
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Рекомендации */}
        <div className="recommendations-section">
          <h2 className="section-title">🤖 AI Рекомендации</h2>
          <div className="recommendations-grid">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                <div className="recommendation-header">
                  <span className="recommendation-icon">{rec.icon}</span>
                  <span className={`priority-badge priority-${rec.priority}`}>
                    {rec.priority === 'high' ? 'Важно' : rec.priority === 'medium' ? 'Среднее' : 'Низкое'}
                  </span>
                </div>
                <h3 className="recommendation-title">{rec.title}</h3>
                <p className="recommendation-description">{rec.description}</p>
                <button className="recommendation-action">
                  Применить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
