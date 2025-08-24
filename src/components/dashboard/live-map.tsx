import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { useState, useEffect, useRef } from "react";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'base' | 'target' | 'patrol' | 'threat';
  status: 'active' | 'inactive' | 'alert';
  lastUpdate: string;
}

function LiveMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Command Center',
      lat: 40.7128,
      lng: -74.0060,
      type: 'base',
      status: 'active',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      id: '2',
      name: 'Patrol Alpha',
      lat: 40.7589,
      lng: -73.9851,
      type: 'patrol',
      status: 'active',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      id: '3',
      name: 'Target Bravo',
      lat: 40.7505,
      lng: -73.9934,
      type: 'target',
      status: 'alert',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      id: '4',
      name: 'Threat Charlie',
      lat: 40.7829,
      lng: -73.9654,
      type: 'threat',
      status: 'alert',
      lastUpdate: new Date().toLocaleTimeString()
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [rerender, setRerender] = useState(0); // dummy state to force rerender

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prev => prev.map(loc => ({
        ...loc,
        lastUpdate: new Date().toLocaleTimeString(),
        lat: loc.type === 'patrol' ? loc.lat + (Math.random() - 0.5) * 0.001 : loc.lat,
        lng: loc.type === 'patrol' ? loc.lng + (Math.random() - 0.5) * 0.001 : loc.lng
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animation loop - use ref to avoid infinite re-renders
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      animationFrameRef.current += 1;
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Trigger re-renders for animation at a controlled rate
  useEffect(() => {
    const interval = setInterval(() => {
      setRerender(r => r + 1);
    }, 100); // Update every 100ms instead of every frame
    return () => clearInterval(interval);
  }, []);

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(20, 160, 230, 0)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw locations
    locations.forEach(location => {
      const x = ((location.lng + 74.1) / 0.2) * width;
      const y = ((40.9 - location.lat) / 0.2) * height;

      // Draw pulse effect for active locations
      if (location.status === 'active' || location.status === 'alert') {
        const pulseSize = 20 + Math.sin(animationFrameRef.current * 0.1) * 10;
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = getLocationColor(location.type);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw location marker
      ctx.save();
      ctx.fillStyle = getLocationColor(location.type);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      
      if (location.type === 'base') {
        // Draw square for base
        ctx.fillRect(x - 8, y - 8, 16, 16);
        ctx.strokeRect(x - 8, y - 8, 16, 16);
      } else if (location.type === 'patrol') {
        // Draw triangle for patrol
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x - 8, y + 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (location.type === 'target') {
        // Draw diamond for target
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x + 8, y);
        ctx.lineTo(x, y + 8);
        ctx.lineTo(x - 8, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (location.type === 'threat') {
        // Draw X for threat
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.moveTo(x + 8, y - 8);
        ctx.lineTo(x - 8, y + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw status indicator
      if (location.status === 'alert') {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x + 12, y - 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw label if selected
      if (selectedLocation === location.id) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(location.name, x, y - 20);
        ctx.fillText(location.lastUpdate, x, y + 25);
        ctx.restore();
      }
    });

    // Draw connection lines
    ctx.strokeStyle = 'rgba(20, 160, 230, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Connect base to patrols
    const base = locations.find(l => l.type === 'base');
    const patrols = locations.filter(l => l.type === 'patrol');
    
    if (base) {
      const baseX = ((base.lng + 74.1) / 0.2) * width;
      const baseY = ((40.9 - base.lat) / 0.2) * height;
      
      patrols.forEach(patrol => {
        const patrolX = ((patrol.lng + 74.1) / 0.2) * width;
        const patrolY = ((40.9 - patrol.lat) / 0.2) * height;
        
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(patrolX, patrolY);
        ctx.stroke();
      });
    }

    ctx.setLineDash([]);

  }, [locations, selectedLocation, rerender]); // Add rerender to trigger animation updates

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'base': return 'rgb(20, 160, 230)'; // Blue
      case 'patrol': return 'rgb(34, 197, 94)'; // Green
      case 'target': return 'rgb(234, 179, 8)'; // Yellow
      case 'threat': return 'rgb(239, 68, 68)'; // Red
      default: return 'rgb(156, 163, 175)'; // Gray
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicking on a location
    locations.forEach(location => {
      const locX = ((location.lng + 74.1) / 0.2) * canvas.width;
      const locY = ((40.9 - location.lat) / 0.2) * canvas.height;
      const distance = Math.hypot(x - locX, y - locY);

      if (distance <= 15) {
        setSelectedLocation(selectedLocation === location.id ? null : location.id);
      }
    });
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
        <div className="relative px-8 py-10 flex flex-col h-full">
          <div className="text-center mb-4">
            <h3 className="text-xl text-shadow-lg text-shadow-primary font-bold">Live Tracking</h3>
          </div>
          
          <div className=" relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={100}
              onClick={handleCanvasClick}
              className="w-full rounded cursor-crosshair border border-primary/20"
            />
          </div>

          {/* Legend */}
          <div className="mt-4 text-xs opacity-70">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 border border-white"></div>
                <span>Base</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 border border-white"></div>
                <span>Patrol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 border border-white"></div>
                <span>Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 border border-white"></div>
                <span>Threat</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs">Click markers for details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMap; 