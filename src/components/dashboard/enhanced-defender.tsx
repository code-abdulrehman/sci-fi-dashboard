import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Button } from "@/components/ui/button";
import { Chart, getColor } from "@/components/ui/chart";
import { useState, useEffect } from "react";

interface DefenderData {
  dailyActivity: number[];
  weeklyTrend: number[];
  monthlyComparison: number[];
  threatLevels: number[];
  systemEfficiency: number[];
  responseTimes: number[];
}

function EnhancedDefender() {
  const width = window.innerWidth > 768 ? 600 : 350;
  const height = 200;
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [defenderData, setDefenderData] = useState<DefenderData>({
    dailyActivity: [],
    weeklyTrend: [],
    monthlyComparison: [],
    threatLevels: [],
    systemEfficiency: [],
    responseTimes: []
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Generate comprehensive data
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let daysToShow = daysInMonth;
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      daysToShow = today.getDate();
    }

    const newData: DefenderData = {
      dailyActivity: Array.from({ length: daysToShow }, () => Math.floor(Math.random() * 900) + 100),
      weeklyTrend: Array.from({ length: 4 }, () => Math.floor(Math.random() * 5000) + 2000),
      monthlyComparison: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20000) + 10000),
      threatLevels: Array.from({ length: daysToShow }, () => Math.floor(Math.random() * 100)),
      systemEfficiency: Array.from({ length: daysToShow }, () => Math.floor(Math.random() * 30) + 70),
      responseTimes: Array.from({ length: daysToShow }, () => Math.floor(Math.random() * 500) + 100)
    };

    setDefenderData(newData);
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    if ((nextYear < today.getFullYear()) || (nextYear === today.getFullYear() && nextMonth <= today.getMonth())) {
      setCurrentMonth(nextMonth);
      setCurrentYear(nextYear);
    }
  };

  const isNextMonthDisabled = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    return nextYear > today.getFullYear() || (nextYear === today.getFullYear() && nextMonth > today.getMonth());
  };

  const getChartConfig = () => {
    const labels = viewMode === 'daily' 
      ? Array.from({ length: defenderData.dailyActivity.length }, (_, i) => String(i + 1).padStart(2, '0'))
      : viewMode === 'weekly' 
        ? weeks
        : months;

    const data = viewMode === 'daily' 
      ? defenderData.dailyActivity
      : viewMode === 'weekly' 
        ? defenderData.weeklyTrend
        : defenderData.monthlyComparison;

    return {
      type: "bar" as const,
      data: {
        labels,
        datasets: [
          {
            label: "Activity Level",
            maxBarThickness: 12,
            data,
            backgroundColor: () => getColor("--color-primary", 0.3),
            borderColor: () => getColor("--color-primary"),
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Orbitron',
                size: 10
              }
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: 'Orbitron',
                size: 10
              }
            }
          },
        },
      },
    };
  };

  const getMetricsData = () => {
    const avgThreat = defenderData.threatLevels.reduce((a, b) => a + b, 0) / defenderData.threatLevels.length;
    const avgEfficiency = defenderData.systemEfficiency.reduce((a, b) => a + b, 0) / defenderData.systemEfficiency.length;
    const avgResponse = defenderData.responseTimes.reduce((a, b) => a + b, 0) / defenderData.responseTimes.length;

    return { avgThreat, avgEfficiency, avgResponse };
  };

  const metrics = getMetricsData();

  return (
    <div className="relative backdrop-blur-xl sm:-mt-8 w-full">
      <div
        className={twMerge([
          "relative",
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
        <div className="relative px-8 py-6 flex flex-col justify-between h-full">
          {/* Header with Navigation and View Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button 
                shape="flat" 
                className="py-1 px-2 text-sm hover:bg-primary/20 transition-colors"
                onClick={handlePrevMonth}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </Button>
              <div className="text-center">
                <div className="text-lg text-shadow-lg text-shadow-primary font-bold">
                  {months[currentMonth]}
                </div>
                <div className="opacity-70 text-xs">{currentYear}</div>
              </div>
              <Button 
                shape="flat" 
                className="py-1 px-2 text-sm hover:bg-primary/20 transition-colors"
                onClick={handleNextMonth}
                disabled={isNextMonthDisabled()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-background/10 rounded p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
                <Button
                  key={mode}
                  shape="flat"
                  className={`py-1 px-2 text-xs transition-colors ${
                    viewMode === mode ? 'text-primary' : 'hover:bg-primary/10'
                  }`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
              <div className="text-xs opacity-70">Avg Threat</div>
              <div className="text-sm font-bold text-green-400">{Math.round(metrics.avgThreat)}%</div>
            </div>
            <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20">
              <div className="text-xs opacity-70">Efficiency</div>
              <div className="text-sm font-bold text-blue-400">{Math.round(metrics.avgEfficiency)}%</div>
            </div>
            <div className="bg-purple-500/10 p-2 rounded border border-purple-500/20">
              <div className="text-xs opacity-70">Response</div>
              <div className="text-sm font-bold text-purple-400">{Math.round(metrics.avgResponse)}ms</div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="flex-1 min-h-0">
            {defenderData.dailyActivity.length > 0 ? (
              <Chart
                key={`${currentMonth}-${currentYear}-${viewMode}`}
                config={getChartConfig()}
                width={width}
                height={height}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-50">
                <div className="text-sm">Loading chart data...</div>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Monitoring</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDefender; 