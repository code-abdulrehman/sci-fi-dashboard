import { DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogTitle, DialogDescription, DialogCloseTrigger, Portal } from "@/components/ui/dialog";
import type { Mission } from "./types";
import { getStatusColor, getPriorityColor } from "./utils";
import { Calendar, MapPin, Activity } from "lucide-react";

interface MissionModalProps {
  mission: Mission | null;
  onClose: () => void;
}

export const MissionModal = ({ mission, onClose }: MissionModalProps) => {
  if (!mission) return null;

  return (
    <DialogRoot open={!!mission} onOpenChange={onClose}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="max-w-4xl">
            <DialogTitle>Mission Details</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Codename</label>
                    <div className="text-lg font-semibold">{mission.codename}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Status</label>
                    <div className={`text-lg font-semibold ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Priority</label>
                    <div className={`text-lg font-semibold ${getPriorityColor(mission.priority)}`}>
                      {mission.priority}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Team Size</label>
                    <div className="text-lg font-semibold">{mission.teamSize} agents</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-foreground/60">Target</label>
                    <div className="text-lg font-semibold">{mission.target}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Start Date</label>
                    <div className="text-lg font-semibold flex items-center">
                      <Calendar className="size-4 mr-2" />
                      {mission.startDate}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">End Date</label>
                    <div className="text-lg font-semibold flex items-center">
                      <Calendar className="size-4 mr-2" />
                      {mission.endDate}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-foreground/60">Location</label>
                    <div className="text-lg font-semibold flex items-center">
                      <MapPin className="size-4 mr-2" />
                      {mission.location}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-foreground/60">Description</label>
                    <div className="text-base">{mission.description}</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-foreground/20">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="size-4 mr-2" />
                    Mission Progress
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Phase 1: Planning</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phase 2: Execution</span>
                      <span className="text-yellow-400">In Progress</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phase 3: Extraction</span>
                      <span className="text-gray-400">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}; 