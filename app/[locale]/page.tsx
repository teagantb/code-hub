import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
    const t = await getTranslations("home");

    const locale = await getLocale();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="text-center py-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    {t("title")}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {t("subtitle")}
                </p>
                <div className="flex gap-4 justify-center flex-col sm:flex-row">
                    <Link href={`/${locale}/snippets/new`}>
                        <Button size="lg" className="w-full sm:w-auto">
                            {t("createFirstSnippet")}
                        </Button>
                    </Link>
                    <Link href={`/${locale}/snippets`}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("browseSnippets")}
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    {t("whyChooseTitle")}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("shareDiscover.title")}</CardTitle>
                            <CardDescription>
                                {t("shareDiscover.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl mb-4">💻</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t("smartTagging.title")}</CardTitle>
                            <CardDescription>
                                {t("smartTagging.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl mb-4">🏷️</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("complexityAnalysis.title")}
                            </CardTitle>
                            <CardDescription>
                                {t("complexityAnalysis.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl mb-4">⚡</div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center py-16 bg-muted/50 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">{t("readyToStart")}</h2>
                <p className="text-muted-foreground mb-8">
                    {t("joinDevelopers")}
                </p>
                <Link href={`/${locale}/register`}>
                    <Button size="lg">{t("signUpFree")}</Button>
                </Link>
            </section>
        </div>
    );
}
