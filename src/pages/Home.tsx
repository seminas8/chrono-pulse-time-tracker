
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, BarChart2, FileText, Settings } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useApp } from "@/context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { currentMonthStats, activeTimeEntry } = useApp();
  
  const menuItems = [
    {
      icon: Clock,
      title: "Timbratura",
      description: activeTimeEntry ? "Sessione in corso" : "Inizia una nuova sessione",
      path: "/timbratura",
      color: "bg-blue-500",
      textColor: "text-white"
    },
    {
      icon: Calendar,
      title: "Elenco Presenze",
      description: `${currentMonthStats.daysWorked} giorni questo mese`,
      path: "/presenze",
      color: "bg-white",
      textColor: "text-gray-800"
    },
    {
      icon: BarChart2,
      title: "Statistiche",
      description: `${currentMonthStats.totalHours.toFixed(2)} ore questo mese`,
      path: "/statistiche",
      color: "bg-white",
      textColor: "text-gray-800"
    },
    {
      icon: FileText,
      title: "Documenti",
      description: "Esporta e gestisci i tuoi dati",
      path: "/documenti",
      color: "bg-white",
      textColor: "text-gray-800"
    },
    {
      icon: Settings,
      title: "Impostazioni",
      description: "Configura l'applicazione",
      path: "/impostazioni",
      color: "bg-white",
      textColor: "text-gray-800"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-app-blue text-white p-4">
        <h1 className="text-2xl font-bold">ChronoPulse</h1>
        <p className="text-blue-100">Il tuo assistente per la gestione del tempo</p>
      </div>
      
      {activeTimeEntry && (
        <div className="bg-green-600 text-white p-3 text-center">
          <p className="text-sm">Sessione di lavoro attiva</p>
        </div>
      )}
      
      <div className="p-4 grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <div
            key={item.path}
            className={`${index === 0 ? "col-span-2" : ""} ${item.color} ${item.textColor} rounded-lg shadow-sm p-4 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={index === 0 ? 40 : 30} className={index === 0 ? "mb-3" : "mb-2"} />
            <h2 className={`font-semibold ${index === 0 ? "text-xl" : "text-md"}`}>{item.title}</h2>
            <p className={`text-center ${index === 0 ? "" : "text-sm"} opacity-80`}>{item.description}</p>
          </div>
        ))}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Home;
