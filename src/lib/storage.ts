
import { TimeEntry, Project, Activity, AppSettings } from "@/types";

// LocalStorage keys
const KEYS = {
  TIME_ENTRIES: "chronopulse_time_entries",
  PROJECTS: "chronopulse_projects",
  ACTIVITIES: "chronopulse_activities",
  SETTINGS: "chronopulse_settings",
  PIN: "chronopulse_pin"
};

// Salva i dati nel localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Carica i dati dal localStorage
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

// TimeEntry methods
export const saveTimeEntries = (entries: TimeEntry[]): void => {
  saveToLocalStorage(KEYS.TIME_ENTRIES, entries);
};

export const loadTimeEntries = (): TimeEntry[] => {
  const entries = loadFromLocalStorage<TimeEntry[]>(KEYS.TIME_ENTRIES, []);
  return entries.map(entry => ({
    ...entry,
    startTime: new Date(entry.startTime),
    endTime: entry.endTime ? new Date(entry.endTime) : undefined
  }));
};

export const addTimeEntry = (entry: TimeEntry): void => {
  const entries = loadTimeEntries();
  saveTimeEntries([...entries, entry]);
};

export const updateTimeEntry = (updatedEntry: TimeEntry): void => {
  const entries = loadTimeEntries();
  const updatedEntries = entries.map(entry => 
    entry.id === updatedEntry.id ? updatedEntry : entry
  );
  saveTimeEntries(updatedEntries);
};

export const deleteTimeEntry = (entryId: string): void => {
  const entries = loadTimeEntries();
  const filteredEntries = entries.filter(entry => entry.id !== entryId);
  saveTimeEntries(filteredEntries);
};

// Projects methods
export const saveProjects = (projects: Project[]): void => {
  saveToLocalStorage(KEYS.PROJECTS, projects);
};

export const loadProjects = (): Project[] => {
  return loadFromLocalStorage<Project[]>(KEYS.PROJECTS, [
    { id: "1", name: "Progetto Standard", active: true }
  ]);
};

// Activities methods
export const saveActivities = (activities: Activity[]): void => {
  saveToLocalStorage(KEYS.ACTIVITIES, activities);
};

export const loadActivities = (): Activity[] => {
  return loadFromLocalStorage<Activity[]>(KEYS.ACTIVITIES, [
    { id: "1", name: "Lavoro Standard", active: true }
  ]);
};

// Settings methods
export const saveSettings = (settings: AppSettings): void => {
  saveToLocalStorage(KEYS.SETTINGS, settings);
};

export const loadSettings = (): AppSettings => {
  return loadFromLocalStorage<AppSettings>(KEYS.SETTINGS, {
    pinEnabled: false,
    backupToGoogleDrive: false
  });
};

// PIN methods
export const savePin = (pin: string): void => {
  saveToLocalStorage(KEYS.PIN, pin);
  
  // Update settings
  const settings = loadSettings();
  saveSettings({
    ...settings,
    pinEnabled: true,
    pin
  });
};

export const validatePin = (pin: string): boolean => {
  const settings = loadSettings();
  return settings.pin === pin;
};

export const disablePin = (): void => {
  const settings = loadSettings();
  saveSettings({
    ...settings,
    pinEnabled: false,
    pin: undefined
  });
};
