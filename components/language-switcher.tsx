"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("common");

    const switchLanguage = (newLocale: string) => {
        // Remove the current locale from the pathname
        const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
        // Navigate to the new locale
        router.push(`/${newLocale}${pathWithoutLocale}`);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={locale === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLanguage("en")}
            >
                EN
            </Button>
            <Button
                variant={locale === "vi" ? "default" : "outline"}
                size="sm"
                onClick={() => switchLanguage("vi")}
            >
                VI
            </Button>
        </div>
    );
}
