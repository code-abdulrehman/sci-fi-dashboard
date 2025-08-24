import { DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogTitle, DialogDescription, DialogCloseTrigger, Portal } from "@/components/ui/dialog";
import type { Asset } from "./types";
import { getStatusColor } from "./utils";
import { Calendar, MapPin, Shield, Activity } from "lucide-react";

interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const AssetModal = ({ asset, onClose }: AssetModalProps) => {
  if (!asset) return null;

  return (
    <DialogRoot open={!!asset} onOpenChange={onClose}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="max-w-4xl">
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Agent Name</label>
                    <div className="text-lg font-semibold">{asset.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Status</label>
                    <div className={`text-lg font-semibold ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Clearance Level</label>
                    <div className="text-lg font-semibold flex items-center">
                      <Shield className="size-4 mr-2" />
                      {asset.clearance}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Department</label>
                    <div className="text-lg font-semibold">{asset.department}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Specialty</label>
                    <div className="text-lg font-semibold">{asset.specialty}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Last Seen</label>
                    <div className="text-lg font-semibold flex items-center">
                      <Calendar className="size-4 mr-2" />
                      {asset.lastSeen}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-foreground/60">Current Location</label>
                    <div className="text-lg font-semibold flex items-center">
                      <MapPin className="size-4 mr-2" />
                      {asset.location}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-foreground/20">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="size-4 mr-2" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status Update</span>
                      <span className="text-foreground/60">2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location Report</span>
                      <span className="text-foreground/60">6 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mission Assignment</span>
                      <span className="text-foreground/60">1 day ago</span>
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