"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import {
    DollarSign,
    ShoppingBag,
    Package,
    Loader2
} from "lucide-react";

export default function AdminDashboard() {
    // Fetch all products
    const products = useQuery(api.products.getAllProducts);

    // Fetch all orders
    const orders = useQuery(api.orders.getAllOrders);

    // Memoized calculations
    const totalRevenue = orders?.reduce((acc, order) => {
        // احسب بس الطلبات اللي حالتها مش 'cancelled'
        if (order.status !== 'cancelled') {
            return acc + order.totalAmount;
        }
        return acc;
    }, 0) || 0;

    const totalOrders = useMemo(() => {
        if (!orders) return 0;
        return orders.length;
    }, [orders]);

    const totalProducts = useMemo(() => {
        if (!products) return 0;
        return products.length;
    }, [products]);

    // Loading state
    const isLoading = products === undefined || orders === undefined;

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-[#1a1a24] border border-gray-800 rounded-xl p-6 animate-pulse"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-700 rounded w-24 mb-3"></div>
                                    <div className="h-8 bg-gray-700 rounded w-32"></div>
                                </div>
                                <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Skeleton */}
                <div className="mt-8">
                    <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
                    <div className="bg-[#1a1a24] border border-gray-800 rounded-xl overflow-hidden">
                        <div className="animate-pulse">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="px-6 py-4 border-b border-gray-800">
                                    <div className="flex gap-4">
                                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "Total Revenue",
            value: `SAR ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-400",
            bgColor: "bg-green-400/10",
        },
        {
            label: "Total Orders",
            value: totalOrders,
            icon: ShoppingBag,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
        },
        {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-[#1a1a24] border border-gray-800 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={stat.color} size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
                <div className="bg-[#1a1a24] border border-gray-800 rounded-xl overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                            No orders yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#0a0a0f]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order._id} className="hover:bg-[#252530] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {order._id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {order.shippingAddress?.fullName || "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                SAR {order.totalAmount?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${order.status === "paid"
                                                    ? "bg-green-400/20 text-green-400"
                                                    : order.status === "pending"
                                                        ? "bg-yellow-400/20 text-yellow-400"
                                                        : "bg-red-400/20 text-red-400"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}