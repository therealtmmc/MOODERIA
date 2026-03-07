import { useNavigate } from "react-router-dom";
import { DISTRICTS } from "@/constants/districts";
import { motion } from "motion/react";

export default function MapPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {Object.entries(DISTRICTS).map(([path, district]) => (
        <motion.button
          key={path}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(path)}
          className="bg-white p-6 rounded-3xl shadow-lg border-4 border-gray-100 flex flex-col items-center gap-3"
        >
          <span className="text-4xl">{district.icon}</span>
          <h2 className="font-black text-lg text-[#46178f] uppercase">{district.name}</h2>
          <p className="text-xs text-gray-400 text-center">{district.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
