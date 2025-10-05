"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { Code2, Menu, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const t = useTranslations("navigation");
    const locale = useLocale();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-0 mx-auto flex h-16 items-center justify-between">
                <div className="flex-1 flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Code Hub"
                            width={102}
                            height={40}
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href={`/${locale}/snippets`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t("snippets")}
                        </Link>
                        <Link
                            href={`/${locale}/tags`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Tags
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <LanguageSwitcher />

                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
                            </div>
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={`/${locale}/users/${
                                        user.username || user.id
                                    }`}
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
                                <Link href={`/${locale}/login`}>
                                    <Button variant="outline" size="sm">
                                        {t("login")}
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/register`}>
                                    <Button size="sm">{t("register")}</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={`/${locale}/snippets`}>
                                    {t("snippets")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/${locale}/tags`}>Tags</Link>
                            </DropdownMenuItem>

                            {user && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/${locale}/snippets/new`}>
                                        Create Snippet
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            <div className="px-2 py-1">
                                <LanguageSwitcher />
                            </div>

                            <DropdownMenuSeparator />

                            {loading ? (
                                <div className="px-2 py-1">
                                    <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
                                </div>
                            ) : user ? (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/${locale}/users/${
                                                user.username || user.id
                                            }`}
                                        >
                                            {user.name}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        {t("logout")}
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/login`}>
                                            {t("login")}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/register`}>
                                            {t("register")}
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
