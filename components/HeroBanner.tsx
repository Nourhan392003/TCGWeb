'use client';

import HeroBannerMobile from './HeroBannerMobile';
import HeroBannerDesktop from './HeroBannerDesktop';

export default function HeroBanner() {
  return (
    <>
      <div className="block md:hidden">
        <HeroBannerMobile />
      </div>

      <div className="hidden md:block">
        <HeroBannerDesktop />
      </div>
    </>
  );
}