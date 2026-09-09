import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BorderBeam = ({
  className,
  duration = 6,
  colorFrom = "#6366f1",
  colorTo = "#a855f7",
  borderWidth = 1.5,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{ padding: `${borderWidth}px` }}
    >
      <motion.div
        className={cn(
          "absolute -inset-[150%] opacity-90",
          className
        )}
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${colorFrom} 45deg, ${colorTo} 90deg, transparent 135deg)`,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute inset-[1px] rounded-[inherit] bg-slate-950/80 backdrop-blur-xl -z-0 pointer-events-none" />
    </div>
  );
};
