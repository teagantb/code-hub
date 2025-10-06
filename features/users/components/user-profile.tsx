import { Card, CardContent } from "@/components/ui/card";
import type { User } from "../types";

interface UserProfileProps {
    user: User;
}

export function UserProfile({ user }: UserProfileProps) {
    return (
        <Card className="mb-8">
            <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        {user.username && (
                            <p className="text-muted-foreground mb-2">
                                @{user.username}
                            </p>
                        )}
                        {user.bio && (
                            <p className="text-muted-foreground mb-4">
                                {user.bio}
                            </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                                Joined{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>
                                {user.stats.totalSnippets}{" "}
                                {user.stats.totalSnippets !== 1
                                    ? "snippets"
                                    : "snippet"}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
