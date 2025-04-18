
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useApp } from "@/context/AppContext";

const ProgettiAttivita = () => {
  const { projects, activities, addProject, updateProject, addActivity, updateActivity } = useApp();
  
  const [activeTab, setActiveTab] = useState<"progetti" | "attivita">("progetti");
  const [newItemName, setNewItemName] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{ id: string; name: string } | null>(null);
  
  const handleAddItem = () => {
    if (newItemName.trim() === "") return;
    
    if (activeTab === "progetti") {
      addProject(newItemName);
    } else {
      addActivity(newItemName);
    }
    
    setNewItemName("");
  };
  
  const handleUpdateItem = () => {
    if (!editingItem || editingItem.name.trim() === "") return;
    
    if (activeTab === "progetti") {
      const project = projects.find(p => p.id === editingItem.id);
      if (project) {
        updateProject(editingItem.id, editingItem.name, project.active);
      }
    } else {
      const activity = activities.find(a => a.id === editingItem.id);
      if (activity) {
        updateActivity(editingItem.id, editingItem.name, activity.active);
      }
    }
    
    setEditingItem(null);
  };
  
  const toggleItemStatus = (id: string, active: boolean) => {
    if (activeTab === "progetti") {
      const project = projects.find(p => p.id === id);
      if (project) {
        updateProject(id, project.name, !active);
      }
    } else {
      const activity = activities.find(a => a.id === id);
      if (activity) {
        updateActivity(id, activity.name, !active);
      }
    }
  };
  
  const currentItems = activeTab === "progetti" ? projects : activities;
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header title="Progetti e Attività" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-2">
            <button
              className={`py-3 text-center font-medium ${
                activeTab === "progetti"
                  ? "bg-app-blue text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("progetti")}
            >
              Progetti
            </button>
            <button
              className={`py-3 text-center font-medium ${
                activeTab === "attivita"
                  ? "bg-app-blue text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("attivita")}
            >
              Attività
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">
            {activeTab === "progetti" ? "Gestisci progetti" : "Gestisci attività"}
          </h3>
          
          <div className="space-y-3 mb-4">
            {currentItems.map(item => (
              <div
                key={item.id}
                className={`p-3 border rounded-md ${
                  item.active ? "border-gray-300" : "border-gray-200 bg-gray-50"
                }`}
              >
                {editingItem && editingItem.id === item.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="flex-1 p-2 border rounded mr-2"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateItem}
                      className="px-3 py-2 bg-blue-500 text-white rounded"
                    >
                      Salva
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className={item.active ? "font-medium" : "text-gray-500"}>
                      {item.name}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleItemStatus(item.id, item.active)}
                        className={`px-2 py-1 rounded text-xs ${
                          item.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.active ? "Attivo" : "Inattivo"}
                      </button>
                      
                      <button
                        onClick={() => setEditingItem({ id: item.id, name: item.name })}
                        className="text-blue-600"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {currentItems.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nessun {activeTab === "progetti" ? "progetto" : "attività"} disponibile.
                Aggiungine uno nuovo.
              </div>
            )}
          </div>
          
          <div className="flex mt-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Nuovo ${activeTab === "progetti" ? "progetto" : "attività"}`}
              className="flex-1 p-2 border rounded-l"
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-r flex items-center"
              disabled={newItemName.trim() === ""}
            >
              <Plus size={18} className="mr-1" />
              Aggiungi
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default ProgettiAttivita;
