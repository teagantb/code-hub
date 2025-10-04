import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, username } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, ...(username ? [{ username }] : [])],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or username already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                username: username || null,
            },
        });

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            name: user.name,
        });

        // Create response with auth cookie
        const response = NextResponse.json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
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
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
