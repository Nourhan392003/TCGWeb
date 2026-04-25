import { CheckCircle2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-[#2a2a38] rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-[#f0f0f5] mb-3">
                        Payment Successful
                    </h1>

                    <p className="text-[#a0a0b0] mb-6">
                        Your payment was submitted successfully. Your order status will be confirmed automatically after the payment callback is verified.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/products"
                            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Shopping
                        </Link>

                        <Link
                            href="/"
                            className="w-full py-3 px-6 border border-[#2a2a38] text-[#f0f0f5] rounded-lg flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}