import {
    EnhancedDefender,
    Weather,
    RadarCanvas,
    SignalLines,
    Spectrum,
    StatsPanel,
    LiveMap
} from "./index";
import { useState, useEffect, Suspense } from "react";
import { type RadarConfig, type Target } from "./radar_canvas";
import { Loading } from "@/components/ui";

function Dashboard() {
    const [config, setConfig] = useState<RadarConfig>({
        rangeKm: 15,
        sweepDegPerSec: 120,
        noise: 0.15,
        fadeSec: 0.3,
        paused: false
    });

    const [targets, setTargets] = useState<Target[]>([
        {
            id: '1',
            kind: 'ship',
            rKm: 3.5,
            bearing: 45,
            velDegPerSec: 2,
            vrKmPerSec: 0.01,
            detected: false
        },
        {
            id: '2',
            kind: 'air',
            rKm: 7.2,
            bearing: 180,
            velDegPerSec: 15,
            vrKmPerSec: -0.02,
            detected: false
        },
        {
            id: '3',
            kind: 'human',
            rKm: 1.8,
            bearing: 270,
            velDegPerSec: 5,
            vrKmPerSec: 0.005,
            detected: false
        },
        {
            id: '4',
            kind: 'ship',
            rKm: 5.5,
            bearing: 90,
            velDegPerSec: -3,
            vrKmPerSec: -0.015,
            detected: false
        },
        {
            id: '5',
            kind: 'air',
            rKm: 12.1,
            bearing: 135,
            velDegPerSec: 25,
            vrKmPerSec: 0.03,
            detected: false
        },
        {
            id: '6',
            kind: 'human',
            rKm: 0.8,
            bearing: 315,
            velDegPerSec: 3,
            vrKmPerSec: 0.002,
            detected: false
        }
    ]);

    const [stats, setStats] = useState({
        bearing: '000°',
        count: 0,
        scale: '1 pixel = ? m'
    });

    const [systemStatus, setSystemStatus] = useState({
        overall: 'operational',
        radar: 'online',
        communications: 'online',
        weapons: 'standby',
        sensors: 'active'
    });

    // Simulate system status updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStatus(prev => ({
                ...prev,
                radar: Math.random() > 0.95 ? 'warning' : 'online',
                communications: Math.random() > 0.98 ? 'error' : 'online',
                weapons: Math.random() > 0.9 ? 'active' : 'standby',
                sensors: Math.random() > 0.92 ? 'scanning' : 'active'
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
            case 'operational':
            case 'active':
            case 'scanning':
                return 'text-green-400';
            case 'standby':
            case 'warning':
                return 'text-yellow-400';
            case 'error':
            case 'offline':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="mt-30 font-roboto text-base min-h-screen">
            <div className="container mx-auto px-4 sm:px-0 flex flex-col gap-4">

                {/* Header with System Status */}
                <div className="bg-background/50 backdrop-blur-xl border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-shadow-lg text-shadow-primary">
                                Command Center Dashboard
                            </h1>
                            <p className="text-sm opacity-70">Real-time monitoring and control system</p>
                        </div>

                        <div className="md:flex items-center gap-6 hidden">
                            <div className="text-right">
                                <div className="text-sm opacity-70">System Status</div>
                                <div className={`font-bold ${getStatusColor(systemStatus.overall)}`}>
                                    {systemStatus.overall.toUpperCase()}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {(['radar', 'communications', 'weapons', 'sensors'] as const).map((system) => (
                                    <div key={system} className="text-center">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus[system]).replace('text-', 'bg-')} animate-pulse`}></div>
                                        <div className="text-xs opacity-70 mt-1">{system}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                        {/* Main Grid - Top Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-8 grid grid-rows-[auto_,_auto] gap-6">
                                <div className="mb-4">
                                    <Suspense fallback={<Loading size="md" text="Loading Enhanced Defender..." />}>
                                        <EnhancedDefender />
                                    </Suspense>
                                </div>
                                <div>
                                    <Suspense fallback={<Loading size="sm" text="Loading Weather..." />}>
                                        <Weather />
                                    </Suspense>
                                </div>
                            </div>
                            <div className="lg:col-span-4">
                                <Suspense fallback={<Loading size="sm" text="Loading Stats..." />}>
                                    <StatsPanel />
                                </Suspense>
                            </div>
                        </div>

                        {/* Main Grid - Middle Row */}

                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-8">
                            <div className="lg:col-span-6">
                                <Suspense fallback={<Loading size="md" text="Loading Signal Lines..." />}>
                                    <SignalLines />
                                </Suspense>
                            </div>
                            <div className="lg:col-span-4">
                                <Suspense fallback={<Loading size="md" text="Loading Spectrum..." />}>
                                    <Spectrum />
                                </Suspense>
                            </div>
                        </div>
                        {/* Main Grid - Bottom Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8 h-auto">
                            <div className="lg:col-span-12">
                                <Suspense fallback={<Loading size="lg" text="Loading Live Map..." />}>
                                    <LiveMap />
                                </Suspense>
                            </div>
                            <div className="lg:col-span-6">
                                {/* <Weather /> */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Suspense fallback={<Loading size="lg" text="Initializing Radar System..." />}>
                                    <RadarCanvas
                                        config={config}
                                        targets={targets}
                                        onTargetsChange={setTargets}
                                        onStatsChange={setStats}
                                        onConfigChange={setConfig}
                                    />
                                </Suspense>
                            </div>
                        </div>

                        <div className="bg-background/50 backdrop-blur-xl rounded-lg border border-primary/20 p-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="opacity-70">Targets: </span>
                                        <span className="font-mono">{stats.count}</span>
                                    </div>
                                    <div>
                                        <span className="opacity-70">Scale: </span>
                                        <span className="font-mono">{stats.scale}</span>
                                    </div>
                                    <div>
                                        <span className="opacity-70">Bearing: </span>
                                        <span className="font-mono">{stats.bearing}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="opacity-70">Last Updated: {new Date().toLocaleTimeString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                
        </div>
    );
}

export default Dashboard;
