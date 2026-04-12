"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestPage() {
    const products = useQuery(api.cards.getAll);

    return (
        <div className="p-8">
            <h1>Products Count: {products?.length || 0}</h1>
            <pre>{JSON.stringify(products, null, 2)}</pre>
        </div>
    );
}

