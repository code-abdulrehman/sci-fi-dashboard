interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text = 'Loading...', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative">
        {/* Simple animated spinner */}
        <div className={`${sizeClasses[size]} border-2 border-primary/30 border-t-primary rounded-full animate-spin`}></div>
        
        {/* Center dot */}
        <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]}`}>
          <div className="w-1/3 h-1/3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className={`${textSizes[size]} font-mono text-primary animate-pulse`}>
          {text}
        </div>
        <div className="flex gap-1 mt-2 justify-center">
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }: Omit<LoadingProps, 'text'>) {
  return <Loading size={size} text="" className={className} />;
} 