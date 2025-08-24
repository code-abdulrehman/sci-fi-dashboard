import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { useState, useEffect } from "react";

interface StatsData {
  totalTargets: number;
  detectedTargets: number;
  alertTargets: number;
  systemStatus: 'online' | 'warning' | 'critical';
  uptime: string;
  lastScan: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  powerConsumption: number;
  temperature: number;
  signalStrength: number;
}

function StatsPanel() {
  const [stats, setStats] = useState<StatsData>({
    totalTargets: 0,
    detectedTargets: 0,
    alertTargets: 0,
    systemStatus: 'online',
    uptime: '00:00:00',
    lastScan: '00:00:00',
    threatLevel: 'low',
    powerConsumption: 0,
    temperature: 0,
    signalStrength: 0
  });

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalTargets: Math.floor(Math.random() * 20) + 5,
        detectedTargets: Math.floor(Math.random() * 8) + 2,
        alertTargets: Math.floor(Math.random() * 3),
        uptime: new Date().toLocaleTimeString(),
        lastScan: new Date().toLocaleTimeString(),
        powerConsumption: Math.floor(Math.random() * 40) + 60,
        temperature: Math.floor(Math.random() * 20) + 35,
        signalStrength: Math.floor(Math.random() * 30) + 70
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative backdrop-blur-xl sm:-mt-8 w-full">
      <div
        className={twMerge([
          " relative",
          "[--color-frame-1-stroke:var(--color-primary)]/50",
          "[--color-frame-1-fill:var(--color-primary)]/20",
          "[--color-frame-2-stroke:var(--color-accent)]",
          "[--color-frame-2-fill:var(--color-accent)]/20",
          "[--color-frame-3-stroke:var(--color-accent)]",
          "[--color-frame-3-fill:var(--color-accent)]/20",
          "[--color-frame-4-stroke:var(--color-accent)]",
          "[--color-frame-4-fill:var(--color-accent)]/20",
          "[--color-frame-5-stroke:var(--color-primary)]/23",
          "[--color-frame-5-fill:transparent]",
        ])}
      >
        <Frame
          className="drop-shadow-2xl drop-shadow-primary/50"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","37","12"],["L","0% + 59","12"],["L","0% + 85","0% + 33"],["L","79","0% + 12"],["L","50% - 3","12"],["L","50% + 16","30"],["L","100% - 35","30"],["L","100% - 16","47"],["L","100% - 16","100% - 47.05882352941177%"],["L","100% - 8","100% - 44.85294117647059%"],["L","100% - 9","100% - 16.666666666666668%"],["L","100% - 17","100% - 14.705882352941176%"],["L","100% - 17","100% - 30"],["L","100% - 34","100% - 12"],["L","50% + 13","100% - 12"],["L","50% + 15","100% - 26"],["L","50% - 11","100% - 12"],["L","37","100% - 12"],["L","19","100% - 30"],["L","19","0% + 50.490196078431374%"],["L","10","0% + 48.529411764705884%"],["L","10","0% + 20.098039215686274%"],["L","0% + 19.000000000000004","0% + 18.38235294117647%"],["L","19","29"],["L","37","12"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","50% + 10","15"],["L","50% + 19","15"],["L","50% + 24","0% + 20"],["L","50% + 16","0% + 20"],["L","50% + 10","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","50% + 25","15"],["L","50% + 34","15"],["L","50% + 40","0% + 21"],["L","50% + 31","0% + 21"],["L","50% + 25","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-4-stroke)","fill":"var(--color-frame-4-fill)"},"path":[["M","50% + 40","15"],["L","50% + 52","15"],["L","50% + 61","0% + 23"],["L","50% + 49","0% + 23"],["L","50% + 40","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-5-stroke)","fill":"var(--color-frame-5-fill)"},"path":[["M","36","3"],["L","0% + 58","0"],["L","0% + 84","0% + 40"],["L","81","0% + 0"],["L","50% - 1","4"],["L","50% + 5","6"],["L","50% + 54","7"],["L","50% + 74","23"],["L","100% - 32","21"],["L","100% - 8","42"],["L","100% - 9","100% - 52.450980392156865%"],["L","100% + 0","100% - 50.245098039215684%"],["L","100% + 0","100% - 15.196078431372548%"],["L","100% - 7","100% - 13.480392156862745%"],["L","100% - 7","100% - 27"],["L","100% - 29","100% - 3"],["L","50% + 14","100% + 0"],["L","50% + 21","100% - 31"],["L","50% - 13","100% + 0"],["L","37","100% - 4"],["L","11","100% - 28"],["L","10","0% + 55.3921568627451%"],["L","0","0% + 52.94117647058823%"],["L","1","0% + 18.627450980392158%"],["L","11","0% + 16.666666666666668%"],["L","11","25"],["L","36","3"]]}]'
          )}
        />
        <div className="relative px-8 py-10 flex flex-col justify-between h-full">
          <div className="text-center mb-6">
            <h3 className="text-xl text-shadow-lg text-shadow-primary font-bold">System Stats</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Target Stats */}
            <div className="space-y-3">
              <div className="bg-primary/10 p-3 rounded border border-primary/20">
                <div className="text-xs opacity-70">Total Targets</div>
                <div className="text-2xl font-bold text-primary">{stats.totalTargets}</div>
              </div>
              
              <div className="bg-accent/10 p-3 rounded border border-accent/20">
                <div className="text-xs opacity-70">Detected</div>
                <div className="text-2xl font-bold text-accent">{stats.detectedTargets}</div>
              </div>
              
              <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                <div className="text-xs opacity-70">Alerts</div>
                <div className="text-2xl font-bold text-red-400">{stats.alertTargets}</div>
              </div>
            </div>

            {/* System Stats */}
            <div className="space-y-3">
              <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                <div className="text-xs opacity-70">System Status</div>
                <div className={`text-lg font-bold ${getStatusColor(stats.systemStatus)}`}>
                  {stats.systemStatus.toUpperCase()}
                </div>
              </div>
              
              <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                <div className="text-xs opacity-70">Threat Level</div>
                <div className={`text-lg font-bold ${getThreatColor(stats.threatLevel)}`}>
                  {stats.threatLevel.toUpperCase()}
                </div>
              </div>
              
              <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                <div className="text-xs opacity-70">Signal Strength</div>
                <div className="text-lg font-bold text-purple-400">{stats.signalStrength}%</div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-background/50 p-2 rounded">
                <div className="opacity-70">Uptime</div>
                <div className="font-mono">{stats.uptime}</div>
              </div>
              <div className="bg-background/50 p-2 rounded">
                <div className="opacity-70">Power</div>
                <div className="font-mono">{stats.powerConsumption}%</div>
              </div>
              <div className="bg-background/50 p-2 rounded">
                <div className="opacity-70">Temp</div>
                <div className="font-mono">{stats.temperature}°C</div>
              </div>
            </div>
            
            <div className="bg-background/50 p-2 rounded">
              <div className="text-xs opacity-70">Last Scan</div>
              <div className="font-mono text-sm">{stats.lastScan}</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Power</span>
                <span>{stats.powerConsumption}%</span>
              </div>
              <div className="w-full bg-background/30 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.powerConsumption}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Signal</span>
                <span>{stats.signalStrength}%</span>
              </div>
              <div className="w-full bg-background/30 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.signalStrength}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel; 