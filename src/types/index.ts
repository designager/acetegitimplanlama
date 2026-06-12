export interface Institution {
  id: string;
  name: string;
  logoBase64?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleConfig {
  startTime: string;
  endTime: string;
  intervalMinutes: 15 | 20 | 30 | 45 | 60;
}

export type TargetType = "student_count" | "registration" | "trial_lesson" | "other";

export interface ScheduleRow {
  id: string;
  timeSlot: string;
  action: string;
  notes?: string;
  colorTag?: string;
}

export interface Schedule {
  id: string;
  institutionId: string;
  date: string;
  config: ScheduleConfig;
  globalTarget?: string;
  rows: ScheduleRow[];
  createdBy?: string;
  createdAt: string;
}
