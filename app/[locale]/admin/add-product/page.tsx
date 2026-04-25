"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function AddProductForm() {
    const t = useTranslations('Admin');

    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [price, setPrice] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [descriptionAr, setDescriptionAr] = useState("");
    const [game, setGame] = useState("Pokémon");
    const [rarity, setRarity] = useState("Common");
    const [condition, setCondition] = useState("Near Mint");
    const [inStock, setInStock] = useState(true);
    const [isPreorder, setIsPreorder] = useState(false);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl = useMutation(api.products.generateUploadUrl);
    const addProduct = useMutation(api.products.addProduct);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedImage) {
            toast.error(t('selectImage'));
            return;
        }

        try {
            setIsUploading(true);

            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            });

            if (!result.ok) throw new Error("Image upload failed");

            const data = await result.json();
            const storageId = data.storageId || data.fileId || data.id;
            if (!storageId) throw new Error("No storageId returned from upload");

            await addProduct({
                name: { en: nameEn, ar: nameAr || undefined },
                price: parseFloat(price),
                description: descriptionEn
                    ? { en: descriptionEn, ar: descriptionAr || undefined }
                    : undefined,
                game,
                rarity,
                condition,
                inStock,
                isPreorder,
                imageId: storageId,
            });

            toast.success(t('successAdd'));

            setNameEn("");
            setNameAr("");
            setPrice("");
            setDescriptionEn("");
            setDescriptionAr("");
            setGame("Pokémon");
            setRarity("Common");
            setCondition("Near Mint");
            setInStock(true);
            setIsPreorder(false);
            setSelectedImage(null);
            if (imageInputRef.current) imageInputRef.current.value = "";
        } catch (error: any) {
            toast.error(error.message || t('errorAdd'));
            console.error("Full Error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#1a1a24] rounded-lg border border-gray-700 shadow-xl mt-10 text-white">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
                {t('addProduct')}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('nameEN')} *</label>
                        <input
                            type="text"
                            placeholder="e.g. Charizard VMAX"
                            value={nameEn}
                            onChange={(e) => setNameEn(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                            required
                            dir="ltr"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('nameAR')}</label>
                        <input
                            type="text"
                            placeholder="مثال: بطاقة شاريزارد"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none text-right"
                            dir="rtl"
                        />
                    </div>
                </div>

                {/* Game & Rarity */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('game')}</label>
                        <select
                            value={game}
                            onChange={(e) => setGame(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            <option value="pokemon">Pokémon</option>
                            <option value="one-piece">One Piece</option>
                            <option value="yugioh">Yu-Gi-Oh!</option>
                            <option value="dragon-ball">Dragon Ball</option>
                            <option value="naruto">Naruto</option>
                            <option value="union-arena">Union Arena</option>
                            <option value="riftbound">Riftbound</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('rarity')}</label>
                        <select
                            value={rarity}
                            onChange={(e) => setRarity(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            <option>Common</option>
                            <option>Uncommon</option>
                            <option>Rare</option>
                            <option>Ultra Rare</option>
                        </select>
                    </div>
                </div>

                {/* Price & Condition */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('price')} (SAR) *</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 999.99"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('condition')}</label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            <option>Near Mint</option>
                            <option>Lightly Played</option>
                            <option>Moderately Played</option>
                            <option>Heavy Played</option>
                        </select>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-300">{t('uploadImage')}</label>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                        className="border border-gray-600 bg-[#0f0f16] p-2 rounded focus:border-amber-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600 cursor-pointer"
                        required
                    />
                    {selectedImage && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-400 mb-1">{t('preview')}:</p>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded border-2 border-amber-500"
                            />
                        </div>
                    )}
                </div>

                {/* Description fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('descriptionEN')}</label>
                        <textarea
                            placeholder="Product description in English..."
                            value={descriptionEn}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none min-h-[80px]"
                            dir="ltr"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('descriptionAR')}</label>
                        <textarea
                            placeholder="وصف المنتج بالعربي..."
                            value={descriptionAr}
                            onChange={(e) => setDescriptionAr(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none min-h-[80px] text-right"
                            dir="rtl"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={inStock}
                            onChange={(e) => setInStock(e.target.checked)}
                            className="w-4 h-4 accent-amber-500"
                        />
                        <label htmlFor="inStock" className="text-sm text-white">{t('stock')}</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPreorder"
                            checked={isPreorder}
                            onChange={(e) => setIsPreorder(e.target.checked)}
                            className="w-4 h-4 accent-emerald-500"
                        />
                        <label htmlFor="isPreorder" className="text-sm text-white">Pre-order Product</label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('uploading')}
                        </>
                    ) : (
                        t('addProduct')
                    )}
                </button>
            </form>
        </div>
    );
}