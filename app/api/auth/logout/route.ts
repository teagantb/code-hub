import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout successful",
        });

        // Clear auth cookie
        response.headers.set(
            "Set-Cookie",
            "auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
        );

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
