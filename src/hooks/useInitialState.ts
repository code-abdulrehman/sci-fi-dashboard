import { useState, useEffect } from 'react';

const SESSION_KEY = 'dashboard-welcome-seen';

export function useInitialState() {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check session storage for welcome modal state
    const seen = sessionStorage.getItem(SESSION_KEY);
    const hasSeen = seen === 'true';
    
    setHasSeenWelcome(hasSeen);
    
    // Show modal if user hasn't seen it
    if (!hasSeen) {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setHasSeenWelcome(true);
    // Save to session storage
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  const resetWelcomeState = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setHasSeenWelcome(false);
    setIsModalOpen(true);
  };

  return {
    hasSeenWelcome,
    isModalOpen,
    closeModal,
    resetWelcomeState
  };
} 