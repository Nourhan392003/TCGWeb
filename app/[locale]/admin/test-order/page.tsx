"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestOrderPage() {
    const order = useQuery(api.orders.getOrderByPaymobOrderId, {
        paymobOrderId: "6520900",
    });

    if (order === undefined) return <div>Loading...</div>;
    if (order === null) return <div>No order found</div>;

    return (
        <div>
            <h1>Order found</h1>
            <p>Name: {order.shippingAddress?.fullName}</p>
            <p>Phone: {order.shippingAddress?.phone}</p>
            <p>Address: {order.shippingAddress?.address}</p>
            <p>City: {order.shippingAddress?.city}</p>
            <p>Postal Code: {order.shippingAddress?.postalCode}</p>
            <pre>{JSON.stringify(order.storeItems, null, 2)}</pre>
        </div>
    );
}