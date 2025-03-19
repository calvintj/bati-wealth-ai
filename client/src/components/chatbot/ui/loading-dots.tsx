import { motion } from "framer-motion";
import React from "react";

export default function LoadingDots() {
  const dotVariants = {
    bounce: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 0.6,
          ease: "easeInOut",
          delay: i * 0.1,
        },
      },
    }),
  };

  return (
    <div className="flex gap-2 flex-shrink-0 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[10px] h-[10px] rounded-full bg-primary dark:bg-zinc-300"
          custom={i}
          variants={dotVariants}
          animate="bounce"
        />
      ))}
    </div>
  );
}
