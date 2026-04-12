import { ReactNode } from "react";

export interface BadgeProps {
    variant?: "default" | "outline" | "secondary" | "destructive";
    className?: string;
    children?: ReactNode;
}

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variantStyles = {
        default: "border-transparent bg-[var(--color-primary)] text-primary-foreground",
        outline: "text-foreground border-current",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
}
