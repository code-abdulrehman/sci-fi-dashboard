import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";

export interface RadarConfig {
    rangeKm: number;
    sweepDegPerSec: number;
    noise: number;
    fadeSec: number;
    paused: boolean;
}

export interface Target {
    id: string;
    kind: 'ship' | 'air' | 'human';
    rKm: number;
    bearing: number;
    velDegPerSec: number;
    vrKmPerSec: number;
    detected?: boolean; // Whether object is currently detected by beams
}

export interface RadarCanvasProps {
    config: RadarConfig;
    targets: Target[];
    onTargetsChange: (targets: Target[]) => void;
    onStatsChange: (stats: { bearing: string; count: number; scale: string }) => void;
    onConfigChange?: (config: RadarConfig) => void;
    width?: number;
    height?: number;
    className?: string;
}

export interface RadarCanvasRef {
    addTarget: (kind: 'ship' | 'air' | 'human', rKm: number, bearing: number) => void;
    clearTargets: () => void;
    seedTargets: () => void;
}

const RadarCanvas = forwardRef<RadarCanvasRef, RadarCanvasProps>(({
    config,
    targets,
    onTargetsChange,
    onStatsChange,
    onConfigChange,
    width = window.innerWidth > 768 ? 800 : 400,
    height = window.innerWidth > 768 ? 800 : 400,
    className = ""
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [draggedTarget, setDraggedTarget] = useState<string | null>(null);

    // Utility functions
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
    const degToRad = (d: number) => d * Math.PI / 180;
    const radToDeg = (r: number) => r * 180 / Math.PI;

    const polarToXY = (rPx: number, angDeg: number, center: { x: number, y: number }) => {
        const t = degToRad(angDeg - 90);
        return {
            x: center.x + rPx * Math.cos(t),
            y: center.y + rPx * Math.sin(t)
        };
    };

    const xyToPolar = (x: number, y: number, center: { x: number, y: number }) => {
        const dx = x - center.x;
        const dy = y - center.y;
        const rPx = Math.hypot(dx, dy);
        const ang = (radToDeg(Math.atan2(dy, dx)) + 90 + 360) % 360;
        return { rPx, ang };
    };

    const metersPerPixel = (canvas: HTMLCanvasElement) => {
        const R = canvas.width / 2;
        const maxMeters = config.rangeKm * 1000;
        return maxMeters / (R * 0.92);
    };

    // Simple beam detection - check if target degree is within beam angle
    const isTargetInBeam = (targetDegree: number, beamAngle: number, beamWidth: number = 90) => {
        const normalizedTarget = (targetDegree + 360) % 360;
        const normalizedBeam = (beamAngle + 360) % 360;
        const halfBeam = beamWidth / 2;

        // Calculate the angular difference
        let diff = Math.abs(normalizedTarget - normalizedBeam);
        if (diff > 180) {
            diff = 360 - diff;
        }

        // Target is in beam if within half beam width
        return diff <= halfBeam;
    };

    // Get target value based on type and properties
    const getTargetValue = (target: Target): number => {
        let baseValue = 0;
        switch (target.kind) {
            case 'ship':
                baseValue = 50 + (target.rKm * 10) + Math.abs(target.velDegPerSec * 100);
                break;
            case 'air':
                baseValue = 100 + (target.rKm * 20) + Math.abs(target.velDegPerSec * 200);
                break;
            case 'human':
                baseValue = 10 + (target.rKm * 5) + Math.abs(target.velDegPerSec * 50);
                break;
        }
        return Math.round(baseValue);
    };

    // Get color based on target value
    const getTargetColor = (value: number): { color: string; glow: string } => {
        if (value < 50) {
            return {
                color: 'rgb(34, 197, 94)', // Green for low value
                glow: 'rgba(34, 197, 94, 0.5)'
            };
        } else if (value < 100) {
            return {
                color: 'rgb(234, 179, 8)', // Yellow for medium value
                glow: 'rgba(234, 179, 8, 0.5)'
            };
        } else if (value < 200) {
            return {
                color: 'rgb(239, 68, 68)', // Red for high value
                glow: 'rgba(239, 68, 68, 0.5)'
            };
        } else {
            return {
                color: 'rgb(168, 85, 247)', // Purple for very high value
                glow: 'rgba(168, 85, 247, 0.5)'
            };
        }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        addTarget: (kind: 'ship' | 'air' | 'human', rKm: number, bearing: number) => {
            const dir = (Math.random() < 0.5 ? -1 : 1) * rnd(0, 60);
            const drift = rnd(-0.02, 0.02);

            const newTarget: Target = {
                id: Math.random().toString(36).slice(2),
                kind,
                rKm,
                bearing: bearing,
                velDegPerSec: dir / 3.6,
                vrKmPerSec: drift,
                detected: false
            };              

            onTargetsChange([...targets, newTarget]);
        },

        clearTargets: () => {
            onTargetsChange([]);
        },

        seedTargets: () => {
            const newTargets: Target[] = [];

            // Add ships
            for (let i = 0; i < 4; i++) {
                const target: Target = {
                    id: Math.random().toString(36).slice(2),
                    kind: 'ship',
                    rKm: rnd(0.5, config.rangeKm * 0.8),
                    bearing: rnd(0, 360),
                    velDegPerSec: rnd(-10, 10) / 3.6,
                    vrKmPerSec: rnd(-0.02, 0.02),
                    detected: false
                };
                newTargets.push(target);
            }

            // Add aircraft
            for (let i = 0; i < 3; i++) {
                const target: Target = {
                    id: Math.random().toString(36).slice(2),
                    kind: 'air',
                    rKm: rnd(2, config.rangeKm * 0.95),
                    bearing: rnd(0, 360),
                    velDegPerSec: rnd(-50, 50) / 3.6,
                    vrKmPerSec: rnd(-0.02, 0.02),
                    detected: false
                };
                newTargets.push(target);
            }

            // Add humans
            for (let i = 0; i < 2; i++) {
                const target: Target = {
                    id: Math.random().toString(36).slice(2),
                    kind: 'human',
                    rKm: rnd(0.1, config.rangeKm * 0.3),
                    bearing: rnd(0, 360),
                    velDegPerSec: rnd(-5, 5) / 3.6,
                    vrKmPerSec: rnd(-0.01, 0.01),
                    detected: false
                };
                newTargets.push(target);
            }

            onTargetsChange(newTargets);
        }
    }));

    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const R = canvas.width / 2;
        const center = { x: R, y: R };

        // Background glow using theme colors
        ctx.save();
        const grd = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, R);
        grd.addColorStop(0, 'rgba(20, 160, 230, 0.15)'); // var(--color-primary) with opacity
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(center.x, center.y, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Rings using theme colors
        ctx.strokeStyle = 'rgb(20, 160, 230)'; // var(--color-primary)
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        const rings = 5;
        for (let i = 1; i <= rings; i++) {
            const r = (R * 0.92) * (i / rings);
            ctx.beginPath();
            ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Cross lines using theme colors
        ctx.strokeStyle = 'rgb(202, 65, 34)'; // var(--color-accent)
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const a = i * 90;
            const p1 = polarToXY(R * 0.92, a, center);
            const p2 = polarToXY(R * 0.92, a + 180, center);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        // Bearing ticks using theme colors
        ctx.fillStyle = 'rgb(255, 255, 255)'; // var(--color-foreground)
        ctx.font = '12px "Orbitron", sans-serif';
        for (let a = 0; a < 360; a += 30) {
            const pOuter = polarToXY(R * 0.92, a, center);
            const pInner = polarToXY(R * 0.88, a, center);
            ctx.strokeStyle = 'rgb(20, 160, 230)'; // var(--color-primary)
            ctx.beginPath();
            ctx.moveTo(pInner.x, pInner.y);
            ctx.lineTo(pOuter.x, pOuter.y);
            ctx.stroke();

            const label = (a === 0 ? '000' : String(a).padStart(3, '0')) + '°';
            const pLbl = polarToXY(R * 0.80, a, center);
            ctx.save();
            ctx.translate(pLbl.x, pLbl.y);
            ctx.rotate(degToRad(a));
            ctx.textAlign = 'center';
            ctx.fillText(label, 0, 0);
            ctx.restore();
        }

        // Range labels
        const kmPerRing = (config.rangeKm / 5);
        ctx.textAlign = 'center';
        for (let i = 1; i <= 5; i++) {
            const r = (R * 0.92) * (i / 5);
            const text = (kmPerRing * i).toFixed(0) + ' km';
            ctx.fillText(text, center.x, center.y - r - 6);
        }
    };

    const drawBeam = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, angle: number) => {
        const R = canvas.width / 2;
        const center = { x: R, y: R };

        // Draw single beam covering 90 degrees (1/4 of circle)
        const beamWidth = 45; // 90 degrees

        // Beam 1
        ctx.save();
        const grad1 = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, R * 0.92);
        grad1.addColorStop(0, 'rgba(20, 160, 230, 0.3)'); // var(--color-primary)
        grad1.addColorStop(1, 'rgba(136, 215, 255, 0)');
        ctx.fillStyle = grad1;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.arc(center.x, center.y, R * 0.92, degToRad(angle - beamWidth / 2), degToRad(angle + beamWidth / 2));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let angle = 0;
        let animationId: number;

        const frame = () => {
            // Clear canvas with transparent background
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGrid(ctx, canvas);

            if (!config.paused) {
                angle = (angle + config.sweepDegPerSec * 0.016) % 360;
                drawBeam(ctx, canvas, angle);
                drawTargets(ctx, canvas, angle);
            } else {
                drawBeam(ctx, canvas, angle);
                drawTargets(ctx, canvas, angle);
            }

            animationId = requestAnimationFrame(frame);
        };

        animationId = requestAnimationFrame(frame);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [config.rangeKm, config.sweepDegPerSec, config.noise, config.fadeSec, config.paused]);

    // Separate effect for target updates to prevent unnecessary re-renders
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const mpp = metersPerPixel(canvas);
        onStatsChange({
            bearing: '000°',
            count: targets.length,
            scale: `1 px = ${mpp.toFixed(1)} m`
        });
    }, [targets.length]);

    // Handle canvas click - simple target addition
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        const R = canvas.width / 2;
        const center = { x: R, y: R };

        const { rPx, ang } = xyToPolar(x, y, center);
        const mpp = metersPerPixel(canvas);
        const rKm = (rPx * mpp) / 1000;

        let kind: 'ship' | 'air' | 'human' = 'ship';
        if (e.shiftKey) {
            kind = 'air';
        } else if (e.ctrlKey) {
            kind = 'human';
        }

        // Add target directly with the clicked position
        const dir = (Math.random() < 0.5 ? -1 : 1) * rnd(0, 60);
        const drift = rnd(-0.02, 0.02);

        const newTarget: Target = {
            id: Math.random().toString(36).slice(2),
            kind,
            rKm: clamp(rKm, 0.1, config.rangeKm * 0.98),
            bearing: ang,
            velDegPerSec: dir / 3.6,
            vrKmPerSec: drift,
            detected: false
        };

        onTargetsChange([...targets, newTarget]);
    };

    // Handle mouse down for dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        const R = canvas.width / 2;
        const center = { x: R, y: R };

        // Check if clicking on a target
        const mpp = metersPerPixel(canvas);
        const scale = 1 / mpp;

        for (const target of targets) {
            const targetRpx = (target.rKm * 1000) * scale;
            const targetPos = polarToXY(targetRpx, target.bearing, center);
            const distance = Math.hypot(x - targetPos.x, y - targetPos.y);

            if (distance <= 15) { // Click radius
                setDraggedTarget(target.id);
                break;
            }
        }
    };

    // Handle mouse move for dragging
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggedTarget) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        const R = canvas.width / 2;
        const center = { x: R, y: R };

        const { rPx, ang } = xyToPolar(x, y, center);
        const mpp = metersPerPixel(canvas);
        const rKm = (rPx * mpp) / 1000;

        // Update target position
        const updatedTargets = targets.map(t =>
            t.id === draggedTarget
                ? { ...t, rKm: clamp(rKm, 0.1, config.rangeKm * 0.98), bearing: ang }
                : t
        );
        onTargetsChange(updatedTargets);
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setDraggedTarget(null);
    };

    // Simple target drawing function
    const drawTargets = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, angle: number) => {
        const R = canvas.width / 2;
        const center = { x: R, y: R };
        const mpp = metersPerPixel(canvas);
        const scale = 1 / mpp;
        const maxRpx = R * 0.92;

        // Update targets and check detection
        const updatedTargets = targets.map(t => {
            const newBearing = (t.bearing + t.velDegPerSec * 0.016) % 360;
            const newRKm = clamp(t.rKm + t.vrKmPerSec * 0.016, 0.1, config.rangeKm * 0.98);

            // Check if target is in beam using bearing (current position)
            const detected = isTargetInBeam(newBearing, angle, 90);

            return {
                ...t,
                bearing: newBearing,
                rKm: newRKm,
                detected: detected
            };
        });

        // Only update state if there are actual changes
        const hasChanges = updatedTargets.some((target, index) => {
            const original = targets[index];
            return target.bearing !== original.bearing ||
                target.rKm !== original.rKm ||
                target.detected !== original.detected;
        });

        if (hasChanges) {
            onTargetsChange(updatedTargets);
        }

        // Draw targets - ONLY show when currently detected by beam
        updatedTargets.forEach(t => {
            const rPx = (t.rKm * 1000) * scale;
            const ang = t.bearing;

            // Only draw targets that are currently in the beam
            if (t.detected) {
                const p = polarToXY(rPx, ang, center);
                const targetValue = getTargetValue(t);
                const valueColor = getTargetColor(targetValue);

                ctx.save();
                ctx.globalAlpha = 1.0; // Full opacity when in beam

                // Draw glow
                ctx.shadowColor = valueColor.glow;
                ctx.shadowBlur = 20;

                // Draw target circle with color based on value
                ctx.fillStyle = valueColor.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
                ctx.fill();

                // Draw target type indicator
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();

                // Draw target label
                ctx.fillStyle = valueColor.color;
                ctx.font = '10px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const label = t.kind === 'ship' ? 'S' : t.kind === 'air' ? 'A' : 'H';
                ctx.fillText(label, p.x, p.y);

                // Draw value
                ctx.font = '8px "Orbitron", sans-serif';
                ctx.fillText(targetValue.toString(), p.x, p.y + 15);

                // Draw direction indicator
                ctx.strokeStyle = valueColor.color;
                ctx.lineWidth = 2;
                const directionLength = 20;
                const directionEnd = polarToXY(rPx + directionLength, ang, center);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(directionEnd.x, directionEnd.y);
                ctx.stroke();

                // Draw bearing text
                ctx.font = '8px "Orbitron", sans-serif';
                ctx.fillText(`${Math.round(ang)}°`, p.x, p.y - 20);

                // Draw distance text
                ctx.fillText(`${t.rKm.toFixed(1)}km`, p.x, p.y - 30);

                ctx.restore();
            }

            // Draw alert indicator for objects within 4km (even if not detected)
            if (t.rKm <= 4) {
                const p = polarToXY(rPx, ang, center);
                ctx.save();
                ctx.globalAlpha = 0.8;

                // Alert triangle
                ctx.fillStyle = 'rgb(239, 68, 68)'; // Red alert
                ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
                ctx.shadowBlur = 15;

                const alertSize = 12;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - alertSize);
                ctx.lineTo(p.x - alertSize / 2, p.y + alertSize / 2);
                ctx.lineTo(p.x + alertSize / 2, p.y + alertSize / 2);
                ctx.closePath();
                ctx.fill();

                // Alert text
                ctx.fillStyle = 'rgb(239, 68, 68)';
                ctx.font = '10px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('ALERT', p.x, p.y + 25);

                ctx.restore();
            }

            // Noise blips using theme colors
            if (Math.random() < config.noise * 0.016) {
                const noiseR = rnd(0.1, maxRpx);
                const noiseA = rnd(0, 360);
                const p = polarToXY(noiseR, noiseA, center);
                ctx.save();
                ctx.globalAlpha = rnd(0.25, 0.6);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, rnd(2, 4), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // Update stats
        const mppForStats = metersPerPixel(canvas);
        const detectedCount = updatedTargets.filter(t => t.detected).length;
        const alertCount = updatedTargets.filter(t => t.rKm <= 4).length;
        onStatsChange({
            bearing: String(Math.round((angle + 360) % 360)).padStart(3, '0') + '°',
            count: detectedCount,
            scale: `1 px = ${mppForStats.toFixed(1)} m | Alerts: ${alertCount}`
        });
    };

    return (
        <div
            className={twMerge([
                "h-full relative backdrop-blur-xl w-full min-w-[320px]",
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
                    <h3 className="text-xl text-shadow-lg text-shadow-primary font-bold">Advanced Radar System</h3>
                    <p className="text-xs opacity-70 mt-1">Range: {config.rangeKm}km | Sweep: {config.sweepDegPerSec}°/s</p>
                </div>
                
                <div className="flex-1 relative flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={width}
                        height={height}
                        onClick={handleCanvasClick}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className={`rounded-lg cursor-crosshair ${className}`}
                    />
                </div>

                {/* Enhanced Legend */}
                <div className="mt-4 text-xs opacity-70">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[rgb(20,160,230)] rounded-full"></div>
                                    <span>Ships</span>
                                </div>
                                <span className="font-mono">{targets.filter(t => t.kind === 'ship').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[rgb(202,65,34)] rounded-full"></div>
                                    <span>Aircraft</span>
                                </div>
                                <span className="font-mono">{targets.filter(t => t.kind === 'air').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[rgb(255,255,255)] rounded-full"></div>
                                    <span>Humans</span>
                                </div>
                                <span className="font-mono">{targets.filter(t => t.kind === 'human').length}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Low Threat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span>Medium</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>High</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Critical</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-center">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 animate-pulse"></div>
                            <span>Alert Zone (≤4km)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 animate-pulse"></div>
                            <span>Active Beam</span>
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="mt-4 flex justify-center gap-2">
                    <button
                        onClick={() => onConfigChange?.({ ...config, paused: !config.paused })}
                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                            config.paused 
                                ? 'bg-green-500/20 border-green-500/40 text-green-400' 
                                : 'bg-red-500/20 border-red-500/40 text-red-400'
                        }`}
                    >
                        {config.paused ? 'RESUME' : 'PAUSE'}
                    </button>
                    <button
                        onClick={() => onConfigChange?.({ ...config, rangeKm: config.rangeKm === 15 ? 10 : 15 })}
                        className="px-3 py-1 text-xs rounded border border-primary/40 bg-primary/20 text-primary"
                    >
                        RANGE: {config.rangeKm}KM
                    </button>
                </div>
            </div>
        </div>
    );
});

RadarCanvas.displayName = 'RadarCanvas';

export default RadarCanvas;
