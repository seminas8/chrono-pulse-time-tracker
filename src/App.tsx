
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import Home from "./pages/Home";
import Timbratura from "./pages/Timbratura";
import Presenze from "./pages/Presenze";
import Statistiche from "./pages/Statistiche";
import Documenti from "./pages/Documenti";
import Impostazioni from "./pages/Impostazioni";
import ProgettiAttivita from "./pages/ProgettiAttivita";
import PinPage from "./pages/PinPage";
import NotFound from "./pages/NotFound";
import { loadSettings } from "./lib/storage";

const queryClient = new QueryClient();

const App = () => {
  const [isPinRequired, setIsPinRequired] = useState<boolean | null>(null);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  
  useEffect(() => {
    // Carica le impostazioni per verificare se il PIN è attivo
    const settings = loadSettings();
    setIsPinRequired(settings.pinEnabled || false);
  }, []);
  
  // Se il PIN è richiesto ma non è stato ancora verificato, reindirizza alla pagina del PIN
  if (isPinRequired === true && !isPinVerified) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/pin" element={<PinPage />} />
                <Route path="*" element={<Navigate to="/pin" replace />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  // Se il PIN non è richiesto o è stato verificato, mostra l'app normale
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timbratura" element={<Timbratura />} />
              <Route path="/presenze" element={<Presenze />} />
              <Route path="/statistiche" element={<Statistiche />} />
              <Route path="/documenti" element={<Documenti />} />
              <Route path="/impostazioni" element={<Impostazioni />} />
              <Route path="/impostazioni/progetti-attivita" element={<ProgettiAttivita />} />
              <Route path="/pin" element={<PinPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
