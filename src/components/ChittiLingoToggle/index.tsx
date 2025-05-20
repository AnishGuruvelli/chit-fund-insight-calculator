import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChittiLingoToggleProps {
  isLocal: boolean;
  onToggle: (value: boolean) => void;
}

const ChittiLingoToggle: React.FC<ChittiLingoToggleProps> = ({ isLocal, onToggle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-end space-x-2 mb-4"
    >
      <Label htmlFor="lingo-mode" className="text-sm text-gray-600 cursor-pointer">
        {isLocal ? '🗣️ Local Mode' : '📊 Formal Mode'}
      </Label>
      <Switch
        id="lingo-mode"
        checked={isLocal}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-purple-500"
      />
    </motion.div>
  );
};

export default ChittiLingoToggle; 