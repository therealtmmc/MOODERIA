import { useNavigate } from "react-router-dom";
import { DISTRICTS } from "@/constants/districts";
import { motion } from "motion/react";
import { useStore } from "@/context/StoreContext";

export default function MapPage() {
  const navigate = useNavigate();
  const { state } = useStore();

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {Object.entries(DISTRICTS).map(([path, district]) => {
        if (path === "/home" && !state.isStarkTheme) return null;
        
        const isHackerTerminal = path === "/home" && state.isStarkTheme;
        const displayDistrict = isHackerTerminal ? {
          ...district,
          name: "Hacker Terminal",
          icon: "💻",
          description: "Root access point.",
          accentColor: "text-green-500",
          bgColor: "bg-black"
        } : district;

        return (
          <motion.button
            key={path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(path)}
            className={`p-6 rounded-3xl shadow-lg border-4 flex flex-col items-center gap-3 ${
              isHackerTerminal ? "bg-black border-green-500" : "bg-white border-gray-100"
            }`}
          >
            <span className="text-4xl">{displayDistrict.icon}</span>
            <h2 className={`font-black text-lg uppercase ${isHackerTerminal ? "text-green-500" : "text-[#46178f]"}`}>
              {displayDistrict.name}
            </h2>
            <p className={`text-xs text-center ${isHackerTerminal ? "text-green-700" : "text-gray-400"}`}>
              {displayDistrict.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
