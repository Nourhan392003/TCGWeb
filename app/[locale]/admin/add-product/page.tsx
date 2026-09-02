"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { GAME_OPTIONS } from "@/lib/constants";

export default function AddProductForm() {
    const t = useTranslations('Admin');

    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [descriptionEn, setDescriptionEn] = useState("");
    const [descriptionAr, setDescriptionAr] = useState("");
    const [game, setGame] = useState(GAME_OPTIONS[0].value);
    const [condition, setCondition] = useState("Factory Sealed");

    const [inStock, setInStock] = useState(true);
    const [isPreorder, setIsPreorder] = useState(false);

    const [hasPurchaseOptions, setHasPurchaseOptions] = useState(false);
    const [boxPrice, setBoxPrice] = useState("");
    const [boxInStock, setBoxInStock] = useState(true);
    const [boxStockQty, setBoxStockQty] = useState(0);
    const [casePrice, setCasePrice] = useState("");
    const [caseInStock, setCaseInStock] = useState(true);
    const [caseStockQty, setCaseStockQty] = useState(0);
    const [maxPerCustomer, setMaxPerCustomer] = useState("");

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

            const purchaseOptions: Array<{
                type: string;
                price: number;
                inStock?: boolean;
                stockQuantity?: number;
            }> = [];
            if (hasPurchaseOptions && boxPrice) {
                purchaseOptions.push({
                    type: "box",
                    price: parseFloat(boxPrice),
                    inStock: boxInStock,
                    stockQuantity: boxStockQty,
                });
            }
            if (hasPurchaseOptions && casePrice) {
                purchaseOptions.push({
                    type: "case",
                    price: parseFloat(casePrice),
                    inStock: caseInStock,
                    stockQuantity: caseStockQty,
                });
            }

            if (maxPerCustomer.trim() !== "") {
                const parsed = Number(maxPerCustomer);
                if (!Number.isInteger(parsed) || parsed <= 0) {
                    toast.error(t('maxPerCustomerInvalid'));
                    setIsUploading(false);
                    return;
                }
            }

            const productPayload = {
                name: { en: nameEn, ar: nameAr || undefined },
                price: parseFloat(price),
                description: descriptionEn
                    ? { en: descriptionEn, ar: descriptionAr || undefined }
                    : undefined,
                game,

                condition,
                inStock,
                stockQuantity,
                isPreorder,
                maxPerCustomer: maxPerCustomer.trim() === "" ? undefined : Number(maxPerCustomer),
                ...(purchaseOptions.length > 0 ? { purchaseOptions } : {}),
                imageId: storageId,
            };

            await addProduct(productPayload);

            toast.success(t('successAdd'));

            setNameEn("");
            setNameAr("");
            setPrice("");
            setStockQuantity(0);
            setMaxPerCustomer("");
            setDescriptionEn("");
            setDescriptionAr("");
            setGame(GAME_OPTIONS[0].value);
            setCondition("Factory Sealed");
            setInStock(true);
            setIsPreorder(false);
            setHasPurchaseOptions(false);
            setBoxPrice("");
            setBoxInStock(true);
            setBoxStockQty(0);
            setCasePrice("");
            setCaseInStock(true);
            setCaseStockQty(0);
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

                {/* Game */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('game')}</label>
                        <select
                            value={game}
                            onChange={(e) => setGame(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            {GAME_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
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
                        <label className="text-sm text-gray-300">Stock Quantity *</label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="e.g. 5"
                            value={stockQuantity}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value));
                                setStockQuantity(value);
                                setInStock(value > 0);
                            }}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('maxPerCustomer')}</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="No limit"
                            value={maxPerCustomer}
                            onChange={(e) => setMaxPerCustomer(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        />
                        <p className="text-xs text-gray-500">
                            {t('maxPerCustomerHelper')}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">{t('condition')}</label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            <option>Factory Sealed</option>
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

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="hasPurchaseOptions"
                        checked={hasPurchaseOptions}
                        onChange={(e) => setHasPurchaseOptions(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                    />
                    <label htmlFor="hasPurchaseOptions" className="text-sm text-white">
                        Enable purchase options (box / case)
                    </label>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    Configure separate price, stock quantity, and availability for box and case.
                </p>

                {hasPurchaseOptions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#16161e] rounded-lg border border-[#2a2a38]">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Box price (SAR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={boxPrice}
                                    onChange={(e) => setBoxPrice(e.target.value)}
                                    className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none text-sm text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Box stock quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={boxStockQty}
                                    onChange={(e) => setBoxStockQty(Math.max(0, Number(e.target.value)))}
                                    className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none text-sm text-white"
                                />
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={boxInStock}
                                    onChange={(e) => setBoxInStock(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-amber-500"
                                />
                                Box in stock
                            </label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Case price (SAR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={casePrice}
                                    onChange={(e) => setCasePrice(e.target.value)}
                                    className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none text-sm text-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Case stock quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={caseStockQty}
                                    onChange={(e) => setCaseStockQty(Math.max(0, Number(e.target.value)))}
                                    className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none text-sm text-white"
                                />
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={caseInStock}
                                    onChange={(e) => setCaseInStock(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-amber-500"
                                />
                                Case in stock
                            </label>
                        </div>
                    </div>
                )}

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