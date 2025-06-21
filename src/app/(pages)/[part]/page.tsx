import { getAvailableDifficulties } from "@/lib/problems";
import { Part } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronRight, BarChart } from "lucide-react";

type Props = {
  params: Promise<{ part: Part }>;
};

export default async function DifficultyPage({ params }: Props) {
  const { part } = await params;
  const difficulties = await getAvailableDifficulties(part);
  const partNumber = part.replace("part", "");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Part {partNumber}</h1>
      <p className="text-center text-slate-600">
        目標スコアに応じた難易度を選んでください。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficulties.map((diff) => (
          <Link key={diff} href={`/${part}/${diff}`}>
            <Card className="hover:shadow-lg hover:border-green-500 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-2xl">
                  <div className="flex items-center gap-2">
                    <BarChart className="text-green-500" />
                    {diff}点レベル
                  </div>
                  <ChevronRight className="text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-300">
                  目標スコア{diff}点向けの演習問題です。
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!difficulties.length && (
          <p className="text-center col-span-full text-red-500">
            このパートの難易度別問題データが見つかりません。
          </p>
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; パート選択に戻る
        </Link>
      </div>
    </div>
  );
}
