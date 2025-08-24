import { useState, useEffect } from 'react';
import { Button } from './button';
import { Frame } from './frame';
import { twMerge } from 'tailwind-merge';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
            className={twMerge([
                "relative backdrop-blur-xl sm:-mt-8 w-full max-w-5xl p-8",
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

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Welcome to Sci-Fi Dashboard
            </h1>
            <p className="text-sm opacity-70">
              UI Practice & Development Environment
            </p>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-background/30 border border-primary/20 rounded p-4">
              <h3 className="text-sm font-bold text-primary mb-2">🎯 Purpose</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                This dashboard is created exclusively for UI/UX practice and development purposes. 
                It serves as a demonstration of modern web technologies and design patterns.
              </p>
            </div>

            <div className="bg-background/30 border border-primary/20 rounded p-4">
              <h3 className="text-sm font-bold text-primary mb-2">🔒 Safety Notice</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                This is a non-functional demonstration site. No real data is processed, 
                no harmful content is present, and no assessments are conducted. 
                All displayed information is simulated for visual purposes only.
              </p>
            </div>

            <div className="bg-background/30 border border-primary/20 rounded p-4">
              <h3 className="text-sm font-bold text-primary mb-2">🛠️ Technologies</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                Built with React, TypeScript, Tailwind CSS, and modern web standards. 
                Features include error boundaries, lazy loading, and responsive design.
              </p>
            </div>

            <div className="bg-background/30 border border-primary/20 rounded p-4">
              <h3 className="text-sm font-bold text-primary mb-2">📱 Features</h3>
              <ul className="text-xs opacity-80 space-y-1">
                <li>• Real-time simulated data visualization</li>
                <li>• Responsive design across all devices</li>
                <li>• Error handling and recovery systems</li>
                <li>• Performance optimized with lazy loading</li>
                <li>• Accessibility compliant components</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <Button
              shape="default"
              onClick={onClose}
              className=" px-8"
            >
              I Understand - Continue
            </Button>
            <p className="text-xs opacity-50 mt-3">
              This message will not appear again in this session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 