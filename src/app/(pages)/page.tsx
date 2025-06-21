import { getAvailableParts } from "@/lib/problems";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";

export default async function HomePage() {
  const parts = await getAvailableParts();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">
        TOEICリーディングセクション
      </h1>
      <p className="text-center text-slate-600">
        挑戦したいパートを選んでください。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link key={part} href={`/${part}`}>
            <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-2xl">
                  Part {part.replace("part", "")}
                  <ChevronRight className="text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">
                  {part === "part5" && "短文穴埋め問題"}
                  {part === "part6" && "長文穴埋め問題"}
                  {part === "part7" && "読解問題"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!parts.length && (
          <p className="text-center col-span-full text-red-500">
            問題データが見つかりません。/public/problems
            以下に問題JSONファイルを追加してください。
          </p>
        )}
      </div>
    </div>
  );
}
