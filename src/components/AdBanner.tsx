import React, { useEffect, useRef, useState } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
  showPlaceholder?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * Fixed bottom advertisement banner
 * Automatically collapses and hides completely when no ad data is received (unconfigured, unfilled, or blocked)
 * so the application screen space is maximized.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  adClient,
  adSlot,
  showPlaceholder = false,
  onVisibilityChange,
}) => {
  const [isAdFilled, setIsAdFilled] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);

  const hasAdConfig = Boolean(adClient && adSlot);

  useEffect(() => {
    if (!hasAdConfig) {
      const visible = showPlaceholder;
      setIsAdFilled(visible);
      onVisibilityChange?.(visible);
      return;
    }

    try {
      // @ts-expect-error window.adsbygoogle is injected via external script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Suppress errors when ad script is not yet loaded or blocked
    }

    const targetNode = insRef.current;
    if (!targetNode) return;

    const checkStatus = () => {
      const status = targetNode.getAttribute('data-ad-status');
      if (status === 'filled') {
        setIsAdFilled(true);
        onVisibilityChange?.(true);
      } else if (status === 'unfilled') {
        setIsAdFilled(false);
        onVisibilityChange?.(false);
      }
    };

    checkStatus();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          checkStatus();
        }
      }
    });

    observer.observe(targetNode, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [hasAdConfig, showPlaceholder, onVisibilityChange]);

  if (!hasAdConfig && !showPlaceholder) {
    return null;
  }

  if (hasAdConfig && !isAdFilled) {
    return (
      <aside aria-hidden="true" className="hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored Advertisement Area"
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all ${className}`}
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 h-[50px] md:h-[60px] flex items-center justify-center">
        {hasAdConfig ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <ins
              ref={insRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="w-full max-w-2xl h-9 md:h-11 rounded-lg border border-dashed border-slate-300 bg-slate-50/80 hover:bg-slate-100/80 transition-colors flex items-center justify-between px-2.5 sm:px-4 text-slate-500 select-none group">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 text-[10px] font-semibold tracking-wider text-slate-500 bg-slate-200/90 px-1.5 py-0.5 rounded">
                Ad / Sponsored
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <Megaphone className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline-block" />
                <span className="text-[11px] sm:text-xs text-slate-600 truncate">
                  Advertisement Slot (320×50 / 728×90)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden xs:inline-block">
                AdSense Space
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                <span>Reserved</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
