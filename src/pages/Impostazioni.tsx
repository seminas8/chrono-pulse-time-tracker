
import { useState } from "react";
import { Settings as SettingsIcon, User, Lock, Unlock, Database, FileText, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const Impostazioni = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useApp();
  
  const [googleDriveBackup, setGoogleDriveBackup] = useState<boolean>(
    settings.backupToGoogleDrive || false
  );
  
  const toggleGoogleDriveBackup = () => {
    const newValue = !googleDriveBackup;
    setGoogleDriveBackup(newValue);
    updateSettings({
      ...settings,
      backupToGoogleDrive: newValue
    });
  };
  
  const menuItems = [
    {
      icon: User,
      title: "Progetti e Attività",
      description: "Gestisci progetti e attività",
      path: "/impostazioni/progetti-attivita"
    },
    {
      icon: settings.pinEnabled ? Lock : Unlock,
      title: "Protezione PIN",
      description: settings.pinEnabled ? "PIN attivo" : "PIN non attivo",
      path: "/pin"
    },
    {
      icon: Database,
      title: "Dati e sincronizzazione",
      description: "Gestisci dati e sincronizzazione",
      path: "/impostazioni/dati"
    },
    {
      icon: FileText,
      title: "Info e assistenza",
      description: "Informazioni sull'app",
      path: "/impostazioni/info"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header title="Impostazioni" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center mb-4">
            <SettingsIcon className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">Impostazioni applicazione</h2>
          </div>
          
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center">
                  <item.icon size={20} className="mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Backup e sincronizzazione</h2>
          
          <div className="flex items-center justify-between p-2">
            <div>
              <div className="font-medium">Backup su Google Drive</div>
              <div className="text-sm text-gray-600">Salva automaticamente i tuoi dati su Google Drive</div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={googleDriveBackup}
                onChange={toggleGoogleDriveBackup}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-1">ChronoPulse</h2>
            <p className="text-gray-600 text-sm">Versione 1.0.0</p>
            <p className="text-gray-500 text-xs mt-1">© 2025 ChronoPulse</p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Impostazioni;
