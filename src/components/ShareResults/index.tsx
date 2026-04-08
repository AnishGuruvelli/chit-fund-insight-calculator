import React from "react";
import { WHATSAPP_SHARE_TEMPLATE } from "@/constants/ui";
import { ShareData } from "@/types/ui";
import { MessageSquare, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareResultsProps {
  data: ShareData;
}

const ShareResults: React.FC<ShareResultsProps> = ({ data }) => {
  const summaryText = WHATSAPP_SHARE_TEMPLATE.formatData(data);

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("Summary copied — paste anywhere you like");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="p-0 space-y-3">
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-lg"
      >
        <MessageSquare className="h-6 w-6" />
        Brag on WhatsApp 💪
      </button>

      <Button type="button" variant="outline" className="w-full gap-2" size="lg" onClick={handleCopy}>
        <Copy className="h-5 w-5" />
        Copy summary
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Share your smart investment choice with friends!
      </p>
    </div>
  );
};

export default ShareResults;
