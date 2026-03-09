
export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm?: number | null;
  weightKg?: number | null;
  conditions?: string[] | null;
}
