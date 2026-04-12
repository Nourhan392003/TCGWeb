"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Layers
} from "lucide-react";

/**
 * Admin Sidebar Navigation Menu
 * Vertical navigation with active route highlighting
 */
const navItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: Package
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: Users
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    /**
     * Check if the current route matches the nav item
     * Handles exact match for dashboard and prefix match for others
     */
    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                    TCG Vault
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    Admin
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg
                                font-medium transition-all duration-200
                                ${active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `}
                        >
                            <Icon
                                className={`w-5 h-5 ${active ? "text-blue-700" : "text-gray-400"}`}
                            />
                            <span>{item.name}</span>
                            {active && (
                                <div className="ml-auto w-1.5 h-1.5 bg-blue-700 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Admin Panel v1.0
                </p>
            </div>
        </div>
    );
}
