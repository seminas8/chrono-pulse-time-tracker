
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showHelpButton?: boolean;
  rightElement?: React.ReactNode;
}

const Header = ({ title, showBackButton = true, showHelpButton = true, rightElement }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-app-blue text-white shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-1 rounded-full hover:bg-blue-800"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {rightElement}
        {showHelpButton && (
          <button className="p-1 rounded-full hover:bg-blue-800">
            <HelpCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
