import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="text-center py-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Welcome to <span className="text-primary">CodeHub</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Share your code snippets, tag them by language and topic,
                    and get basic time complexity analysis. Connect with
                    developers worldwide.
                </p>
                <div className="flex gap-4 justify-center flex-col sm:flex-row">
                    <Link href="/snippets/new">
                        <Button size="lg" className="w-full sm:w-auto">
                            Create Your First Snippet
                        </Button>
                    </Link>
                    <Link href="/snippets">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            Browse Snippets
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why Choose CodeHub?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Share & Discover</CardTitle>
                            <CardDescription>
                                Share your code snippets and discover amazing
                                solutions from developers around the world.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl mb-4">💻</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Smart Tagging</CardTitle>
                            <CardDescription>
                                Tag your snippets by language, topic, and
                                difficulty to make them easily discoverable.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl mb-4">🏷️</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Complexity Analysis</CardTitle>
                            <CardDescription>
                                Get basic time complexity analysis for your
                                algorithms and understand their performance.
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
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Get Started?
                </h2>
                <p className="text-muted-foreground mb-8">
                    Join thousands of developers sharing their knowledge and
                    learning from each other.
                </p>
                <Link href="/register">
                    <Button size="lg">Sign Up for Free</Button>
                </Link>
            </section>
        </div>
    );
}
