"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Loader2,
    Package,
    Truck,
    CheckCircle,
    Clock,
    ShoppingCart,
    Coins,
    User,
    Mail,
    Calendar,
    DollarSign,
} from "lucide-react";
import { formatPrice } from "@/utils/currency";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const statusColors: Record<OrderStatus, { color: string; icon: typeof Clock }> = {
    pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
    processing: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Package },
    shipped: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Truck },
    delivered: { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
    cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: Clock },
};

const statusOptions: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
    const t = useTranslations('Admin');
    const locale = useLocale();
    const orders = useQuery(api.orders.getAllOrders);

    const statusConfig = {
        pending: { label: t('status.pending'), ...statusColors.pending },
        processing: { label: t('status.processing'), ...statusColors.processing },
        shipped: { label: t('status.shipped'), ...statusColors.shipped },
        delivered: { label: t('status.delivered'), ...statusColors.delivered },
        cancelled: { label: t('status.cancelled'), ...statusColors.cancelled },
    };
    const updateStatus = useMutation(api.orders.updateOrderStatus);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateStatus({
                id: orderId as any,
                status: newStatus,
            });
            console.log("Order status updated successfully");
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const shortenOrderId = (id: string) => {
        return id.slice(-8).toUpperCase();
    };

    if (orders === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-400 text-lg">Loading orders...</p>
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
                            {t('orders')}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {locale === 'ar' ? 'إدارة ومتابعة طلبات العملاء' : 'Manage and track customer orders'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-[#1a1a24] rounded-lg border border-gray-800">
                            <p className="text-gray-400 text-sm">{locale === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                            <p className="text-white text-2xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-[#1a1a24] border-b border-gray-800 text-sm font-medium text-gray-400">
                        <div className="col-span-1">Order ID</div>
                        <div className="col-span-2">Customer</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Total</div>
                        <div className="col-span-1">Status</div>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
                            <p className="text-gray-400 text-lg mb-2">{locale === 'ar' ? 'لا توجد طلبات' : 'No orders found'}</p>
                            <p className="text-gray-500 text-sm">
                                {locale === 'ar' ? 'ستظهر الطلبات هنا عند إتمام العملاء لمشترياتهم' : 'Orders will appear here when customers make purchases'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {orders.map((order: any) => {
                                const StatusIcon = statusConfig[order.status as OrderStatus]?.icon || Clock;
                                const isExpanded = selectedOrder === order._id;

                                return (
                                    <div key={order._id}>
                                        {/* Main Order Row */}
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center hover:bg-[#1a1a24] transition-colors duration-150 cursor-pointer"
                                            onClick={() => setSelectedOrder(isExpanded ? null : order._id)}
                                        >
                                            {/* Order ID */}
                                            <div className="col-span-1">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-gray-500" />
                                                    <span className="text-white font-mono text-sm">
                                                        #{shortenOrderId(order._id)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Customer */}
                                            <div className="col-span-2">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                        <span className="text-white font-medium">
                                                            {order.shippingAddress?.fullName || "Unknown"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="w-3 h-3 text-gray-500" />
                                                        <span className="text-gray-400 text-sm">
                                                            {order.shippingAddress?.email || order.shippingAddress?.address || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className="col-span-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-300 text-sm">
                                                        {formatDate(order.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-1">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-green-500" />
                                                    <span className="text-green-400 font-medium">
                                                        {formatPrice(order.totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1">
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig[order.status as OrderStatus]?.color || statusConfig.pending.color}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusConfig[order.status as OrderStatus]?.label || "Pending"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Order Details */}
                                        {isExpanded && (
                                            <div className="bg-[#1a1a24] p-6 border-t border-gray-800">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Order Information */}
                                                    <div>
                                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                            <Package className="w-5 h-5" />
                                                            Order Information
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Order ID:</span>
                                                                <span className="text-white font-mono text-sm">{order._id}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Items:</span>
                                                                <span className="text-white">{order.items?.length || 0}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Total Amount:</span>
                                                                <span className="text-green-400 font-medium">
                                                                    {formatPrice(order.totalAmount)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Shipping Information */}
                                                    <div>
                                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                            <Truck className="w-5 h-5" />
                                                            Shipping Information
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Name:</span>
                                                                <span className="text-white">
                                                                    {order.shippingAddress?.fullName || "N/A"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Email:</span>
                                                                <span className="text-white">{order.shippingAddress?.address || "N/A"}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Phone:</span>
                                                                <span className="text-white">{order.shippingAddress?.phone || "N/A"}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-400">Address:</span>
                                                                <span className="text-white">{order.shippingAddress?.city || "N/A"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="mt-6">
                                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                        <ShoppingCart className="w-5 h-5" />
                                                        Order Items
                                                    </h3>
                                                    <div className="bg-[#12121a] rounded-lg border border-gray-700 overflow-hidden">
                                                        <div className="grid grid-cols-4 gap-4 p-3 bg-[#1a1a24] text-sm font-medium text-gray-400">
                                                            <div className="col-span-1">Item</div>
                                                            <div className="col-span-1">Price</div>
                                                            <div className="col-span-1">Qty</div>
                                                            <div className="col-span-1">Subtotal</div>
                                                        </div>
                                                        <div className="divide-y divide-gray-700">
                                                            {order.items?.map((item: any, index: number) => (
                                                                <div key={index} className="grid grid-cols-4 gap-4 p-3">
                                                                    <div className="col-span-1">
                                                                        <div className="flex items-center gap-2">
                                                                            {item.image && (
                                                                                <img
                                                                                    src={item.image}
                                                                                    alt={item.name}
                                                                                    className="w-10 h-10 rounded object-cover"
                                                                                />
                                                                            )}
                                                                            <span className="text-white text-sm">{item.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <span className="text-gray-300">
                                                                            {formatPrice(item.price)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <span className="text-gray-300">×{item.quantity}</span>
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <span className="text-green-400 font-medium">
                                                                            {formatPrice(item.price * item.quantity)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Update Status */}
                                                <div className="mt-6">
                                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5" />
                                                        Update Status
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {statusOptions.map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(order._id, status)}
                                                                disabled={order.status === status}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${order.status === status
                                                                        ? `${statusConfig[status].color} cursor-not-allowed opacity-50`
                                                                        : `${statusConfig[status].color} hover:opacity-80 cursor-pointer`
                                                                    }`}
                                                            >
                                                                {statusConfig[status].label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}