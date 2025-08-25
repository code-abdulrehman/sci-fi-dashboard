import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";

interface SignalData {
    id: string;
    frequency: number;
    strength: number;
    type: 'radar' | 'communication' | 'interference' | 'unknown';
    active: boolean;
}

interface SignalLinesProps {
    className?: string;
    width?: number;
    height?: number;
}

const SignalLines = ({ 
    className = "", 
    width = window.innerWidth > 768 ? 700 : 350, 
    height = 200 
}: SignalLinesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [signals] = useState<SignalData[]>([
        {
            id: '1',
            frequency: 2.4,
            strength: 85,
            type: 'radar',
            active: true
        },
        {
            id: '2',
            frequency: 5.8,
            strength: 62,
            type: 'communication',
            active: true
        },
        {
            id: '3',
            frequency: 1.2,
            strength: 45,
            type: 'interference',
            active: false
        },
        {
            id: '4',
            frequency: 3.6,
            strength: 78,
            type: 'unknown',
            active: true
        }
    ]);

    // Utility functions
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

    // Get color based on signal type
    const getSignalColor = (type: SignalData['type']): { color: string; glow: string } => {
        switch (type) {
            case 'radar':
                return {
                    color: 'rgb(20, 160, 230)', // var(--color-primary)
                    glow: 'rgba(20, 160, 230, 0.5)'
                };
            case 'communication':
                return {
                    color: 'rgb(34, 197, 94)', // Green
                    glow: 'rgba(34, 197, 94, 0.5)'
                };
            case 'interference':
                return {
                    color: 'rgb(239, 68, 68)', // Red
                    glow: 'rgba(239, 68, 68, 0.5)'
                };
            case 'unknown':
                return {
                    color: 'rgb(202, 65, 34)', // var(--color-accent)
                    glow: 'rgba(202, 65, 34, 0.5)'
                };
            default:
                return {
                    color: 'rgb(255, 255, 255)', // White
                    glow: 'rgba(255, 255, 255, 0.5)'
                };
        }
    };

    // Get signal type label
    const getSignalLabel = (type: SignalData['type']): string => {
        switch (type) {
            case 'radar': return 'RADAR';
            case 'communication': return 'COMM';
            case 'interference': return 'INTF';
            case 'unknown': return 'UNKN';
            default: return 'SIG';
        }
    };

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const frame = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background grid
            drawGrid(ctx, canvas);

            // Draw signal lines
            drawSignalLines(ctx, canvas, time);

            // Update time
            time += 0.016;
            animationId = requestAnimationFrame(frame);
        };

        animationId = requestAnimationFrame(frame);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [signals]);

    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const { width, height } = canvas;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(20, 160, 230, 0.3)'; // var(--color-primary)
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);

        // Vertical lines
        for (let x = 0; x <= width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Frequency labels
        ctx.fillStyle = 'rgb(255, 255, 255)'; // var(--color-foreground)
        ctx.font = '10px "Orbitron", sans-serif';
        ctx.textAlign = 'left';
        
        const maxFreq = 6;
        for (let i = 0; i <= 6; i++) {
            const freq = (i * maxFreq) / 6;
            const x = (i * width) / 6;
            ctx.fillText(`${freq.toFixed(1)}GHz`, x + 5, height - 5);
        }

        // Strength labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 10; i++) {
            const strength = 100 - (i * 5);
            const y = (i * height) / 5;
            ctx.fillText(`${strength}%`, width - 2.5, y + 5);
        }
    };

    const drawSignalLines = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
        const { width, height } = canvas;

        signals.forEach((signal, index) => {
            if (!signal.active) return;

            const color = getSignalColor(signal.type);
            const freqX = (signal.frequency / 6) * width;

            // Add some noise to the signal
            const noise = Math.sin(time * 2 + index) * 3;
            const dynamicStrength = clamp(signal.strength + noise, 0, 100);
            const dynamicY = height - ((dynamicStrength / 100) * height);

            ctx.save();

            // Draw signal line
            ctx.strokeStyle = color.color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color.glow;
            ctx.shadowBlur = 10;

            // Create animated signal line
            ctx.beginPath();
            ctx.moveTo(0, dynamicY);
            
            // Draw wavy line
            for (let x = 0; x <= freqX; x += 2) {
                const wave = Math.sin(time * 3 + x * 0.02) * 2;
                const y = dynamicY + wave;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();

            // Draw signal peak
            ctx.fillStyle = color.color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(freqX, dynamicY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Draw signal label
            ctx.fillStyle = color.color;
            ctx.font = '12px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 5;
            ctx.fillText(getSignalLabel(signal.type), freqX, dynamicY - 15);
            ctx.fillText(`${signal.frequency.toFixed(1)}GHz`, freqX, dynamicY + 25);

            // Draw strength indicator
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '10px "Orbitron", sans-serif';
            ctx.fillText(`${Math.round(dynamicStrength)}%`, freqX + 30, dynamicY);

            ctx.restore();

            // Draw frequency marker
            ctx.save();
            ctx.strokeStyle = color.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(freqX, 0);
            ctx.lineTo(freqX, height);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        });

        // Draw real-time scanning line
        ctx.save();
        const scanX = ((time * 50) % width);
        ctx.strokeStyle = 'rgba(20, 160, 230, 0.8)'; // var(--color-primary)
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    };

    return (
        <div className={twMerge([
            "relative backdrop-blur-xl w-full min-w-[320px] h-full",
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
        ])}>
            <Frame
                className="drop-shadow-2xl drop-shadow-primary/50"
                paths={JSON.parse(
                    '[{"show":false,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","32","12"],["L","50% - 94","12"],["L","50% - 77","0% + 29.5"],["L","50% + 74","0% + 29.5"],["L","50% + 91","12"],["L","100% - 30","12"],["L","100% - 11","29"],["L","100% - 11","0% + 30.37037037037037%"],["L","100% - 20","0% + 32.592592592592595%"],["L","100% - 20","100% - 32.098765432098766%"],["L","100% - 11","100% - 29.62962962962963%"],["L","100% - 11","100% - 27"],["L","100% - 28","100% - 10"],["L","50% + 80","100% - 10"],["L","50% + 84","100% - 30"],["L","50% + 70","100% - 18"],["L","50% - 75","100% - 18"],["L","50% - 82","100% - 10"],["L","26","100% - 10"],["L","9","100% - 27"],["L","9","100% - 29.62962962962963%"],["L","17","100% - 31.85185185185185%"],["L","18","0% + 32.839506172839506%"],["L","8","0% + 30.370370370370356%"],["L","8","29"],["L","21","18"],["L","42","31"],["L","32","12"]]},{"show":false,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","50% - 81","15"],["L","50% - 74","15"],["L","50% - 69","0% + 19.5"],["L","50% - 76","0% + 19.5"],["L","50% - 81","15"]]},{"show":false,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","50% - 68.00000000000001","15"],["L","50% - 58","15"],["L","50% - 52","0% + 21.5"],["L","50% - 61","0% + 21.5"],["L","50% - 68.00000000000001","15"]]},{"show":false,"style":{"strokeWidth":"1","stroke":"var(--color-frame-4-stroke)","fill":"var(--color-frame-4-fill)"},"path":[["M","50% - 53","15"],["L","50% + 80","15"],["L","50% + 71","0% + 23.5"],["L","50% - 43","0% + 23.5"],["L","50% - 53","15"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-5-stroke)","fill":"var(--color-frame-5-fill)"},"path":[["M","26","0"],["L","50% - 93","0"],["L","50% - 83","0% + 7.5"],["L","50% + 83.99999999999994","0% + 7.5"],["L","50% + 92.99999999999994","0"],["L","100% - 25","0"],["L","100% + 0","24"],["L","100% - 0","0% + 34.074074074074076%"],["L","100% - 12","0% + 37.03703703703704%"],["L","100% - 12","100% - 33.58024691358025%"],["L","100% + 0","100% - 30.617283950617285%"],["L","100% + 0","100% - 27"],["L","100% - 25","100% + 0"],["L","50% + 71","100% + 0"],["L","50% + 92","100% - 32"],["L","50% + 64","100% - 10"],["L","50% - 65.99999999999997","100% - 11"],["L","50% - 78","100% + 0"],["L","22","100% + 0"],["L","0","100% - 22"],["L","0","100% - 34.074074074074076%"],["L","9","100% - 36.2962962962963%"],["L","9","0% + 33.82716049382717%"],["L","0","0% + 31.604938271604937%"],["L","0","19"],["L","15","10"],["L","40","41"],["L","26","0"]]}]'
                )}
            />
            <div className="relative px-8 py-10 flex flex-col items-center">
                <div className="mb-4 text-center">
                    <h3 className="text-lg text-shadow-lg text-shadow-primary font-bold text-xl">Signal Detection</h3>
                </div>

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className={`rounded-lg border border-primary/30 ${className}`}
                />
                <div className="mt-4 text-xs opacity-70 text-center ">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(20,160,230)] rounded-full"></div>
                            <span>Radar</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(202,65,34)] rounded-full"></div>
                            <span>Communication</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(239,68,68)] rounded-full"></div>
                            <span>Interference</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(255,255,255)] rounded-full"></div>
                            <span>Unknown</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SignalLines;
