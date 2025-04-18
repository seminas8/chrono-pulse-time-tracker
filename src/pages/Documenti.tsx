
import { useState } from "react";
import { FileText, Download, Upload, Calendar, Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/timeUtils";

const Documenti = () => {
  const { timeEntries, projects, activities } = useApp();
  const [exportType, setExportType] = useState<"pdf" | "txt">("pdf");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  
  const handleExport = () => {
    // Filtrare i dati in base ai criteri selezionati
    const filteredEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      const monthMatches = entryDate.getMonth() === selectedMonth;
      const yearMatches = entryDate.getFullYear() === selectedYear;
      const projectMatches = selectedProject === "all" || entry.projectId === selectedProject;
      const activityMatches = selectedActivity === "all" || entry.activityId === selectedActivity;
      
      return monthMatches && yearMatches && projectMatches && activityMatches;
    });
    
    // In un'app reale, qui si genererebbero i file PDF o TXT
    console.log(`Exporting ${exportType} with ${filteredEntries.length} entries`);
    
    // Simulare un download
    alert(`Esportazione di ${filteredEntries.length} timbrature completata!`);
  };
  
  const handleBackupToCloud = () => {
    // In un'app reale, qui si farebbe il backup su Google Drive
    alert("Backup su Google Drive avviato.");
  };
  
  const months = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header title="Documenti" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-3">
            <FileText className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">Esporta dati</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Formato</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setExportType("pdf")}
                className={`flex-1 py-2 rounded ${
                  exportType === "pdf"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setExportType("txt")}
                className={`flex-1 py-2 rounded ${
                  exportType === "txt"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                TXT
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Periodo</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Filtra per progetto</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">Tutti i progetti</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Filtra per attività</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">Tutte le attività</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleExport}
            className="w-full py-2 bg-blue-500 text-white rounded flex items-center justify-center"
          >
            <Download size={18} className="mr-2" />
            Esporta
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-3">
            <Upload className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">Backup</h2>
          </div>
          
          <div className="p-3 bg-blue-50 text-blue-800 rounded-lg mb-4">
            <p className="text-sm">L'ultimo backup locale è stato eseguito il {formatDate(new Date())}</p>
          </div>
          
          <button
            onClick={handleBackupToCloud}
            className="w-full py-2 bg-blue-500 text-white rounded flex items-center justify-center mb-2"
          >
            <Upload size={18} className="mr-2" />
            Backup su Google Drive
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            I backup vengono salvati automaticamente su Supabase
          </p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Documenti;
