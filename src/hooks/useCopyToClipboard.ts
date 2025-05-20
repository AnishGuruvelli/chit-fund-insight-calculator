import { useState, useCallback } from 'react';

interface CopyToClipboardResult {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

export const useCopyToClipboard = (duration = 2000): CopyToClipboardResult => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [duration]);

  return { copied, copyToClipboard };
};

export default useCopyToClipboard; 