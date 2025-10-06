"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplexityResult } from "@/lib/complexity-analyzer";
import { useTranslations } from "next-intl";

interface ComplexityAnalysisProps {
    analysis: ComplexityResult;
}

export function ComplexityAnalysis({ analysis }: ComplexityAnalysisProps) {
    const t = useTranslations("complexity");

    const getComplexityColor = (complexity: string) => {
        if (complexity.includes("O(1)")) return "bg-green-100 text-green-800";
        if (complexity.includes("O(log n)")) return "bg-blue-100 text-blue-800";
        if (complexity.includes("O(n)")) return "bg-yellow-100 text-yellow-800";
        if (complexity.includes("O(n log n)"))
            return "bg-orange-100 text-orange-800";
        if (complexity.includes("O(n²)")) return "bg-red-100 text-red-800";
        if (complexity.includes("O(2^n)"))
            return "bg-purple-100 text-purple-800";
        return "bg-gray-100 text-gray-800";
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>⚡</span>
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-2">
                        {t("estimatedComplexity")}
                    </h4>
                    <Badge
                        className={`${getComplexityColor(
                            analysis.complexity
                        )} font-mono text-sm px-3 py-1`}
                    >
                        {analysis.complexity}
                    </Badge>
                </div>

                <div>
                    <h4 className="font-medium mb-2">{t("explanation")}</h4>
                    <p className="text-sm text-muted-foreground">
                        {analysis.explanation}
                    </p>
                </div>

                {analysis.patterns.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">{t("patterns")}</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.patterns.map((pattern, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {pattern}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
