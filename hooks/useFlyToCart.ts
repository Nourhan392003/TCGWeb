"use client";

import { useCallback } from 'react';

export function useFlyToCart() {
  const flyToCart = useCallback((e: React.MouseEvent<HTMLElement> | Element, imageUrl?: string) => {
    console.log("[flyToCart] called");

    if (typeof window === 'undefined') return;

    let startElement: Element | null = null;
    
    if (e) {
        if ('currentTarget' in e && e.currentTarget instanceof Element) {
            startElement = e.currentTarget;
        } else if (e instanceof Element) {
            startElement = e;
        } else if ((e as any).target instanceof Element) {
            startElement = (e as any).target;
        }
    }

    if (!startElement) {
        console.log("[flyToCart] no start element found");
        return;
    }

    // Try to find an image to fly
    const container = startElement.closest('.group') || startElement.closest('section');
    if (container) {
        const img = container.querySelector('img');
        if (img) startElement = img;
    }

    console.log("[flyToCart] start element found:", startElement);

    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon) {
        console.log("[flyToCart] cart icon not found");
        return;
    }
    
    console.log("[flyToCart] cart icon found");

    const startRect = startElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create the clone
    const clone = document.createElement('div');
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.left = `${startRect.left}px`;
    clone.style.top = `${startRect.top}px`;
    clone.style.width = `${startRect.width}px`;
    clone.style.height = `${startRect.height}px`;
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 700ms cubic-bezier(0.25, 1, 0.3, 1)';
    clone.style.borderRadius = '8px';
    clone.style.overflow = 'hidden';
    
    // Add image or fallback background
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        clone.appendChild(img);
    } else if (startElement.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = (startElement as HTMLImageElement).src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        clone.appendChild(img);
    } else {
        clone.style.backgroundColor = '#F5A524'; // Amber fallback
    }

    document.body.appendChild(clone);
    console.log("[flyToCart] clone appended");

    // Trigger animation next frame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const targetWidth = 24; // smaller target width
            const targetHeight = 24;

            clone.style.left = `${cartRect.left + (cartRect.width / 2) - (targetWidth / 2)}px`;
            clone.style.top = `${cartRect.top + (cartRect.height / 2) - (targetHeight / 2)}px`;
            clone.style.width = `${targetWidth}px`;
            clone.style.height = `${targetHeight}px`;
            clone.style.opacity = '0.5'; // slight opacity fade
            clone.style.transform = 'scale(0.8)'; // slight shrink
        });
    });

    // Cleanup
    const cleanup = () => {
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
            console.log("[flyToCart] transition ended, clone removed");
        }
    };

    clone.addEventListener('transitionend', cleanup);
    
    // Fallback cleanup in case transitionend fails
    setTimeout(cleanup, 1000);

  }, []);

  return { flyToCart };
}
