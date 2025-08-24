import { Button } from "@/components/ui/button";
import type { Asset } from "./types";
import { getStatusColor } from "./utils";
import { Eye, Calendar, MapPin, Shield } from "lucide-react";

interface AssetTableProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
}

export const AssetTable = ({ assets, onAssetClick }: AssetTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-shadow-lg text-shadow-primary">
          Human Assets
        </h2>
        <div className="text-sm text-foreground/60">
          Total: {assets.length} agents
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/20">
              <th className="text-left py-3 px-4 font-medium">Agent</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Clearance</th>
              <th className="text-left py-3 px-4 font-medium">Department</th>
              <th className="text-left py-3 px-4 font-medium">Last Seen</th>
              <th className="text-left py-3 px-4 font-medium">Location</th>
              <th className="text-center py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr 
                key={asset.id} 
                className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors cursor-pointer"
                onClick={() => onAssetClick(asset)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-foreground/60">{asset.specialty}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Shield className="size-4 inline mr-1" />
                  {asset.clearance}
                </td>
                <td className="py-3 px-4">{asset.department}</td>
                <td className="py-3 px-4">
                  <Calendar className="size-4 inline mr-1" />
                  {asset.lastSeen}
                </td>
                <td className="py-3 px-4">
                  <MapPin className="size-4 inline mr-1" />
                  {asset.location}
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    shape="flat"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssetClick(asset);
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