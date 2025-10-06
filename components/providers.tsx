"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { Toaster as Sonner } from "sonner";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            {children}
            <Sonner />
        </AuthProvider>
    );
}
