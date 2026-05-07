"use client";
import { useCallback } from "react";
type FlySource = React.MouseEvent<HTMLElement> | Element | null | undefined;
export function useFlyToCart() {
  const flyToCart = useCallback((source: FlySource, imageUrl?: string) => {
    if (typeof window === "undefined") return;
     let startElement: Element | null = null;
     if (source instanceof Element) {
       startElement = source;
     } else if (source && "currentTarget" in source && source.currentTarget instanceof Element) {
       startElement = source.currentTarget;
     } else if (source && "target" in source && source.target instanceof Element) {
       startElement = source.target;
     }
     if (!startElement) return;
     const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon) return;
    const container =
       startElement.closest("[data-product-card]") ||
       startElement.closest(".group") ||
       startElement.closest("section") ||
       startElement.parentElement;
    const imageElement =
       container?.querySelector("img") ||
       (startElement.tagName === "IMG" ? startElement : null);
     const startRect = (imageElement || startElement).getBoundingClientRect();
     const cartRect = cartIcon.getBoundingClientRect();
      const clone = document.createElement("div");
     clone.style.position = "fixed";
     clone.style.left = `${startRect.left}px`;
     clone.style.top = `${startRect.top}px`;
     clone.style.width = `${Math.max(startRect.width, 48)}px`;
     clone.style.height = `${Math.max(startRect.height, 48)}px`;
     clone.style.borderRadius = "12px";
     clone.style.overflow = "hidden";
     clone.style.pointerEvents = "none";
     clone.style.zIndex = "2147483647";
     clone.style.opacity = "1";
     clone.style.transform = "translate3d(0,0,0) scale(1)";
     clone.style.transition =
       "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease";
     clone.style.boxShadow =
       "0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(245,158,11,0.25)";
     clone.style.background =
       "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(234,179,8,0.9))";
      if (imageUrl) {
       const img = document.createElement("img");
       img.src = imageUrl;
       img.alt = "";
       img.style.width = "100%";
       img.style.height = "100%";
       img.style.objectFit = "cover";
       clone.appendChild(img);
     } else if (imageElement instanceof HTMLImageElement) {
       const img = document.createElement("img");
       img.src = imageElement.src;
       img.alt = "";
       img.style.width = "100%";
       img.style.height = "100%";
       img.style.objectFit = "cover";
       clone.appendChild(img);
     }
      document.body.appendChild(clone);
      const startCenterX = startRect.left + startRect.width / 2;
     const startCenterY = startRect.top + startRect.height / 2;
     const endCenterX = cartRect.left + cartRect.width / 2;
     const endCenterY = cartRect.top + cartRect.height / 2;
      const deltaX = endCenterX - startCenterX;
     const deltaY = endCenterY - startCenterY;
     const travelX = deltaX;
     const travelY = deltaY - 40;
      requestAnimationFrame(() => {
       requestAnimationFrame(() => {
         clone.style.transform = `translate3d(${travelX}px, ${travelY}px, 0) scale(0.18)`;
         clone.style.opacity = "0.15";
       });
     });
      const cleanup = () => {
       clone.removeEventListener("transitionend", cleanup);
       if (clone.parentNode) clone.parentNode.removeChild(clone);
        cartIcon.animate(
           [
             { transform: "scale(1)" },
             { transform: "scale(1.18)" },
             { transform: "scale(1)" },
           ],
           {
             duration: 260,
             easing: "cubic-bezier(0.22, 1, 0.36, 1)",
           }
         );
     };
      clone.addEventListener("transitionend", cleanup);
      window.setTimeout(() => {
       if (clone.parentNode) {
         cleanup();
       }
     }, 900);
   }, []);
    return { flyToCart };
}