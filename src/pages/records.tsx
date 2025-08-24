import { Records } from "@/components/records/main";
import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";

const RecordsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Handle tab parameter from URL
  useEffect(() => {
    if (tab && (tab === 'assets' || tab === 'missions')) {
      // Tab parameter is valid, component will handle it
    } else if (tab) {
      // Invalid tab parameter, redirect to default
      navigate('/records/assets', { replace: true });
    } else {
      // No tab parameter, redirect to default
      navigate('/records/assets', { replace: true });
    }
  }, [tab, navigate]);

  return <Records defaultTab={tab as 'assets' | 'missions' | undefined} />;
};

export default RecordsPage;