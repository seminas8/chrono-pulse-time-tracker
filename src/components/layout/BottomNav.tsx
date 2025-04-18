
import { Home, Clock, Calendar, BarChart2, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const { pathname } = location;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Clock, label: "Timbratura", path: "/timbratura" },
    { icon: Calendar, label: "Presenze", path: "/presenze" },
    { icon: BarChart2, label: "Statistiche", path: "/statistiche" },
    { icon: FileText, label: "Documenti", path: "/documenti" },
    { icon: Settings, label: "Impostazioni", path: "/impostazioni" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around shadow-md z-10">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center py-1 px-2 ${
              isActive ? "text-app-blue" : "text-gray-600"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
