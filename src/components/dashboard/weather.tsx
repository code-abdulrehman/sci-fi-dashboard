import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { useState, useEffect } from "react";
import { Wind, Droplet, CloudSun, Compass, Thermometer } from "lucide-react"

// Weather conditions for variety
const weatherConditions = [
    "Partly Cloudy", "Sunny", "Cloudy", "Light Rain", "Heavy Rain",
    "Thunderstorm", "Foggy", "Clear", "Overcast", "Drizzle"
];

// Wind directions
const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function WeatherDashboard() {
    const [weather, setWeather] = useState({
        temperature: 22,
        humidity: 68,
        wind: 14,
        direction: "NE",
        time: new Date(),
        condition: "Partly Cloudy",
    });

    // Update weather data every minute
    useEffect(() => {
        const updateWeather = () => {
            setWeather({
                temperature: Math.floor(Math.random() * 25) + 15, // 15-40°C
                humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
                wind: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
                direction: windDirections[Math.floor(Math.random() * windDirections.length)],
                time: new Date(),
                condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
            });
        };

        // Update immediately
        updateWeather();

        // Then update every 30s
        const interval = setInterval(updateWeather, 30000); // 60000ms = 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={twMerge([
                "relative backdrop-blur-xl sm:-mt-8 w-full ",
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
            <div className="relative px-10 py-10 flex flex-col items-center">
                <div className="mb-4 flex items-center gap-2 text-shadow-lg text-shadow-primary font-bold text-xl"><CloudSun className="text-primary w-5 h-5" /> {weather.condition}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full ">
                    {/* Temperature */}
                    <div className="flex flex-col items-center">
                        <div className="text-primary"><Thermometer /></div>
                        <div className="text-lg font-semibold mt-1">{weather.temperature}&deg;C</div>
                        <div className="opacity-60 text-xs mt-0.5 font-orbitron">Temperature</div>
                    </div>
                    {/* Humidity */}
                    <div className="flex flex-col items-center">
                        <div className="text-accent"><Droplet /></div>
                        <div className="text-lg font-semibold mt-1">{weather.humidity}%</div>
                        <div className="opacity-60 text-xs mt-0.5 font-orbitron">Humidity</div>
                    </div>
                    {/* Wind */}
                    <div className="flex flex-col items-center">
                        <div className="text-primary"><Wind /></div>
                        <div className="text-lg font-semibold mt-1">{weather.wind} km/h</div>
                        <div className="opacity-60 text-xs mt-0.5 font-orbitron">Wind</div>
                    </div>
                    {/* Direction */}
                    <div className="flex flex-col items-center">
                        <div className="text-accent"><Compass /></div>
                        <div className="text-lg font-semibold mt-1">{weather.direction}</div>
                        <div className="opacity-60 text-xs mt-0.5 font-orbitron">Direction</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherDashboard;
