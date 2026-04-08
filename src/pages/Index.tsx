import ChitFundCalculator from "@/components/ChitFundCalculator";
import SplashScreen from "@/components/SplashScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FirstVisitOnboarding } from "@/components/FirstVisitOnboarding";
import { Sparkles, Calculator, TrendingUp, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4
    }
  }
};

const backgroundVariants = {
  initial: { scale: 0.8, rotate: 0 },
  animate: { 
    scale: [0.8, 1.2, 0.9],
    rotate: [0, 180, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const FeatureCard = ({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, y: -10 }}
    whileTap={{ scale: 0.95 }}
    className={`rounded-lg p-4 md:p-6 shadow-lg transition-all ${color} text-white overflow-hidden relative group backdrop-blur-sm max-w-full`}
  >
    <motion.div
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
      className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full mix-blend-overlay"
    />
    <motion.div
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
      className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full mix-blend-overlay"
      style={{ animationDelay: "2s" }}
    />
    <div className="relative z-10">
      <motion.div 
        className="text-white mb-3 md:mb-4"
        whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <motion.h3 
        className="text-base md:text-lg font-semibold mb-2"
        whileHover={{ x: 5 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-sm text-white/90"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {description}
      </motion.p>
    </div>
    <motion.div
      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      whileHover={{ scale: 1.2, rotate: 360 }}
    >
      ✨
    </motion.div>
  </motion.div>
);

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gradient-to-b from-purple-100 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
          >
            <FirstVisitOnboarding />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="w-full max-w-[100vw] bg-gradient-to-r from-purple-600 to-purple-400 text-white relative overflow-hidden pt-[max(2.5rem,env(safe-area-inset-top,0px)+0.75rem)] pb-12 md:pb-16 px-4 sm:px-5"
            >
              <div
                className="absolute z-20 right-4 sm:right-5"
                style={{
                  top: "max(1rem, calc(env(safe-area-inset-top, 0px) + 0.25rem))",
                }}
              >
                <ThemeToggle />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"
              />
              <div className="max-w-4xl mx-auto text-center relative z-10 px-10 sm:px-0">
                <motion.h1 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 md:gap-4"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.span>
                  Your Chit Fund's True Worth
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-2xl text-purple-100 mb-2"
                >
                  Find the real ROI of your Chit Fund. Instantly. ✨
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-purple-200 italic"
                >
                  Because your math isn't good enough 😉
                </motion.p>
              </div>
            </motion.div>

            {/* Main Content with increased spacing — extra horizontal padding + bottom safe area for Android nav */}
            <div className="max-w-6xl mx-auto w-full min-w-0 px-4 sm:px-6 py-10 md:py-16 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
              {/* Features Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 w-full min-w-0 overflow-x-hidden"
              >
                <FeatureCard
                  icon={<Calculator className="h-6 w-6 md:h-8 md:w-8" />}
                  title="Smart math for smarter investments"
                  description="Get your true returns with XIRR calculation that considers timing of all cash flows"
                  color="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500"
                />
                <FeatureCard
                  icon={<TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
                  title="Beyond the basic calculator"
                  description="Compare with stocks, gold, and other investment options to make smarter choices"
                  color="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500"
                />
                <FeatureCard
                  icon={<Share2 className="h-6 w-6 md:h-8 md:w-8" />}
                  title="From monthly commitments to final rewards"
                  description="Track your investment journey and share your success story"
                  color="bg-gradient-to-br from-rose-500 via-amber-500 to-yellow-500"
                />
              </motion.div>

              {/* Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.6,
                  type: "spring",
                  bounce: 0.25,
                }}
                className="w-full min-w-0 max-w-full overflow-x-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-5 md:p-6 border border-purple-100 dark:border-purple-900/50"
              >
                <ChitFundCalculator />
              </motion.div>

              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8 md:mt-12 text-center text-sm text-muted-foreground"
              >
                <motion.p
                  className="mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  ✨ Turn complex chit fund math into instant, shareable insights ✨
                </motion.p>
                <p>© 2026 ChitX — Chit Fund XIRR Calculator. All rights reserved.</p>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
