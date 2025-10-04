"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">
                                    CH
                                </span>
                            </div>
                            <span className="font-bold text-xl">CodeHub</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/snippets">
                            <Button variant="ghost">Browse Snippets</Button>
                        </Link>
                        {user && (
                            <Link href="/snippets/new">
                                <Button variant="ghost">Create Snippet</Button>
                            </Link>
                        )}

                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
                            </div>
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-muted-foreground">
                                    Welcome, {user.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
