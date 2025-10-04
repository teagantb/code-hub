import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            name: user.name,
        });

        // Create response with auth cookie
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                image: user.image,
            },
        });

        // Set auth cookie
        response.headers.set(
            "Set-Cookie",
            `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
                7 * 24 * 60 * 60
            }`
        );

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
