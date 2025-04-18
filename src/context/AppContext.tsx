
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { TimeEntry, Project, Activity, AppSettings, MonthlyStats } from "@/types";
import { 
  loadTimeEntries, saveTimeEntries, 
  loadProjects, saveProjects, 
  loadActivities, saveActivities,
  loadSettings, saveSettings,
  savePin, validatePin, disablePin
} from "@/lib/storage";
import { getMonthlyStats, hasUnfinishedSessions, getUnfinishedSessions } from "@/lib/timeUtils";

interface AppContextProps {
  // TimeEntries
  timeEntries: TimeEntry[];
  activeTimeEntry: TimeEntry | undefined;
  startTimeEntry: (projectId: string, activityId: string, note?: string) => void;
  endTimeEntry: (timeEntryId: string) => void;
  deleteTimeEntry: (timeEntryId: string) => void;
  addTimeEntryWithTimes: (projectId: string, activityId: string, startTime: Date, endTime: Date, note?: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (name: string) => void;
  updateProject: (id: string, name: string, active: boolean) => void;
  
  // Activities
  activities: Activity[];
  addActivity: (name: string) => void;
  updateActivity: (id: string, name: string, active: boolean) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  
  // PIN
  setPin: (pin: string) => void;
  checkPin: (pin: string) => boolean;
  removePin: () => void;
  
  // Stats
  currentMonthStats: MonthlyStats;
  
  // Unfinished sessions
  unfinishedSessions: TimeEntry[];
  hasUnfinishedSessions: boolean;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    pinEnabled: false,
    backupToGoogleDrive: false
  });
  
  // Calculate current month stats
  const currentDate = new Date();
  const [currentMonthStats, setCurrentMonthStats] = useState<MonthlyStats>({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    totalHours: 0,
    avgHoursPerDay: 0,
    daysWorked: 0,
    entriesByProject: {},
    entriesByActivity: {}
  });
  
  // Check for unfinished sessions
  const [unfinishedSessions, setUnfinishedSessions] = useState<TimeEntry[]>([]);
  
  // Load data from localStorage on first render
  useEffect(() => {
    const loadedTimeEntries = loadTimeEntries();
    const loadedProjects = loadProjects();
    const loadedActivities = loadActivities();
    const loadedSettings = loadSettings();
    
    setTimeEntries(loadedTimeEntries);
    setProjects(loadedProjects);
    setActivities(loadedActivities);
    setSettings(loadedSettings);
    
    // Update stats
    const stats = getMonthlyStats(
      loadedTimeEntries,
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    setCurrentMonthStats(stats);
    
    // Check for unfinished sessions
    const unfinished = getUnfinishedSessions(loadedTimeEntries);
    setUnfinishedSessions(unfinished);
  }, []);
  
  // Calculate active time entry
  const activeTimeEntry = timeEntries.find(entry => !entry.endTime);
  
  // Update localStorage when data changes
  useEffect(() => {
    saveTimeEntries(timeEntries);
    
    // Update stats
    const stats = getMonthlyStats(
      timeEntries,
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    setCurrentMonthStats(stats);
    
    // Check for unfinished sessions
    const unfinished = getUnfinishedSessions(timeEntries);
    setUnfinishedSessions(unfinished);
  }, [timeEntries]);
  
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);
  
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);
  
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  
  // TimeEntry functions
  const startTimeEntry = (projectId: string, activityId: string, note?: string) => {
    // If there's an active time entry, end it first
    if (activeTimeEntry) {
      endTimeEntry(activeTimeEntry.id);
    }
    
    const newTimeEntry: TimeEntry = {
      id: uuidv4(),
      projectId,
      activityId,
      startTime: new Date(),
      note,
      completed: false
    };
    
    setTimeEntries([...timeEntries, newTimeEntry]);
  };
  
  const endTimeEntry = (timeEntryId: string) => {
    setTimeEntries(
      timeEntries.map(entry => 
        entry.id === timeEntryId
          ? { ...entry, endTime: new Date(), completed: true }
          : entry
      )
    );
  };
  
  const deleteTimeEntry = (timeEntryId: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== timeEntryId));
  };
  
  const addTimeEntryWithTimes = (
    projectId: string,
    activityId: string,
    startTime: Date,
    endTime: Date,
    note?: string
  ) => {
    const newTimeEntry: TimeEntry = {
      id: uuidv4(),
      projectId,
      activityId,
      startTime,
      endTime,
      note,
      completed: true
    };
    
    setTimeEntries([...timeEntries, newTimeEntry]);
  };
  
  // Project functions
  const addProject = (name: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      active: true
    };
    
    setProjects([...projects, newProject]);
  };
  
  const updateProject = (id: string, name: string, active: boolean) => {
    setProjects(
      projects.map(project => 
        project.id === id ? { ...project, name, active } : project
      )
    );
  };
  
  // Activity functions
  const addActivity = (name: string) => {
    const newActivity: Activity = {
      id: uuidv4(),
      name,
      active: true
    };
    
    setActivities([...activities, newActivity]);
  };
  
  const updateActivity = (id: string, name: string, active: boolean) => {
    setActivities(
      activities.map(activity => 
        activity.id === id ? { ...activity, name, active } : activity
      )
    );
  };
  
  // Settings functions
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };
  
  // PIN functions
  const setPin = (pin: string) => {
    savePin(pin);
    setSettings({ ...settings, pinEnabled: true, pin });
  };
  
  const checkPin = (pin: string) => {
    return validatePin(pin);
  };
  
  const removePin = () => {
    disablePin();
    setSettings({ ...settings, pinEnabled: false, pin: undefined });
  };
  
  return (
    <AppContext.Provider
      value={{
        timeEntries,
        activeTimeEntry,
        startTimeEntry,
        endTimeEntry,
        deleteTimeEntry,
        addTimeEntryWithTimes,
        
        projects,
        addProject,
        updateProject,
        
        activities,
        addActivity,
        updateActivity,
        
        settings,
        updateSettings,
        
        setPin,
        checkPin,
        removePin,
        
        currentMonthStats,
        
        unfinishedSessions,
        hasUnfinishedSessions: unfinishedSessions.length > 0
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  
  return context;
};
