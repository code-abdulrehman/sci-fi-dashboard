import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Button } from "@/components/ui/button";
import { Eye, Target, Zap, Shield } from "lucide-react";
import type { Weapon } from "./types";
import { getStatusBadge, getCategoryColor, formatPrice } from "./utils";

interface WeaponCardProps {
  weapon: Weapon;
  onClick: (weapon: Weapon) => void;
}

export const WeaponCard = ({ weapon, onClick }: WeaponCardProps) => {
  const statusBadge = getStatusBadge(weapon.status);

  return (
    <div className="group relative">
      {/* Card Frame */}
      <div
        className={twMerge([
          "relative p-6 cursor-pointer transition-all duration-300",
          "hover:scale-105 hover:drop-shadow-2xl hover:drop-shadow-primary/30",
          "[--color-frame-1-stroke:var(--color-primary)]/60",
          "[--color-frame-1-fill:var(--color-primary)]/10",
          "[--color-frame-2-stroke:var(--color-accent)]/40",
          "[--color-frame-2-fill:var(--color-accent)]/5",
        ])}
        onClick={() => onClick(weapon)}
      >
        <Frame
          enableBackdropBlur
          className="drop-shadow-xl drop-shadow-primary/20"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","25","12"],["L","100% - 23","12"],["L","100% - 7","30"],["L","100% - 6","0% + 26.666666666666668%"],["L","100% - 14","0% + 28.641975308641975%"],["L","100% - 14","100% - 35.55555555555556%"],["L","100% - 7","100% - 33.33333333333332%"],["L","100% - 7","100% - 40"],["L","100% - 22","100% - 25"],["L","50% + 7.5","100% - 25"],["L","50% - 6.5","100% - 9"],["L","24","100% - 9"],["L","9","100% - 24"],["L","9","100% - 33.58024691358026%"],["L","17","100% - 36.04938271604938%"],["L","17","0% + 28.641975308641975%"],["L","8","0% + 26.666666666666668%"],["L","8","30"],["L","25","12"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","50% + 12.5","100% - 19"],["L","50% + 25","100% - 19"],["L","50% + 17","100% - 11.5"],["L","50% + 4.5","100% - 11.5"],["L","50% + 12.5","100% - 19"]]}]'
          )}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Image */}
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-lg overflow-hidden border border-foreground/20">
              <img
                src={weapon.image}
                alt={weapon.name}
                className="w-full h-full object-contain p-4 filter grayscale hover:grayscale-0 transition-all duration-300"
                style={{
                  filter: 'grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(200%) brightness(0.8) contrast(120%)'
                }}
              />
            </div>
            
            {/* Status Badge */}
            <Button
              shape="flat"
              className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusBadge.color}`}
            >
              {statusBadge.text}
            </Button>
            
            {/* Category Badge */}
            <Button
              shape="flat"
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(weapon.category)}`}
            >
              {weapon.category.toUpperCase()}
            </Button>
            
          </div>

          {/* Weapon Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-shadow-lg text-shadow-primary mb-1">
                {weapon.name}
              </h3>
              <p className="text-sm text-foreground/60 line-clamp-2">
                {weapon.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center">
                <Target className="size-3 mr-1 text-primary" />
                <span className="text-foreground/70">Range:</span>
                <span className="ml-1 font-medium">{weapon.range}</span>
              </div>
              <div className="flex items-center">
                <Zap className="size-3 mr-1 text-accent" />
                <span className="text-foreground/70">Usage:</span>
                <span className="ml-1 font-medium">{weapon.usage}</span>
              </div>
              <div className="flex items-center">
                <Shield className="size-3 mr-1 text-green-400" />
                <span className="text-foreground/70">Stock:</span>
                <span className="ml-1 font-medium">{weapon.totalStock}</span>
              </div>
              <div className="flex items-center">
                <span className="text-foreground/70">Price:</span>
                <span className="ml-1 font-medium text-primary">{formatPrice(weapon.price)}</span>
              </div>
            </div>

            {/* View Details Button */}
            <Button
              shape="default"
              className="w-1/2 mt-4 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(weapon);
              }}
            >
              <Eye className="size-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
    </div>
  );
}; 