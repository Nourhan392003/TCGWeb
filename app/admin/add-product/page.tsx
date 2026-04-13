"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

export default function AddProductForm() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [game, setGame] = useState("Pokémon");
    const [rarity, setRarity] = useState("Common");
    const [condition, setCondition] = useState("Near Mint");
    const [inStock, setInStock] = useState(true);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl = useMutation(api.products.generateUploadUrl);
    const addProduct = useMutation(api.products.addProduct);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedImage) {
            toast.error("Please select an image from your device!");
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

            if (!result.ok) {
                throw new Error("Image upload failed");
            }

            const data = await result.json();
            console.log("Upload response:", data);

            const storageId = data.storageId || data.fileId || data.id;
            console.log("storageId:", storageId);

            if (!storageId) {
                throw new Error("No storageId returned from upload");
            }

            await addProduct({
                name,
                price: parseFloat(price),
                description: description || undefined,
                game,
                rarity,
                condition,
                inStock,
                imageId: storageId,
            });

            toast.success("Product added successfully!");

            setName("");
            setPrice("");
            setDescription("");
            setGame("Pokémon");
            setRarity("Common");
            setCondition("Near Mint");
            setInStock(true);
            setSelectedImage(null);

            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add product.");
            console.error("Full Error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#1a1a24] rounded-lg border border-gray-700 shadow-xl mt-10 text-white">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
                Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-300">Product Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Charizard VMAX"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">Game</label>
                        <select
                            value={game}
                            onChange={(e) => setGame(e.target.value)}
                            className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none"
                        >
                            <option>Pokémon</option>
                            <option>One Piece</option>
                            <option>Yu-Gi-Oh!</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">Rarity</label>
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

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-300">Price (EGP)</label>
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
                        <label className="text-sm text-gray-300">Condition</label>
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-300">Upload Product Image</label>
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
                            <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded border-2 border-amber-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-300">Description (Optional)</label>
                    <textarea
                        placeholder="Product description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-600 bg-[#0f0f16] p-2.5 rounded focus:border-amber-500 outline-none min-h-[100px]"
                    />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                    />
                    <label className="text-sm text-white">In Stock</label>
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                        </>
                    ) : (
                        "Save Product"
                    )}
                </button>
            </form>
        </div>
    );
}