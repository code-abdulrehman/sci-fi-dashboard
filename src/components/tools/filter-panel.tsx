import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, Target, DollarSign, Package } from "lucide-react";
import { Combobox, createListCollection } from "@ark-ui/react/combobox";
import {
  ComboboxRoot,
  ComboboxControl,
  ComboboxTrigger,
  ComboboxPositioner,
  ComboboxContent,
  ComboboxInput,
  ComboboxItemGroup,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
} from "@/components/ui/combobox";
import type { WeaponFilter } from "./types";
import { categories, statusOptions } from "./data";

interface FilterPanelProps {
  filter: WeaponFilter;
  onFilterChange: (filter: WeaponFilter) => void;
  onReset: () => void;
  totalWeapons: number;
  filteredCount: number;
}

export const FilterPanel = ({ 
  filter, 
  onFilterChange, 
  onReset, 
  totalWeapons, 
  filteredCount 
}: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof WeaponFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const priceRangeOptions = [
    { value: [0, 1000], label: "Under $1,000" },
    { value: [1000, 2500], label: "$1,000 - $2,500" },
    { value: [2500, 5000], label: "$2,500 - $5,000" },
    { value: [5000, 10000], label: "$5,000+" },
    { value: [0, 10000], label: "All Prices" },
  ];

  const getPriceRangeLabel = (range: [number, number]) => {
    return priceRangeOptions.find(option => 
      option.value[0] === range[0] && option.value[1] === range[1]
    )?.label || "All Prices";
  };

  // Create collections
  const categoryCollection = createListCollection({ items: categories.filter(c => c.value !== 'all').map(c => c.value) });
  const statusCollection = createListCollection({ items: statusOptions.filter(s => s.value !== 'all').map(s => s.value) });
  const priceRangeCollection = createListCollection({ items: priceRangeOptions.map(range => JSON.stringify(range.value)) });

  return (
    <div className="mb-8">
      {/* Filter Header */}
      <div
        className={twMerge([
          "relative p-6 mb-4",
          "[--color-frame-1-stroke:var(--color-primary)]/40",
          "[--color-frame-1-fill:var(--color-primary)]/8",
          "[--color-frame-2-stroke:var(--color-accent)]/30",
          "[--color-frame-2-fill:var(--color-accent)]/5",
        ])}
      >
        <Frame
          enableBackdropBlur
          className="drop-shadow-lg drop-shadow-primary/20"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","20","0"],["L","100% - 20","0"],["L","100% + 0","20"],["L","100% + 0","100% - 20"],["L","100% - 20","100% + 0"],["L","20","100% + 0"],["L","0","100% - 20"],["L","0","20"],["L","20","0"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","30","10"],["L","100% - 30","10"],["L","100% - 10","30"],["L","100% - 10","100% - 30"],["L","100% - 30","100% - 10"],["L","30","100% - 10"],["L","10","100% - 30"],["L","10","30"],["L","30","10"]]}]'
          )}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="size-5 text-primary" />
              <h2 className="text-lg font-semibold text-shadow-lg text-shadow-primary">
                Weapon Filters
              </h2>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <span>Showing {filteredCount} of {totalWeapons}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                shape="flat"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? "Hide Filters" : "Show Filters"}
              </Button>
              
              <Button
                shape="flat"
                variant="accent"
                onClick={onReset}
                className="text-xs"
              >
                <X className="size-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search weapons by name or description..."
              value={filter.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-foreground/20">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center">
                  <Target className="size-4 mr-2" />
                  Category
                </label>
                <ComboboxRoot
                  value={filter.category === 'all' ? [] : [filter.category]}
                  collection={categoryCollection}
                  onValueChange={(details) => handleFilterChange("category", details.value[0] || 'all')}
                >
                  <ComboboxControl>
                    <ComboboxTrigger>
                      {filter.category === 'all' ? 'All Categories' : categories.find(c => c.value === filter.category)?.label}
                    </ComboboxTrigger>
                    <ComboboxPositioner>
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxItemGroup>
                          {categories.filter(c => c.value !== 'all').map((category) => (
                            <ComboboxItem key={category.value} item={category.value}>
                              <ComboboxItemText>{category.label}</ComboboxItemText>
                              {filter.category === category.value && <ComboboxItemIndicator />}
                            </ComboboxItem>
                          ))}
                        </ComboboxItemGroup>
                      </ComboboxContent>
                    </ComboboxPositioner>
                  </ComboboxControl>
                </ComboboxRoot>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center">
                  <Package className="size-4 mr-2" />
                  Status
                </label>
                <ComboboxRoot
                  value={filter.status === 'all' ? [] : [filter.status]}
                  collection={statusCollection}
                  onValueChange={(details) => handleFilterChange("status", details.value[0] || 'all')}
                >
                  <ComboboxControl>
                    <ComboboxTrigger>
                      {filter.status === 'all' ? 'All Statuses' : statusOptions.find(s => s.value === filter.status)?.label}
                    </ComboboxTrigger>
                    <ComboboxPositioner>
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxItemGroup>
                          {statusOptions.filter(status => status.value !== 'all').map((status) => (
                            <ComboboxItem key={status.value} item={status.value}>
                              <ComboboxItemText>{status.label}</ComboboxItemText>
                              {filter.status === status.value && <ComboboxItemIndicator />}
                            </ComboboxItem>
                          ))}
                        </ComboboxItemGroup>
                      </ComboboxContent>
                    </ComboboxPositioner>
                  </ComboboxControl>
                </ComboboxRoot>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center">
                  <DollarSign className="size-4 mr-2" />
                  Price Range
                </label>
                <ComboboxRoot
                  value={[JSON.stringify(filter.priceRange)]}
                  collection={priceRangeCollection}
                  onValueChange={(details) => {
                    const selectedRange = details.value[0] ? JSON.parse(details.value[0]) : [0, 10000];
                    handleFilterChange("priceRange", selectedRange);
                  }}
                >
                  <ComboboxControl>
                    <ComboboxTrigger>
                      {getPriceRangeLabel(filter.priceRange)}
                    </ComboboxTrigger>
                    <ComboboxPositioner>
                      <ComboboxContent>
                        <ComboboxInput />
                        <ComboboxItemGroup>
                          {priceRangeOptions.map((range) => (
                            <ComboboxItem key={range.label} item={JSON.stringify(range.value)}>
                              <ComboboxItemText>{range.label}</ComboboxItemText>
                              {filter.priceRange[0] === range.value[0] && filter.priceRange[1] === range.value[1] && <ComboboxItemIndicator />}
                            </ComboboxItem>
                          ))}
                        </ComboboxItemGroup>
                      </ComboboxContent>
                    </ComboboxPositioner>
                  </ComboboxControl>
                </ComboboxRoot>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(filter.category !== 'all' || filter.status !== 'all' || filter.search) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-foreground/20">
              <span className="text-sm text-foreground/60">Active filters:</span>
              
              {filter.category !== 'all' && (
                <div className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary border border-primary/30">
                  Category: {categories.find(c => c.value === filter.category)?.label}
                  <button
                    onClick={() => handleFilterChange("category", "all")}
                    className="ml-1 hover:text-primary/70"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {filter.status !== 'all' && (
                <div className="px-2 py-1 rounded-full text-xs bg-accent/20 text-accent border border-accent/30">
                  Status: {statusOptions.find(s => s.value === filter.status)?.label}
                  <button
                    onClick={() => handleFilterChange("status", "all")}
                    className="ml-1 hover:text-accent/70"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {filter.search && (
                <div className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                  Search: "{filter.search}"
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="ml-1 hover:text-green-400/70"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 