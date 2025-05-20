import React from 'react';
import { WHATSAPP_SHARE_TEMPLATE } from '@/constants/ui';
import { ShareData } from '@/types/ui';
import { MessageSquare } from 'lucide-react';

interface ShareResultsProps {
  data: ShareData;
}

const ShareResults: React.FC<ShareResultsProps> = ({ data }) => {
  const handleWhatsAppShare = () => {
    const text = WHATSAPP_SHARE_TEMPLATE.formatData(data);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">      
      <button
        onClick={handleWhatsAppShare}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-lg"
      >
        <MessageSquare className="h-6 w-6" />
        Brag on WhatsApp 💪
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Share your smart investment choice with friends!
      </p>
    </div>
  );
};

export default ShareResults; 