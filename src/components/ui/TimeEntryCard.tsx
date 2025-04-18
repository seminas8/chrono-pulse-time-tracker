
import { Trash2 } from "lucide-react";
import { TimeEntry, Project, Activity } from "@/types";
import { formatDate, formatTimeShort, formatDuration, getDurationInSeconds } from "@/lib/timeUtils";
import { useApp } from "@/context/AppContext";

interface TimeEntryCardProps {
  entry: TimeEntry;
  showDate?: boolean;
}

const TimeEntryCard = ({ entry, showDate = true }: TimeEntryCardProps) => {
  const { projects, activities, deleteTimeEntry } = useApp();
  
  const project = projects.find(p => p.id === entry.projectId);
  const activity = activities.find(a => a.id === entry.activityId);
  
  const handleDelete = () => {
    if (window.confirm("Vuoi davvero eliminare questa timbratura?")) {
      deleteTimeEntry(entry.id);
    }
  };
  
  const getDuration = () => {
    if (!entry.endTime) return "In corso";
    
    const durationInSeconds = getDurationInSeconds(entry.startTime, entry.endTime);
    const hours = formatDuration(durationInSeconds).split(':')[0];
    const minutes = formatDuration(durationInSeconds).split(':')[1];
    
    return `${hours}.${minutes}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden">
      {showDate && (
        <div className="bg-gray-500 text-white px-4 py-1 text-sm">
          {formatDate(entry.startTime)}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold">Inizio</span>
              <span>{formatTimeShort(entry.startTime)}</span>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <span className="font-semibold">Fine</span>
              <span>{entry.endTime ? formatTimeShort(entry.endTime) : "--:--"}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold">Ore</div>
            <div className="text-lg">{getDuration()}</div>
          </div>
        </div>
        
        {(project || activity || entry.note) && (
          <div className="mt-2 pt-2 border-t text-sm text-gray-600">
            {project && <div>Progetto: {project.name}</div>}
            {activity && <div>Attività: {activity.name}</div>}
            {entry.note && <div className="italic mt-1">"{entry.note}"</div>}
          </div>
        )}
        
        <div className="flex justify-end mt-2">
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEntryCard;
