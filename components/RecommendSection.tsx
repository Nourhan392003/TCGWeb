'use client';

import RecommendSectionMobile from './RecommendSectionMobile';
import RecommendSectionDesktop from './RecommendSectionDesktop';

type Poster = {
  id: string;
  name: string | { en: string; ar?: string };
  price: number;
  image: string;
  rarity: string;
};

type RecommendSectionProps = {
  featuredCards?: Poster[];
};

export default function RecommendSection({ featuredCards }: RecommendSectionProps) {
  return (
    <>
      <div className="block md:hidden">
        <RecommendSectionMobile featuredCards={featuredCards} />
      </div>

      <div className="hidden md:block">
        <RecommendSectionDesktop featuredCards={featuredCards} />
      </div>
    </>
  );
}