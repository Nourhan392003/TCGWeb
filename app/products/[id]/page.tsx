"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductHero from "@/components/product/ProductHero";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProductInfoSections from "@/components/product/ProductInfoSections";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetailSkeleton from "@/components/product/ProductDetailSkeleton";

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params?.id as string;

    const product = useQuery(api.products.getProductById, {
        id: productId as any,
    });

    if (product === undefined) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
                    <p className="text-gray-400">This product may have been removed or doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <ProductHero product={product} />
            <ProductGallery product={product} />
            <ProductSpecs product={product} />
            <ProductInfoSections product={product} />
        </div>
    );
}
