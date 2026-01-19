import React from 'react';
import { TrendingUp, TrendingDown, Activity, Flame, Target, Award } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend = 'neutral',
  subtitle
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="trend-up" />;
    if (trend === 'down') return <TrendingDown size={16} className="trend-down" />;
    return null;
  };

  const getTrendClass = () => {
    if (trend === 'up') return 'positive';
    if (trend === 'down') return 'negative';
    return 'neutral';
  };

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-icon" style={{ backgroundColor: color }}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <div className="analytics-trend">
            {getTrendIcon()}
            <span className={`trend-value ${getTrendClass()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <div className="analytics-card-content">
        <h3 className="analytics-title">{title}</h3>
        <p className="analytics-value">{value}</p>
        {subtitle && <p className="analytics-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#ff6b35',
  backgroundColor = '#333'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-container">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ElementType;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  color = '#ff6b35'
}) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <div className="stat-value-container">
          <span className="stat-value">{value}</span>
          {unit && <span className="stat-unit">{unit}</span>}
        </div>
      </div>
      {Icon && (
        <div className="stat-icon" style={{ backgroundColor: color }}>
          <Icon size={16} />
        </div>
      )}
    </div>
  );
};
