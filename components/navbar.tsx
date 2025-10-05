"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const t = useTranslations("navigation");
    const locale = useLocale();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">
                                    CH
                                </span>
                            </div>
                            <span className="font-bold text-xl">Code Hub</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href={`/${locale}/snippets`}>
                            <Button variant="ghost">{t("snippets")}</Button>
                        </Link>
                        {user && (
                            <Link href={`/${locale}/snippets/new`}>
                                <Button variant="ghost">Create Snippet</Button>
                            </Link>
                        )}

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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-background/95 backdrop-blur">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href={`/${locale}/snippets`}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t("snippets")}
                            </Link>

                            {user && (
                                <Link
                                    href={`/${locale}/snippets/new`}
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Create Snippet
                                </Link>
                            )}

                            <div className="px-3 py-2">
                                <LanguageSwitcher />
                            </div>

                            {loading ? (
                                <div className="px-3 py-2">
                                    <div className="h-8 w-8 animate-pulse bg-muted rounded"></div>
                                </div>
                            ) : user ? (
                                <div className="space-y-2">
                                    <Link
                                        href={`/${locale}/users/${
                                            user.username || user.id
                                        }`}
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {user.name}
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="w-full justify-start ml-3"
                                    >
                                        {t("logout")}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2 px-3">
                                    <Link href={`/${locale}/login`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {t("login")}
                                        </Button>
                                    </Link>
                                    <Link href={`/${locale}/register`}>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {t("register")}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
