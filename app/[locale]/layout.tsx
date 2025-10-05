import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>
                <Navbar />
                <main className="min-h-[80vh]">{children}</main>
            </Providers>
        </NextIntlClientProvider>
    );
}
