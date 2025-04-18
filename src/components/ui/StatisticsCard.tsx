
import { BarChart2 } from "lucide-react";
import { MonthlyStats } from "@/types";
import { getMonthName } from "@/lib/timeUtils";
import { useApp } from "@/context/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StatisticsCardProps {
  stats: MonthlyStats;
}

const StatisticsCard = ({ stats }: StatisticsCardProps) => {
  const { projects, activities } = useApp();
  
  // Prepare data for project chart
  const projectData = Object.entries(stats.entriesByProject).map(([projectId, count]) => {
    const project = projects.find(p => p.id === projectId);
    return {
      name: project?.name || "Sconosciuto",
      value: count
    };
  });
  
  // Prepare data for activity chart
  const activityData = Object.entries(stats.entriesByActivity).map(([activityId, count]) => {
    const activity = activities.find(a => a.id === activityId);
    return {
      name: activity?.name || "Sconosciuto",
      value: count
    };
  });
  
  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9c27b0", "#3f51b5"];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center mb-3">
        <BarChart2 className="mr-2" size={20} />
        <h2 className="text-lg font-semibold">
          Statistiche {getMonthName(stats.month)} {stats.year}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border rounded-md p-3 text-center">
          <div className="text-sm text-gray-600">Ore totali</div>
          <div className="text-xl font-semibold">{stats.totalHours.toFixed(2)}</div>
        </div>
        
        <div className="border rounded-md p-3 text-center">
          <div className="text-sm text-gray-600">Media giornaliera</div>
          <div className="text-xl font-semibold">{stats.avgHoursPerDay.toFixed(2)}</div>
        </div>
        
        <div className="border rounded-md p-3 text-center">
          <div className="text-sm text-gray-600">Giorni lavorati</div>
          <div className="text-xl font-semibold">{stats.daysWorked}</div>
        </div>
        
        <div className="border rounded-md p-3 text-center">
          <div className="text-sm text-gray-600">N° timbrature</div>
          <div className="text-xl font-semibold">
            {Object.values(stats.entriesByProject).reduce((sum, count) => sum + count, 0)}
          </div>
        </div>
      </div>
      
      {projectData.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Distribuzione progetti</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} timbrature`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {activityData.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2">Distribuzione attività</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} timbrature`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;
