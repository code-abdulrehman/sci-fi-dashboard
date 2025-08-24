import { useState, useEffect } from 'react';
import { Loading } from './loading';
import { Button } from './button';

export function LoadingTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);

  const simulateLoading = () => {
    setIsLoading(true);
    setData(null);
    
    // Simulate API call
    setTimeout(() => {
      setData('Data loaded successfully!');
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="bg-background/30 border border-primary/20 rounded-lg p-6">
      <h3 className="text-lg font-bold text-primary mb-4">Loading Test</h3>
      
      <Button 
        onClick={simulateLoading}
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? 'Loading...' : 'Simulate Loading'}
      </Button>

      {isLoading && (
        <div className="mb-4">
          <Loading size="md" text="Loading data..." />
        </div>
      )}

      {data && (
        <div className="bg-green-500/20 border border-green-500/30 rounded p-3">
          <p className="text-green-400 text-sm">{data}</p>
        </div>
      )}
    </div>
  );
} 