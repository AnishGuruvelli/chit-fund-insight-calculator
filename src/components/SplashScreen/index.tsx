import React from "react";
import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, IndianRupee } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  // Auto-complete after animation sequence
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Complete after 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-400"
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Background glow effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-purple-300 rounded-3xl blur-xl"
        />

        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.2
          }}
          className="relative bg-purple-500 rounded-3xl p-6 shadow-xl w-full h-full flex items-center justify-center backdrop-blur-lg bg-opacity-90"
        >
          {/* Rupee Symbol */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-4 left-4"
          >
            <IndianRupee className="w-8 h-8 text-purple-200" />
          </motion.div>

          {/* Trend Arrow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: [-2, 2, -2]
            }}
            transition={{
              delay: 0.5,
              duration: 1.5,
              repeat: Infinity,
              y: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute top-6 right-6"
          >
            <TrendingUp className="w-6 h-6 text-purple-200" />
          </motion.div>

          {/* Piggy Bank */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="relative z-10"
          >
            <PiggyBank className="w-16 h-16 text-white" />
          </motion.div>

          {/* Sparkles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.6 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{
                top: `${20 + i * 20}%`,
                right: `${20 + i * 15}%`,
              }}
            >
              <span className="text-purple-200 text-2xl">✨</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-[35%] text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-3xl font-bold text-white mb-2"
        >
          ChitX
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="h-0.5 bg-purple-200/30 mx-auto max-w-[100px] mb-2"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-purple-100 text-sm"
        >
          Smart Chit Fund Calculator
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-[20%] flex items-center gap-2"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity
            }}
            className="w-2 h-2 bg-purple-200 rounded-full"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen; 