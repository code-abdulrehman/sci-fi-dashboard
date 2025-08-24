import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";

interface SpectrumData {
    frequency: number;
    amplitude: number;
    type: 'primary' | 'secondary' | 'noise' | 'peak';
}

interface SpectrumProps {
    className?: string;
    width?: number;
    height?: number;
}

const Spectrum = ({ 
    className = "", 
    width = window.innerWidth > 768 ? 500 : 350, 
    height = 200 
}: SpectrumProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spectrumData, setSpectrumData] = useState<SpectrumData[]>([]);
    const [isActive, setIsActive] = useState(true);

    // Utility functions
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

    // Generate spectrum data
    const generateSpectrumData = () => {
        const data: SpectrumData[] = [];
        const numBars = 64; // Number of frequency bins
        
        for (let i = 0; i < numBars; i++) {
            const frequency = (i / numBars) * 100; // 0-100 frequency range
            
            // Create different types of signals
            let amplitude = 0;
            let type: SpectrumData['type'] = 'noise';
            
            // Primary signal peaks
            if (frequency > 15 && frequency < 25) {
                amplitude = rnd(60, 90);
                type = 'primary';
            } else if (frequency > 45 && frequency < 55) {
                amplitude = rnd(70, 95);
                type = 'primary';
            } else if (frequency > 75 && frequency < 85) {
                amplitude = rnd(50, 80);
                type = 'primary';
            }
            // Secondary signals
            else if (frequency > 30 && frequency < 40) {
                amplitude = rnd(30, 60);
                type = 'secondary';
            } else if (frequency > 60 && frequency < 70) {
                amplitude = rnd(25, 55);
                type = 'secondary';
            }
            // Peak signals
            else if (frequency > 85 && frequency < 95) {
                amplitude = rnd(80, 100);
                type = 'peak';
            }
            // Background noise
            else {
                amplitude = rnd(5, 25);
                type = 'noise';
            }
            
            data.push({
                frequency,
                amplitude: clamp(amplitude, 0, 100),
                type
            });
        }
        
        return data;
    };

    // Get color based on signal type
    const getSpectrumColor = (type: SpectrumData['type'], amplitude: number): { color: string; glow: string } => {
        const intensity = amplitude / 100;
        
        switch (type) {
            case 'primary':
                return {
                    color: `rgba(20, 160, 230, ${0.5 + intensity * 0.5})`, // var(--color-primary)
                    glow: `rgba(20, 160, 230, ${0.3 + intensity * 0.4})`
                };
            case 'secondary':
                return {
                    color: `rgba(34, 197, 94, ${0.5 + intensity * 0.5})`, // Green
                    glow: `rgba(34, 197, 94, ${0.3 + intensity * 0.4})`
                };
            case 'peak':
                return {
                    color: `rgba(239, 68, 68, ${0.5 + intensity * 0.5})`, // Red
                    glow: `rgba(239, 68, 68, ${0.3 + intensity * 0.4})`
                };
            case 'noise':
                return {
                    color: `rgba(202, 65, 34, ${0.3 + intensity * 0.4})`, // var(--color-accent)
                    glow: `rgba(202, 65, 34, ${0.2 + intensity * 0.3})`
                };
            default:
                return {
                    color: `rgba(255, 255, 255, ${0.3 + intensity * 0.4})`,
                    glow: `rgba(255, 255, 255, ${0.2 + intensity * 0.3})`
                };
        }
    };

    // Initialize spectrum data
    useEffect(() => {
        setSpectrumData(generateSpectrumData());
    }, []);

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

            // Draw spectrum bars
            drawSpectrumBars(ctx, canvas, time);

            // Update time
            time += 0.016;
            animationId = requestAnimationFrame(frame);
        };

        if (isActive) {
            animationId = requestAnimationFrame(frame);
        }

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [spectrumData, isActive]);

    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const { width, height } = canvas;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(20, 160, 230, 0.2)'; // var(--color-primary)
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);

        // Vertical lines (frequency markers)
        for (let x = 0; x <= width; x += width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines (amplitude markers)
        for (let y = 0; y <= height; y += height / 5) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Frequency labels
        ctx.fillStyle = 'rgb(255, 255, 255)'; // var(--color-foreground)
        ctx.font = '10px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        
        for (let i = 0; i <= 10; i++) {
            const freq = (i * 100) / 10;
            const x = (i * width) / 10;
            ctx.fillText(`${freq.toFixed(0)}Hz`, x, height - 5);
        }

        // Amplitude labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const amplitude = 100 - (i * 20);
            const y = (i * height) / 5;
            ctx.fillText(`${amplitude}%`, width - 5, y + 10);
        }
    };

    const drawSpectrumBars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
        const { width, height } = canvas;
        const barWidth = width / spectrumData.length;
        const maxBarHeight = height * 0.8;

        spectrumData.forEach((data, index) => {
            // Add some animation to the amplitude
            const noise = Math.sin(time * 2 + index * 0.1) * 3;
            const animatedAmplitude = clamp(data.amplitude + noise, 0, 100);
            const barHeight = (animatedAmplitude / 100) * maxBarHeight;
            
            const x = index * barWidth;
            const y = height - barHeight;

            const color = getSpectrumColor(data.type, animatedAmplitude);

            ctx.save();

            // Draw bar glow
            ctx.shadowColor = color.glow;
            ctx.shadowBlur = 8;

            // Draw main bar
            ctx.fillStyle = color.color;
            ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

            // Draw bar highlight
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (animatedAmplitude / 100) * 0.3})`;
            ctx.fillRect(x + 1, y, barWidth - 2, Math.min(barHeight, 10));

            // Draw frequency marker for significant signals
            if (animatedAmplitude > 50) {
                ctx.strokeStyle = color.color;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(x + barWidth / 2, 0);
                ctx.lineTo(x + barWidth / 2, height);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.restore();
        });

        // Draw scanning line
        ctx.save();
        const scanX = ((time * 30) % width);
        ctx.strokeStyle = 'rgba(20, 160, 230, 0.8)'; // var(--color-primary)
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Draw peak indicators
        spectrumData.forEach((data, index) => {
            if (data.type === 'peak' && data.amplitude > 70) {
                const x = index * barWidth + barWidth / 2;
                const y = height - ((data.amplitude / 100) * maxBarHeight) - 15;

                ctx.save();
                ctx.fillStyle = 'rgb(239, 68, 68)'; // Red for peaks
                ctx.font = '8px "Orbitron", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('PEAK', x, y);
                ctx.restore();
            }
        });
    };

    return (
        <div className={twMerge([
            "relative backdrop-blur-xl w-full min-w-[320px]",
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
                    <h3 className="text-lg text-shadow-lg text-shadow-primary font-bold text-xl">Frequency Spectrum</h3>
                </div>

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className={`rounded-lg border border-primary/30 ${className}`}
                />

                <div className="mt-4 text-xs opacity-70 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(20,160,230)] rounded-full"></div>
                            <span>Primary</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(34,197,94)] rounded-full"></div>
                            <span>Secondary</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(239,68,68)] rounded-full"></div>
                            <span>Peak</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[rgb(202,65,34)] rounded-full"></div>
                            <span>Noise</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Spectrum;
