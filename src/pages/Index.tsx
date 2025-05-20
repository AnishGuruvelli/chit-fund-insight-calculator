import ChitFundCalculator from "@/components/ChitFundCalculator";
import { Sparkles, Calculator, TrendingUp, Share2 } from "lucide-react";
import { motion } from "framer-motion";

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
    className={`rounded-lg p-4 md:p-6 shadow-lg transition-all ${color} text-white overflow-hidden relative group backdrop-blur-sm`}
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
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-100 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-8 md:py-12 px-4 relative overflow-hidden"
      >
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
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-2"
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.6,
            type: "spring",
            bounce: 0.3
          }}
          className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 md:p-6 border border-purple-100"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.1), 0 10px 10px -5px rgba(147, 51, 234, 0.04)" }}
        >
          <ChitFundCalculator />
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 md:mt-12 text-center text-sm text-gray-500"
        >
          <motion.p 
            className="mb-2"
            whileHover={{ scale: 1.05, color: "#9333ea" }}
          >
            ✨ Turn complex chit fund math into instant, shareable insights ✨
          </motion.p>
          <p>© 2024 Chit Fund IRR Calculator. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
