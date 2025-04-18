
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Calendar, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import TimeClock from "@/components/ui/TimeClock";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/timeUtils";

const Timbratura = () => {
  const navigate = useNavigate();
  const { 
    timeEntries,
    activeTimeEntry,
    projects,
    activities,
    startTimeEntry,
    endTimeEntry,
    hasUnfinishedSessions,
    unfinishedSessions,
    currentMonthStats
  } = useApp();
  
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showNoteField, setShowNoteField] = useState<boolean>(false);
  
  // Select first project and activity by default
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
    
    if (activities.length > 0 && !selectedActivity) {
      setSelectedActivity(activities[0].id);
    }
  }, [projects, activities]);
  
  const handleStart = () => {
    if (selectedProject && selectedActivity) {
      startTimeEntry(selectedProject, selectedActivity, note);
      setNote("");
      setShowNoteField(false);
    }
  };
  
  const handleEnd = () => {
    if (activeTimeEntry) {
      endTimeEntry(activeTimeEntry.id);
    }
  };
  
  const today = new Date();
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Calculate today's hours
  const todayHours = filteredEntries.reduce((total, entry) => {
    if (entry.endTime) {
      const durationInHours = (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
      return total + durationInHours;
    }
    return total;
  }, 0);
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header title="Timbratura" />
      
      {hasUnfinishedSessions && (
        <div className="bg-yellow-100 p-3 flex items-center text-yellow-800 border-b border-yellow-200">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Sessioni incomplete rilevate</p>
            <p className="text-xs">
              Hai {unfinishedSessions.length} sessioni non chiuse correttamente
            </p>
          </div>
          <button 
            className="ml-auto bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs"
            onClick={() => navigate("/presenze")}
          >
            Risolvi
          </button>
        </div>
      )}
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between">
            <div className="text-gray-600 mb-1">Ore mese:</div>
            <div className="text-2xl font-semibold flex items-center">
              {currentMonthStats.totalHours.toFixed(2)}
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <RefreshCw size={16} />
              </button>
              <button 
                className="ml-auto text-blue-500"
                onClick={() => navigate("/presenze")}
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between">
            <div className="text-gray-600 mb-1">Ore oggi:</div>
            <div className="text-2xl font-semibold">
              {todayHours.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="text-center mb-2">
            <div className="text-gray-600 mb-1">Inizio</div>
            <div className="text-xl">
              {activeTimeEntry 
                ? formatDate(activeTimeEntry.startTime)
                : "--/--/--"}
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-3"></div>
          
          <div className="text-center mb-2">
            <div className="text-gray-600 mb-1">Ore di lavoro</div>
            <TimeClock 
              startTime={activeTimeEntry?.startTime}
              endTime={activeTimeEntry?.endTime}
              isActive={!!activeTimeEntry && !activeTimeEntry.endTime}
            />
          </div>
        </div>
        
        {!activeTimeEntry ? (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Progetto</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {projects.filter(p => p.active).map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Attività</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {activities.filter(a => a.active).map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
            
            {showNoteField ? (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Note (opzionale)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={2}
                  placeholder="Aggiungi note per questa sessione..."
                />
              </div>
            ) : (
              <button
                onClick={() => setShowNoteField(true)}
                className="text-blue-500 hover:text-blue-700 text-sm mb-4"
              >
                + Aggiungi nota
              </button>
            )}
          </div>
        ) : null}
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleStart}
            disabled={!!activeTimeEntry}
            className={`py-3 rounded-md font-medium ${
              activeTimeEntry
                ? "bg-gray-300 text-gray-500"
                : "bg-app-green text-white"
            }`}
          >
            INGRESSO
          </button>
          
          <button
            onClick={handleEnd}
            disabled={!activeTimeEntry}
            className={`py-3 rounded-md font-medium ${
              !activeTimeEntry
                ? "bg-gray-300 text-gray-500"
                : "bg-app-red text-white"
            }`}
          >
            USCITA
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Timbratura;
