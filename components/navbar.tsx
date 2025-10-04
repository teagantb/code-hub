"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const t = useTranslations("navbar");

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
                            <span className="font-bold text-xl">
                                {t("title")}
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/snippets">
                            <Button variant="ghost">
                                {t("browseSnippets")}
                            </Button>
                        </Link>
                        {user && (
                            <Link href="/snippets/new">
                                <Button variant="ghost">
                                    {t("createSnippet")}
                                </Button>
                            </Link>
                        )}

                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
                            </div>
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={`/users/${user.username || user.id}`}
                                >
                                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                        {user.name}
                                    </span>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    {t("logout")}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        {t("login")}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">{t("signUp")}</Button>
                                </Link>
                            </div>
                        )}

                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
}
