"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster as Sonner, ToasterProps } from "sonner";

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
