import React, { useState } from 'react';
import { Dumbbell, Play, Clock, Check, RotateCcw, Timer, Settings, Pause, Volume2, VolumeX } from 'lucide-react';

export const Workouts: React.FC = () => {
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    startTime: null as number | null,
    totalTime: 0,
    completedSets: 0,
    estimatedCalories: 0
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const exercises = [
    { id: 1, name: 'Отжимания', muscles: 'Грудь, плечи, трицепсы', sets: 3, reps: 15 },
    { id: 2, name: 'Приседания', muscles: 'Ноги, ягодицы', sets: 4, reps: 20 },
    { id: 3, name: 'Планка', muscles: 'Кор, спина', sets: 3, reps: 60, isTime: true },
    { id: 4, name: 'Скручивания', muscles: 'Пресс', sets: 3, reps: 25 },
    { id: 5, name: 'Выпады', muscles: 'Ноги, ягодицы', sets: 3, reps: 15 },
    { id: 6, name: 'Берпи', muscles: 'Все тело, кардио', sets: 3, reps: 10 }
  ];

  const startExercise = (exerciseId: number) => {
    // Если упражнение уже завершено, сбрасываем его
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
    }
    setActiveWorkout(exerciseId);
    triggerHapticFeedback();
  };

  const completeExercise = (exerciseId: number) => {
    console.log('Complete exercise called:', exerciseId);
    console.log('Current completed:', completedExercises);
    
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
      setActiveWorkout(null); // Сбрасываем активное упражнение
      triggerHapticFeedback();
      
      // Начать отдых после завершения упражнения
      startRestTimer();
    } else {
      console.log('Exercise already completed');
    }
  };

  const repeatExercise = (exerciseId: number) => {
    // Удаляем из завершенных и делаем активным
    setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
    setActiveWorkout(exerciseId);
    triggerHapticFeedback();
  };

  const playSound = () => {
    if (soundEnabled && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const updateWorkoutStats = () => {
    const now = Date.now();
    const startTime = workoutStats.startTime || now;
    const totalTime = Math.floor((now - startTime) / 1000);
    const completedSets = completedExercises.length;
    const estimatedCalories = Math.round(completedSets * 8); // ~8 калорий на подход

    setWorkoutStats({
      startTime,
      totalTime,
      completedSets,
      estimatedCalories
    });
  };

  const startRestTimer = () => {
    setRestTimer(restDuration);
    setIsResting(true);
    setIsPaused(false);
  };

  const togglePauseTimer = () => {
    setIsPaused(!isPaused);
    triggerHapticFeedback();
  };

  const resetWorkout = () => {
    setCompletedExercises([]);
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    setIsResting(false);
    setRestTimer(0);
    setIsPaused(false);
    setWorkoutStats({
      startTime: null,
      totalTime: 0,
      completedSets: 0,
      estimatedCalories: 0
    });
    triggerHapticFeedback();
  };

  const startFullWorkout = () => {
    setIsWorkoutActive(true);
    setActiveWorkout(1);
    setWorkoutStats({
      ...workoutStats,
      startTime: Date.now()
    });
    triggerHapticFeedback();
  };

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Таймер отдыха и обновление статистики
  React.useEffect(() => {
    if (isResting && restTimer > 0 && !isPaused) {
      const timer = setTimeout(() => {
        setRestTimer(restTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTimer === 0) {
      setIsResting(false);
      setIsPaused(false);
      playSound(); // Звуковой сигнал окончания отдыха
      triggerHapticFeedback();
    }
  }, [isResting, restTimer, isPaused]);

  // Обновление статистики тренировки
  React.useEffect(() => {
    if (isWorkoutActive) {
      const statsTimer = setInterval(() => {
        updateWorkoutStats();
      }, 1000);
      return () => clearInterval(statsTimer);
    }
  }, [isWorkoutActive, completedExercises]);
  return (
    <div className="workouts-page">
      <div className="container">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Тренировки</h1>
          <p className="text-secondary">
            6 упражнений для домашней тренировки
          </p>
          
          {/* Статистика тренировки */}
          {isWorkoutActive && (
            <div className="workout-stats">
              <div className="stats-grid">
                <div className="stat-item">
                  <Timer size={16} />
                  <span>{Math.floor(workoutStats.totalTime / 60)}:{(workoutStats.totalTime % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="stat-item">
                  <Check size={16} />
                  <span>{workoutStats.completedSets} подходов</span>
                </div>
                <div className="stat-item">
                  <span>🔥 {workoutStats.estimatedCalories} ккал</span>
                </div>
              </div>
            </div>
          )}
          
          {completedExercises.length > 0 && (
            <div className="workout-progress">
              <div className="progress-text">
                Выполнено: {completedExercises.length} из {exercises.length}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Таймер отдыха */}
        {isResting && (
          <div className="rest-timer-card">
            <div className="timer-header">
              <div className="timer-controls">
                <button 
                  className="timer-settings-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Settings button clicked');
                    setShowSettings(!showSettings);
                  }}
                  title="Настройки таймера"
                  type="button"
                >
                  <Settings size={20} />
                </button>
                <button 
                  className="sound-toggle-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Sound button clicked, current:', soundEnabled);
                    setSoundEnabled(!soundEnabled);
                  }}
                  title={soundEnabled ? "Выключить звук" : "Включить звук"}
                  type="button"
                >
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>
            </div>
            
            <div className="timer-content">
              <Timer size={32} className="timer-icon" />
              <h3>Время отдыха</h3>
              <div className="timer-display">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
              </div>
              
              {/* Настройки таймера */}
              {showSettings && (
                <div className="timer-settings">
                  <div className="duration-options">
                    <span>Длительность отдыха:</span>
                    <div className="duration-buttons">
                      {[30, 45, 60, 90, 120].map(duration => (
                        <button
                          key={duration}
                          className={`duration-btn ${restDuration === duration ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Duration button clicked:', duration);
                            setRestDuration(duration);
                          }}
                          type="button"
                        >
                          {duration}с
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="timer-actions">
                <button 
                  className="pause-resume-btn"
                  onClick={togglePauseTimer}
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  {isPaused ? 'Продолжить' : 'Пауза'}
                </button>
                <button 
                  className="skip-rest-btn"
                  onClick={() => {
                    setIsResting(false);
                    setRestTimer(0);
                    setIsPaused(false);
                    triggerHapticFeedback();
                  }}
                >
                  Пропустить
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="workout-list">
          {exercises.map((exercise) => (
            <div 
              key={exercise.id} 
              className={`workout-card ${
                activeWorkout === exercise.id ? 'active' : ''
              } ${
                completedExercises.includes(exercise.id) ? 'completed' : ''
              }`}
            >
              <div className="workout-icon">
                {completedExercises.includes(exercise.id) ? (
                  <Check size={32} className="completed-icon" />
                ) : (
                  <Dumbbell size={32} />
                )}
              </div>
              <div className="workout-info">
                <h3>{exercise.name}</h3>
                <p>{exercise.muscles}</p>
                <div className="workout-meta">
                  <span>
                    <Clock size={16} /> 
                    {exercise.sets} подхода по {exercise.reps} {exercise.isTime ? 'секунд' : 'повторений'}
                  </span>
                </div>
              </div>
              <div className="workout-actions">
                {activeWorkout === exercise.id ? (
                  <button 
                    className="workout-complete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Check button clicked for exercise:', exercise.id);
                      completeExercise(exercise.id);
                    }}
                    onMouseDown={() => {
                      console.log('Mouse down on check button');
                    }}
                    title="Завершить упражнение"
                    type="button"
                  >
                    <Check size={20} />
                  </button>
                ) : completedExercises.includes(exercise.id) ? (
                  <button 
                    className="workout-repeat-btn"
                    onClick={() => repeatExercise(exercise.id)}
                    title="Повторить упражнение"
                  >
                    <RotateCcw size={20} />
                  </button>
                ) : (
                  <button 
                    className="workout-play-btn"
                    onClick={() => startExercise(exercise.id)}
                    title="Начать упражнение"
                  >
                    <Play size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="workout-footer">
          <button 
            className={`start-workout-btn ${
              completedExercises.length === exercises.length ? 'completed' : ''
            }`}
            onClick={startFullWorkout}
            disabled={completedExercises.length === exercises.length}
          >
            {completedExercises.length === exercises.length 
              ? 'Тренировка завершена! 🎉' 
              : isWorkoutActive 
                ? 'Продолжить тренировку' 
                : 'Начать полную тренировку'
            }
          </button>
          
          {completedExercises.length > 0 && (
            <button 
              className="reset-workout-btn"
              onClick={resetWorkout}
              title="Сбросить весь прогресс тренировки"
            >
              <RotateCcw size={16} />
              Сбросить прогресс
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
