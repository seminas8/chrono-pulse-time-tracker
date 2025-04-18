
import { useState, useRef, useEffect } from "react";

interface PinInputProps {
  onSubmit: (pin: string) => void;
  error?: boolean;
  message?: string;
}

const PinInput = ({ onSubmit, error = false, message }: PinInputProps) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  
  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto-advance to next input
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    
    // If all digits are filled, submit the PIN
    if (newPin.every(digit => digit !== "") && value !== "") {
      onSubmit(newPin.join(""));
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Go back on backspace if empty
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  
  // Focus the first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center space-x-3 mb-4">
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-16 text-center text-2xl border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-app-blue`}
          />
        ))}
      </div>
      
      {message && (
        <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PinInput;
