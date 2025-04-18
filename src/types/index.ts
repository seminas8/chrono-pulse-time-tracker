
export interface TimeEntry {
  id: string;
  projectId: string;
  activityId: string;
  startTime: Date;
  endTime?: Date;
  note?: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  active: boolean;
}

export interface Activity {
  id: string;
  name: string;
  active: boolean;
}

export interface AppSettings {
  pinEnabled: boolean;
  pin?: string;
  backupToGoogleDrive: boolean;
  lastBackup?: Date;
  lastSyncToSupabase?: Date;
}

export interface DailyStats {
  date: Date;
  totalHours: number;
  entries: number;
  status: 'complete' | 'incomplete' | 'missing' | 'empty';
}

export interface MonthlyStats {
  month: number;
  year: number;
  totalHours: number;
  avgHoursPerDay: number;
  daysWorked: number;
  entriesByProject: { [projectId: string]: number };
  entriesByActivity: { [activityId: string]: number };
}
