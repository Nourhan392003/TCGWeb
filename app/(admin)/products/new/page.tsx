"use client";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
    Upload,
    X,
    Save,
    ArrowLeft,
    DollarSign,
    Package,
    Tag,
    FileText,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const tcgGames = [
    { value: "yugioh", label: "Yu-Gi-Oh!" },
    { value: "pokemon", label: "Pokémon TCG" },
    { value: "magic", label: "Magic: The Gathering" },
    { value: "onepiece", label: "One Piece TCG" },
    { value: "digimon", label: "Digimon Card Game" },
    { value: "dragonball", label: "Dragon Ball Super" },
];

const rarities = [
    { value: "common", label: "Common" },
    { value: "uncommon", label: "Uncommon" },
    { value: "rare", label: "Rare" },
    { value: "super_rare", label: "Super Rare" },
    { value: "ultra_rare", label: "Ultra Rare" },
    { value: "secret_rare", label: "Secret Rare" },
    { value: "mythic", label: "Mythic" },
    { value: "promo", label: "Promo" },
];

const conditions = [
    { value: "mint", label: "Mint" },
    { value: "near_mint", label: "Near Mint" },
    { value: "lightly_played", label: "Lightly Played" },
    { value: "moderately_played", label: "Moderately Played" },
    { value: "heavily_played", label: "Heavily Played" },
    { value: "damaged", label: "Damaged" },
];

export default function NewProductPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        game: "",
        rarity: "",
        condition: "",
        isFoil: false,
        isFirstEdition: false,
        isGraded: false,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);

    // Convex mutations
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);
    const addProduct = useMutation(api.products.addProduct);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Preview محلي
            const localUrl = URL.createObjectURL(file);
            setImagePreview(localUrl);

            // رفع لـ Convex Storage
            const postUrl = await generateUploadUrl();

            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
            setUploadedStorageId(storageId);

            // تم حذف استدعاء addProduct من هنا، الاكتفاء بحفظ storageId فقط

        } catch (error) {
            console.error("Upload failed:", error);
            alert("فشل رفع الصورة");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setUploadedStorageId(null);
        // Clear file input
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.game || !formData.stock) {
            alert("الاسم والسعر واللعبة والمخزون مطلوبين");
            return;
        }

        setIsSubmitting(true);

        try {
            // إضافة المنتج مرة واحدة هنا مع كل البيانات والصورة المرفوعة
            await addProduct({
                name: formData.name,
                description: formData.description || undefined,
                price: parseFloat(formData.price) || 0,
                game: formData.game,
                stockQuantity: parseInt(formData.stock) || 0,
                inStock: parseInt(formData.stock) > 0,
                imageId: uploadedStorageId ?? undefined,
                rarity: formData.rarity || undefined,
                condition: formData.condition || undefined,
                isFoil: formData.isFoil,
                isFirstEdition: formData.isFirstEdition,
            });

            alert("تم إضافة المنتج بنجاح!");

            // Reset form
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                game: "",
                rarity: "",
                condition: "",
                isFoil: false,
                isFirstEdition: false,
                isGraded: false,
            });
            setImagePreview(null);
            setUploadedStorageId(null);
        } catch (error) {
            console.error("Submit failed:", error);
            alert("فشل حفظ المنتج، تأكد من البيانات");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/admin/products" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                </div>
                <p className="text-gray-600 ml-11">Add a new TCG product to your inventory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Charizard ex - Rainbow Rare"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the product..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TCG Specifics Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-600" />
                        TCG Specifics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="game" className="block text-sm font-medium text-gray-700 mb-2">
                                Game <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="game"
                                name="game"
                                value={formData.game}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                required
                            >
                                <option value="">Select a game</option>
                                {tcgGames.map((game) => (
                                    <option key={game.value} value={game.value}>
                                        {game.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-2">
                                Rarity <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="rarity"
                                name="rarity"
                                value={formData.rarity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                required
                            >
                                <option value="">Select rarity</option>
                                {rarities.map((rarity) => (
                                    <option key={rarity.value} value={rarity.value}>
                                        {rarity.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                                Condition <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                required
                            >
                                <option value="">Select condition</option>
                                {conditions.map((condition) => (
                                    <option key={condition.value} value={condition.value}>
                                        {condition.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Image Upload Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        Product Image
                    </h2>

                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Product preview"
                                className="w-full max-w-md h-64 object-contain bg-gray-50 rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                disabled={isUploading}
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                            <label htmlFor="image" className="cursor-pointer block">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-700 font-medium">Drag and drop your image here</p>
                                <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                                <p className="text-gray-400 text-xs mt-4">PNG, JPG up to 10MB</p>
                            </label>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}