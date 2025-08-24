import { DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogTitle, DialogDescription, DialogCloseTrigger, Portal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Zap, Shield, Weight, Ruler, Gauge, Package, DollarSign, Eye } from "lucide-react";
import type { Weapon } from "./types";
import { getStatusBadge, getCategoryColor, formatPrice } from "./utils";

interface WeaponModalProps {
  weapon: Weapon | null;
  onClose: () => void;
}

export const WeaponModal = ({ weapon, onClose }: WeaponModalProps) => {
  if (!weapon) return null;

  const statusBadge = getStatusBadge(weapon.status);

  return (
    <DialogRoot open={!!weapon} onOpenChange={onClose}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="max-w-4xl">
            <DialogTitle className="text-2xl">{weapon.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-6 space-y-6">
                {/* Header with Image and Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-lg overflow-hidden border border-foreground/20">
                      <img
                        src={weapon.image}
                        alt={weapon.name}
                        className="w-full h-full object-fit p-3"
                        style={{
                          filter: 'grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(200%) brightness(0.8) contrast(120%)'
                        }}
                      />
                    </div>
                    
                    {/* Status and Category Badges */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        shape="flat"
                        className={`px-4 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}
                      >
                        {statusBadge.text}
                      </Button>

                      <Button
                        shape="flat"
                        className={`px-4 py-1 rounded-full text-sm font-medium ${getCategoryColor(weapon.category)}`}
                      >
                        {weapon.category.toUpperCase()}
                      </Button>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-shadow-lg text-shadow-primary mb-2">
                        Description
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {weapon.description}
                      </p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <DollarSign className="size-5 mr-3 text-primary" />
                        <div>
                          <div className="text-sm text-foreground/60">Price</div>
                          <div className="font-semibold text-primary">{formatPrice(weapon.price)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Package className="size-5 mr-3 text-green-400" />
                        <div>
                          <div className="text-sm text-foreground/60">Stock</div>
                          <div className="font-semibold text-green-400">{weapon.totalStock} units</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Target className="size-5 mr-3 text-accent" />
                        <div>
                          <div className="text-sm text-foreground/60">Range</div>
                          <div className="font-semibold">{weapon.range}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Zap className="size-5 mr-3 text-yellow-400" />
                        <div>
                          <div className="text-sm text-foreground/60">Usage</div>
                          <div className="font-semibold">{weapon.usage}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-shadow-lg text-shadow-primary">
                    Technical Specifications
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                      <Weight className="size-4 mr-2 text-foreground/60" />
                      <div>
                        <div className="text-xs text-foreground/60">Weight</div>
                        <div className="font-medium">{weapon.weight}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                      <Ruler className="size-4 mr-2 text-foreground/60" />
                      <div>
                        <div className="text-xs text-foreground/60">Length</div>
                        <div className="font-medium">{weapon.length}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                      <Gauge className="size-4 mr-2 text-foreground/60" />
                      <div>
                        <div className="text-xs text-foreground/60">Fire Rate</div>
                        <div className="font-medium">{weapon.fireRate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                      <Package className="size-4 mr-2 text-foreground/60" />
                      <div>
                        <div className="text-xs text-foreground/60">Magazine</div>
                        <div className="font-medium">{weapon.magazine}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                    <div className="flex items-center mb-2">
                      <Shield className="size-4 mr-2 text-foreground/60" />
                      <span className="text-sm font-medium text-foreground/60">Caliber</span>
                    </div>
                    <div className="font-semibold text-lg">{weapon.caliber}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-foreground/20">
                  <Button
                    shape="default"
                    className="flex-1"
                    onClick={() => {
                      // Handle weapon selection/assignment
                      console.log('Weapon selected:', weapon.name);
                    }}
                  >
                    <Eye className="size-4 mr-2" />
                    Assign Weapon
                  </Button>
                  
                  <Button
                    shape="default"
                    variant="accent"
                    className="flex-1"
                    onClick={() => {
                      // Handle weapon maintenance
                      console.log('Maintenance requested for:', weapon.name);
                    }}
                  >
                    <Shield className="size-4 mr-2" />
                    Request Maintenance
                  </Button>
                </div>
              </div>
            </DialogDescription>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}; 