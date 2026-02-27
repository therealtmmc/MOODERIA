import { motion } from "motion/react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#46178f] flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-black mb-4 tracking-tighter drop-shadow-lg">
          Mooderia
        </h1>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="inline-block"
        >
          <img src="/logo.png" alt="Mooderia Logo" className="w-24 h-24 drop-shadow-lg" />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 font-bold text-white/50"
      >
        Loading your world...
      </motion.p>
    </div>
  );
}
