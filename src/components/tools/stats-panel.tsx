import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Target, Package, DollarSign, Shield } from "lucide-react";
import type { WeaponStats } from "./types";
import { formatPrice } from "./utils";

interface StatsPanelProps {
  stats: WeaponStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  return (
    <div className="mb-8">
      <div
        className={twMerge([
          "relative p-6",
          "[--color-frame-1-stroke:var(--color-primary)]/40",
          "[--color-frame-1-fill:var(--color-primary)]/8",
          "[--color-frame-2-stroke:var(--color-accent)]/30",
          "[--color-frame-2-fill:var(--color-accent)]/5",
        ])}
      >
        <Frame
          enableBackdropBlur
          className="drop-shadow-lg drop-shadow-primary/20"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","20","0"],["L","100% - 20","0"],["L","100% + 0","20"],["L","100% + 0","100% - 20"],["L","100% - 20","100% + 0"],["L","20","100% + 0"],["L","0","100% - 20"],["L","0","20"],["L","20","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","30","10"],["L","100% - 30","10"],["L","100% - 10","30"],["L","100% - 10","100% - 30"],["L","100% - 30","100% - 10"],["L","30","100% - 10"],["L","10","100% - 30"],["L","10","30"],["L","30","10"]]}]'
          )}
        />
        
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-shadow-lg text-shadow-primary mb-4">
            Arsenal Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Weapons */}
            <div className="flex items-center p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <Target className="size-6 mr-3 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Total Weapons</div>
                <div className="text-xl font-bold text-primary">{stats.totalWeapons}</div>
              </div>
            </div>
            
            {/* Available Stock */}
            <div className="flex items-center p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <Package className="size-6 mr-3 text-green-400" />
              <div>
                <div className="text-sm text-foreground/60">Available Stock</div>
                <div className="text-xl font-bold text-green-400">{stats.availableStock}</div>
              </div>
            </div>
            
            {/* Total Value */}
            <div className="flex items-center p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <DollarSign className="size-6 mr-3 text-accent" />
              <div>
                <div className="text-sm text-foreground/60">Total Value</div>
                <div className="text-xl font-bold text-accent">{formatPrice(stats.totalValue)}</div>
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex items-center p-4 rounded-lg bg-foreground/5 border border-foreground/10">
              <Shield className="size-6 mr-3 text-yellow-400" />
              <div>
                <div className="text-sm text-foreground/60">Categories</div>
                <div className="text-xl font-bold text-yellow-400">{Object.keys(stats.categories).length}</div>
              </div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="mt-6 pt-4 border-t border-foreground/20">
            <h3 className="text-sm font-medium text-foreground/80 mb-3">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 rounded bg-foreground/5 border border-foreground/10">
                  <span className="text-xs font-medium text-foreground/70 capitalize">{category}</span>
                  <span className="text-xs font-bold text-primary">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 