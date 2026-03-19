'use client';

import { useEffect, useRef } from 'react';

interface WidgetContainerProps {
  widgetId: string;
  layout?: 'carousel' | 'grid' | 'list' | 'badge';
  maxReviews?: number;
  minRating?: number;
  className?: string;
}

export function WidgetContainer({ 
  widgetId, 
  layout = 'carousel', 
  maxReviews = 5, 
  minRating = 1,
  className = ''
}: WidgetContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    
    // Wait for VissarWidget to be available
    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).VissarWidget && containerRef.current) {
        const widget = new (window as any).VissarWidget(containerRef.current, {
          widgetId,
          layout,
          maxReviews,
          minRating,
          autoStyle: true,
        });
        widget.init();
        initializedRef.current = true;
      }
    };

    // Check if widget script is already loaded
    if ((window as any).VissarWidget) {
      initWidget();
    } else {
      // Poll for widget availability
      const interval = setInterval(() => {
        if ((window as any).VissarWidget) {
          clearInterval(interval);
          initWidget();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, [widgetId, layout, maxReviews, minRating]);

  return <div ref={containerRef} className={className} />;
}
