import { useState, useMemo } from "react";
import { WeaponCard } from "./weapon-card";
import { WeaponModal } from "./weapon-modal";
import { FilterPanel } from "./filter-panel";
import { StatsPanel } from "./stats-panel";
import { weaponsData } from "./data";
import { filterWeapons, calculateStats } from "./utils";
import type { Weapon, WeaponFilter } from "./types";

export const ToolsPage = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [filter, setFilter] = useState<WeaponFilter>({
    category: "all",
    priceRange: [0, 10000],
    status: "all",
    search: "",
  });

  // Filter and calculate stats
  const filteredWeapons = useMemo(() => {
    return filterWeapons(weaponsData, filter);
  }, [filter]);

  const stats = useMemo(() => {
    return calculateStats(weaponsData);
  }, []);

  const handleFilterReset = () => {
    setFilter({
      category: "all",
      priceRange: [0, 10000],
      status: "all",
      search: "",
    });
  };

  return (
    <div className="pt-24 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-shadow-lg text-shadow-primary mb-2">
          Arsenal Management
        </h1>
        <p className="text-foreground/60">
          Access and manage tactical weapons inventory
        </p>
      </div>

      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Filter Panel */}
      <FilterPanel
        filter={filter}
        onFilterChange={setFilter}
        onReset={handleFilterReset}
        totalWeapons={weaponsData.length}
        filteredCount={filteredWeapons.length}
      />

      {/* Weapons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWeapons.map((weapon) => (
          <WeaponCard
            key={weapon.id}
            weapon={weapon}
            onClick={setSelectedWeapon}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredWeapons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-foreground/40 text-lg mb-2">No weapons found</div>
          <div className="text-foreground/60 text-sm">
            Try adjusting your filters or search terms
          </div>
        </div>
      )}

      {/* Weapon Details Modal */}
      <WeaponModal
        weapon={selectedWeapon}
        onClose={() => setSelectedWeapon(null)}
      />
    </div>
  );
}; 