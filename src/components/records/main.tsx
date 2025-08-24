import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Target } from "lucide-react";
import { AssetTable } from "./asset-table";
import { MissionTable } from "./mission-table";
import { AssetModal } from "./asset-modal";
import { MissionModal } from "./mission-modal";
import { assetsData, missionsData } from "./data";
import type { Asset, Mission } from "./types";

interface RecordsProps {
  defaultTab?: 'assets' | 'missions';
}

export const Records = ({ defaultTab = 'assets' }: RecordsProps) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [currentTab, setCurrentTab] = useState<'assets' | 'missions'>(defaultTab);
  const [isTabReady, setIsTabReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);

  // Sync URL with tab state
  useEffect(() => {
    setCurrentTab(defaultTab);
  }, [defaultTab]);

  // Force tab reflow to fix width issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTabReady(true);
      // Force a reflow to fix tab width calculation
      if (tabsRef.current) {
        const element = tabsRef.current;
        element.style.display = 'none';
        element.offsetHeight; // Force reflow
        element.style.display = '';
        
        // Additional force reflow for tab buttons
        const tabButtons = element.querySelectorAll('[role="tab"]');
        tabButtons.forEach(button => {
          const btn = button as HTMLElement;
          btn.style.width = 'auto';
          btn.offsetWidth; // Force reflow
          btn.style.width = '';
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentTab]);

  // Handle tab change and update URL
  const handleTabChange = (details: { value: string }) => {
    const newTab = details.value as 'assets' | 'missions';
    setCurrentTab(newTab);
    setIsTabReady(false);
    
    // Update URL without page reload
    const newPath = `/records/${newTab}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  return (
    <div className="pt-24 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-shadow-lg text-shadow-primary mb-2">
          Records Database
        </h1>
        <p className="text-foreground/60">
          Access and manage operational assets and mission details
        </p>
      </div>

      <div 
        ref={tabsRef} 
        className={`transition-opacity duration-200 ${isTabReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ minHeight: '200px' }}
      >
        <TabsRoot value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 flex-shrink-0">
            <TabsTrigger value="assets" className="flex-1 min-w-0">
              <Users className="size-4 mr-2 flex-shrink-0" />
              <span className="truncate">Assets</span>
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex-1 min-w-0">
              <Target className="size-4 mr-2 flex-shrink-0" />
              <span className="truncate">Missions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <AssetTable 
              assets={assetsData} 
              onAssetClick={setSelectedAsset} 
            />
          </TabsContent>

          <TabsContent value="missions">
            <MissionTable 
              missions={missionsData} 
              onMissionClick={setSelectedMission} 
            />
          </TabsContent>
        </TabsRoot>
      </div>

      <AssetModal 
        asset={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />

      <MissionModal 
        mission={selectedMission} 
        onClose={() => setSelectedMission(null)} 
      />
    </div>
  );
}; 