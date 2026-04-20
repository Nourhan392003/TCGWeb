"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    ImageIcon,
    Package,
    Tag,
    Coins,
    Warehouse,
    X
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/utils/currency";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedText } from "@/utils/localization";

export default function ProductsPage() {
    const t = useTranslations('Admin');
    const locale = useLocale();

    const products = useQuery(api.products.getAllProducts);
    const deleteProduct = useMutation(api.products.deleteCard);
    const updateProduct = useMutation(api.products.updateCard);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);

    const handleEdit = (product: any) => {
        // Normalize name/description to the object form for editing
        const normalizedProduct = {
            ...product,
            nameEn: typeof product.name === 'string' ? product.name : (product.name?.en || ''),
            nameAr: typeof product.name === 'string' ? '' : (product.name?.ar || ''),
            descriptionEn: typeof product.description === 'string' ? product.description : (product.description?.en || ''),
            descriptionAr: typeof product.description === 'string' ? '' : (product.description?.ar || ''),
        };
        setEditingProduct(normalizedProduct);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsUploading(true);
        try {
            let imageId = editingProduct.imageId;

            if (selectedImage) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage.type },
                    body: selectedImage,
                });
                const data = await result.json();
                imageId = data.storageId || data.fileId || data.id;
            }

            await updateProduct({
                id: editingProduct._id as any,
                name: { en: editingProduct.nameEn, ar: editingProduct.nameAr || undefined },
                price: Number(editingProduct.price),
                game: editingProduct.game,
                rarity: editingProduct.rarity,
                inStock: editingProduct.inStock,
                description: editingProduct.descriptionEn
                    ? { en: editingProduct.descriptionEn, ar: editingProduct.descriptionAr || undefined }
                    : undefined,
                image: editingProduct.image || "",
            });

            setEditingProduct(null);
            setSelectedImage(null);
            setPreviewUrl("");
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = (id: string) => {
        const confirmed = confirm(t('confirmDelete'));
        if (confirmed) {
            deleteProduct({ id: id as any }).catch((error) => {
                console.error("Failed to delete product:", error);
            });
        }
    };

    if (products === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-400 text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            {t('products')}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {t('manageInventory')}
                        </p>
                    </div>
                    <Link
                        href="/admin/add-product"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200 self-start"
                    >
                        <Plus className="w-5 h-5" />
                        {t('addProduct')}
                    </Link>
                </div>

                {/* Products Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 bg-[#1a1a24] border-b border-gray-800 text-sm font-medium text-gray-400">
                        <div className="col-span-1">Image</div>
                        <div className="col-span-2">Name (EN / AR)</div>
                        <div className="col-span-1">{t('game')}</div>
                        <div className="col-span-1">{t('rarity')}</div>
                        <div className="col-span-1">{t('price')}</div>
                        <div className="col-span-1">{t('stock')}</div>
                    </div>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <Package className="w-16 h-16 text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg mb-2">{t('noProducts')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {products.map((product: any) => {
                                const nameEn = typeof product.name === 'string' ? product.name : (product.name?.en || '');
                                const nameAr = typeof product.name === 'string' ? '' : (product.name?.ar || '');

                                return (
                                    <div
                                        key={product._id}
                                        className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 items-center hover:bg-[#1a1a24] transition-colors duration-150"
                                    >
                                        {/* Image */}
                                        <div className="col-span-1">
                                            <div className="w-16 h-16 rounded-lg bg-[#1a1a24] border border-gray-700 overflow-hidden flex items-center justify-center">
                                                {product.image ? (
                                                    <img src={product.image} alt={nameEn} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-gray-600" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Name (EN / AR) */}
                                        <div className="col-span-2">
                                            <p className="text-white font-medium truncate">{nameEn}</p>
                                            {nameAr && <p className="text-gray-400 text-sm truncate" dir="rtl">{nameAr}</p>}
                                            {product.condition && <p className="text-gray-500 text-sm">{product.condition}</p>}
                                        </div>

                                        {/* Game */}
                                        <div className="col-span-1">
                                            <span className="inline-flex items-center gap-1 text-gray-300">
                                                <Tag className="w-4 h-4 text-gray-500" />
                                                <span className="capitalize">{product.game}</span>
                                            </span>
                                        </div>

                                        {/* Rarity */}
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                                ${product.rarity === 'Ultra Rare' || product.rarity === 'Secret Rare' ? 'bg-purple-500/20 text-purple-400' :
                                                    product.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                                                        product.rarity === 'Uncommon' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {product.rarity || 'Common'}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-1">
                                            <span className="inline-flex items-center gap-1 text-green-400 font-medium">
                                                <Coins className="w-4 h-4" />
                                                {typeof product.price === 'number'
                                                    ? formatPrice(product.price)
                                                    : formatPrice(parseFloat(product.price || 0))}
                                            </span>
                                        </div>

                                        {/* Stock Status */}
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                                ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                <Warehouse className="w-3.5 h-3.5" />
                                                {product.inStock
                                                    ? (locale === 'ar' ? 'متوفر' : 'In Stock')
                                                    : (locale === 'ar' ? 'نفذ' : 'Out of Stock')}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 rounded-lg bg-[#1a1a24] hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors duration-150"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 rounded-lg bg-[#1a1a24] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors duration-150"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Stats Footer */}
                {products.length > 0 && (
                    <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                        <p>
                            {locale === 'ar'
                                ? `عرض ${products.length} منتج`
                                : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
                        </p>
                        <p>
                            {locale === 'ar'
                                ? `${products.filter((p: any) => p.inStock).length} متوفر`
                                : `${products.filter((p: any) => p.inStock).length} in stock`}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121a] rounded-xl border border-gray-700 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">{t('editProduct')}</h2>
                            <button onClick={() => setEditingProduct(null)} className="p-2 rounded-lg hover:bg-[#1a1a24] text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            {/* EN Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('nameEN')} *</label>
                                <input
                                    type="text"
                                    value={editingProduct.nameEn}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                                    dir="ltr"
                                    required
                                />
                            </div>
                            {/* AR Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('nameAR')}</label>
                                <input
                                    type="text"
                                    value={editingProduct.nameAr}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 text-right"
                                    dir="rtl"
                                    placeholder="الاسم بالعربي (اختياري)"
                                />
                            </div>
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('price')} (SAR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            {/* Game */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('game')}</label>
                                <select
                                    value={editingProduct.game}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, game: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                                >
                                    <option value="pokemon">Pokemon</option>
                                    <option value="yugioh">Yu-Gi-Oh!</option>
                                    <option value="onepiece">One Piece</option>
                                    <option value="magic">Magic: The Gathering</option>
                                </select>
                            </div>
                            {/* Rarity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('rarity')}</label>
                                <select
                                    value={editingProduct.rarity}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, rarity: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                                >
                                    <option value="Common">Common</option>
                                    <option value="Uncommon">Uncommon</option>
                                    <option value="Rare">Rare</option>
                                    <option value="Ultra Rare">Ultra Rare</option>
                                    <option value="Secret Rare">Secret Rare</option>
                                </select>
                            </div>
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('uploadImage')}</label>
                                {editingProduct.image && (
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                        <div className="w-20 h-20 rounded-lg bg-[#1a1a24] border border-gray-700 overflow-hidden">
                                            <img src={editingProduct.image} alt={editingProduct.nameEn} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setSelectedImage(file);
                                        if (file) setPreviewUrl(URL.createObjectURL(file));
                                    }}
                                    className="w-full rounded-lg border border-gray-700 bg-[#151521] px-3 py-2 text-white"
                                />
                                {previewUrl && (
                                    <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-700 mt-2" />
                                )}
                            </div>
                            {/* EN Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('descriptionEN')}</label>
                                <textarea
                                    value={editingProduct.descriptionEn || ""}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-y min-h-[60px]"
                                    dir="ltr"
                                />
                            </div>
                            {/* AR Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('descriptionAR')}</label>
                                <textarea
                                    value={editingProduct.descriptionAr || ""}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a24] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-y min-h-[60px] text-right"
                                    dir="rtl"
                                    placeholder="الوصف بالعربي (اختياري)"
                                />
                            </div>
                            {/* In Stock */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={editingProduct.inStock}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                                    className="w-4 h-4 rounded bg-[#1a1a24] border-gray-700 text-amber-500 focus:ring-amber-500"
                                />
                                <label htmlFor="inStock" className="text-sm text-gray-300">{t('stock')}</label>
                            </div>
                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 px-4 py-2 bg-[#1a1a24] hover:bg-[#252532] text-gray-300 rounded-lg transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
                                >
                                    {isUploading ? t('uploading') : t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}