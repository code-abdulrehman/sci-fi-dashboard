import { Button } from "@/components/ui/button";
import type { Mission } from "./types";
import { getStatusColor, getPriorityColor } from "./utils";
import { Eye, MapPin } from "lucide-react";

interface MissionTableProps {
  missions: Mission[];
  onMissionClick: (mission: Mission) => void;
}

export const MissionTable = ({ missions, onMissionClick }: MissionTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-shadow-lg text-shadow-primary">
          Mission Details
        </h2>
        <div className="text-sm text-foreground/60">
          Total: {missions.length} operations
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/20">
              <th className="text-left py-3 px-4 font-medium">Codename</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Priority</th>
              <th className="text-left py-3 px-4 font-medium">Target</th>
              <th className="text-left py-3 px-4 font-medium">Duration</th>
              <th className="text-left py-3 px-4 font-medium">Location</th>
              <th className="text-center py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => (
              <tr 
                key={mission.id} 
                className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors cursor-pointer"
                onClick={() => onMissionClick(mission)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{mission.codename}</div>
                  <div className="text-sm text-foreground/60">Team: {mission.teamSize} agents</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(mission.priority)}`}>
                    {mission.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs truncate">{mission.target}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div>{mission.startDate}</div>
                    <div className="text-foreground/60">to {mission.endDate}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <MapPin className="size-4 inline mr-1" />
                  {mission.location}
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    shape="flat"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMissionClick(mission);
                    }}
                  >
                    <Eye className="size-3 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 