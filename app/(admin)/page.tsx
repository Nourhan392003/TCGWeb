"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Package,
    DollarSign,
    Clock,
    Users,
    Loader2
} from "lucide-react";

export default function AdminDashboard() {
    // Fetch all products
    const products = useQuery(api.cards.getAll) || [];

    // Fetch all orders
    const orders = useQuery(api.orders.getAllOrders) || [];

    // Calculate stats
    const totalProducts = products.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const activeUsers = orders.length; // Using orders as proxy for active users

    const stats = [
        {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
        },
        {
            label: "Total Revenue",
            value: `SAR ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-400",
            bgColor: "bg-green-400/10",
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
        },
        {
            label: "Active Users",
            value: activeUsers,
            icon: Users,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]"
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
                <div className="bg-[#1a1a2e] rounded-xl border border-[#2a2a4e] overflow-hidden">
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a4e]">
                                    {orders.slice(0, 5).map((order: any) => (
                                        <tr key={order._id} className="hover:bg-[#2a2a4e]/30">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {order._id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {order.customerName || "Guest"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                SAR {order.totalAmount?.toLocaleString() || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${order.status === "completed" ? "bg-green-400/20 text-green-400" :
                                                        order.status === "pending" ? "bg-yellow-400/20 text-yellow-400" :
                                                            "bg-gray-400/20 text-gray-400"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
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
