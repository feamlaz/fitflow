import { describe, it, expect } from 'vitest';
import { calculateBMR, calculateTDEE, calculateMacros } from '../calculators';

describe('Calculators', () => {
  it('should calculate BMR correctly for male', () => {
    const profile = {
      id: 'test',
      name: 'Test User',
      gender: 'male' as const,
      age: 30,
      height: 180,
      weight: 80,
      activityLevel: 'moderate' as const,
      goal: 'maintain' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const bmr = calculateBMR(profile);
    expect(bmr).toBeCloseTo(1780, 0);
  });

  it('should calculate BMR correctly for female', () => {
    const profile = {
      id: 'test',
      name: 'Test User',
      gender: 'female' as const,
      age: 25,
      height: 165,
      weight: 60,
      activityLevel: 'moderate' as const,
      goal: 'maintain' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const bmr = calculateBMR(profile);
    expect(bmr).toBeCloseTo(1345, 0);
  });

  it('should calculate TDEE correctly', () => {
    const tdee = calculateTDEE(1855, 'moderate');
    expect(tdee).toBeCloseTo(2875, 0);
  });

  it('should calculate macros correctly for maintenance', () => {
    const macros = calculateMacros(2000, 'maintain');
    expect(macros.protein).toBe(150);
    expect(macros.carbs).toBe(200);
    expect(macros.fat).toBe(67);
    expect(macros.calories).toBe(2000);
  });
});
