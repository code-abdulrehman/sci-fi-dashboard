import { Button } from './button';
import { Frame } from './frame';
import { twMerge } from 'tailwind-merge';

interface ErrorPageProps {
  code: 400 | 404 | 500;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export function ErrorPage({ code, title, message, showHomeButton = true }: ErrorPageProps) {
  const errorConfig = {
    400: {
      title: title || 'Bad Request',
      message: message || 'The request could not be understood by the server due to malformed syntax.',
      icon: '⚠️',
      color: 'text-yellow-400'
    },
    404: {
      title: title || 'Page Not Found',
      message: message || 'The requested resource could not be found on this server.',
      icon: '🔍',
      color: 'text-blue-400'
    },
    500: {
      title: title || 'Internal Server Error',
      message: message || 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
      icon: '💥',
      color: 'text-red-400'
    }
  };

  const config = errorConfig[code];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
        
        <div className="relative z-10 text-center">
          {/* Error Code */}
          <div className="mb-6">
            <div className={`text-6xl font-bold ${config.color} mb-2`}>
              {code}
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              {config.title}
            </h1>
          </div>

          {/* Error Message */}
          <div className="bg-background/30 border border-primary/20 rounded p-6 mb-8">
            <p className="text-sm opacity-80 leading-relaxed">
              {config.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {showHomeButton && (
              <Button
                onClick={() => window.location.href = '/'}
                variant="default"
                shape="default"
              >
                Return Home
              </Button>
            )}
            <Button
              onClick={() => window.history.back()}
              variant="default"
              shape="flat"

            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
              shape="flat"
            >
              Reload Page
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-xs opacity-50 space-y-1">
            <div>Error Code: {code}</div>
            <div>Timestamp: {new Date().toLocaleString()}</div>
            <div>Session ID: {Date.now().toString(36)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific error page components
export function NotFoundPage(props?: Omit<ErrorPageProps, 'code'>) {
  return <ErrorPage code={404} {...props} />;
}

export function BadRequestPage(props?: Omit<ErrorPageProps, 'code'>) {
  return <ErrorPage code={400} {...props} />;
}

export function InternalServerErrorPage(props?: Omit<ErrorPageProps, 'code'>) {
  return <ErrorPage code={500} {...props} />;
} 