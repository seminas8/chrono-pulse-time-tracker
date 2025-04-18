
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import PinInput from "@/components/ui/PinInput";
import { useApp } from "@/context/AppContext";

const PinPage = () => {
  const navigate = useNavigate();
  const { settings, checkPin, setPin, removePin } = useApp();
  
  const [mode, setMode] = useState<"verify" | "create" | "confirm" | "disable">(
    settings.pinEnabled ? "verify" : "create"
  );
  const [pin, setNewPin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  
  const handlePinSubmit = (enteredPin: string) => {
    switch (mode) {
      case "verify":
        if (checkPin(enteredPin)) {
          navigate("/impostazioni");
        } else {
          setError(true);
          setMessage("PIN non valido, riprova");
        }
        break;
        
      case "create":
        setNewPin(enteredPin);
        setMode("confirm");
        setMessage("Conferma il PIN");
        setError(false);
        break;
        
      case "confirm":
        if (enteredPin === pin) {
          setPin(enteredPin);
          setMessage("PIN impostato con successo");
          setTimeout(() => navigate("/impostazioni"), 1500);
        } else {
          setError(true);
          setMessage("I PIN non corrispondono, riprova");
          setTimeout(() => {
            setMode("create");
            setError(false);
            setMessage("Crea un nuovo PIN");
          }, 1500);
        }
        break;
        
      case "disable":
        if (checkPin(enteredPin)) {
          removePin();
          setMessage("PIN disattivato");
          setTimeout(() => navigate("/impostazioni"), 1500);
        } else {
          setError(true);
          setMessage("PIN non valido, riprova");
        }
        break;
    }
  };
  
  // Set initial message based on mode
  useEffect(() => {
    switch (mode) {
      case "verify":
        setMessage("Inserisci il PIN");
        break;
      case "create":
        setMessage("Crea un nuovo PIN");
        break;
      case "confirm":
        setMessage("Conferma il PIN");
        break;
      case "disable":
        setMessage("Inserisci il PIN per disattivarlo");
        break;
    }
  }, [mode]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Lock size={32} className="text-app-blue" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            {mode === "verify" ? "Sblocca" : mode === "disable" ? "Disattiva PIN" : "Imposta PIN"}
          </h1>
          <p className="text-gray-600 text-center mt-2">
            {mode === "verify" 
              ? "Inserisci il tuo PIN per accedere" 
              : mode === "create" || mode === "confirm"
                ? "Crea un PIN a 4 cifre per proteggere l'accesso"
                : "Inserisci il tuo PIN attuale per disattivarlo"}
          </p>
        </div>
        
        <PinInput
          onSubmit={handlePinSubmit}
          error={error}
          message={message}
        />
        
        {mode === "verify" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setMode("disable")}
              className="text-blue-600 text-sm"
            >
              Disattiva PIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinPage;
