import { SignUp } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function SignUpPage({ params }: Props) {
    const { locale } = await params;
    const isArabic = locale === 'ar';
    const clerkLocalization = isArabic ? arSA : undefined;

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <SignUp

                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-[#111111] border border-white/10 shadow-xl shadow-amber-500/5",
                        headerTitle: "text-white text-2xl font-bold tracking-wider",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all",
                        socialButtonsBlockButtonText: "text-white font-medium",
                        dividerLine: "bg-white/10",
                        dividerText: "text-gray-500",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-black border border-white/20 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all rounded-md",
                        formButtonPrimary: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-amber-500 hover:text-amber-400 font-semibold",
                    },
                    variables: {
                        colorPrimary: "#f59e0b",
                        colorText: "#ffffff",
                        colorTextSecondary: "#9ca3af",
                        colorBackground: "#111111",
                        colorInputBackground: "#000000",
                        colorInputText: "#ffffff",
                    }
                }}
            />
        </div>
    );
}