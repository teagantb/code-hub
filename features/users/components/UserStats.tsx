import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "../types";

interface UserStatsProps {
    user: User;
}

export function UserStats({ user }: UserStatsProps) {
    return (
        <div className="space-y-6">
            {/* Languages */}
            {user.stats.languages.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {user.stats.languages.map((lang) => (
                                <div
                                    key={lang.language}
                                    className="flex justify-between items-center"
                                >
                                    <span className="capitalize">
                                        {lang.language}
                                    </span>
                                    <Badge variant="secondary">
                                        {lang._count.language}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Popular Tags */}
            {user.stats.tags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Popular Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {user.stats.tags
                                .slice(0, 10)
                                .map((tagStat, index) => (
                                    <Link
                                        key={tagStat.tag.id + index}
                                        href={`/tags/${encodeURIComponent(
                                            tagStat.tag.name
                                        )}`}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                        >
                                            {tagStat.tag.name} ({tagStat.count})
                                        </Badge>
                                    </Link>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
