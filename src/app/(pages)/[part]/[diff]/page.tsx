import {
  getProblems,
  getAvailableParts,
  getAvailableDifficulties,
} from "@/lib/problems";
import { Part, Difficulty } from "@/types";
import Link from "next/link";
import ProblemListClient from "@/components/ProblemListClient";

type Props = {
  params: Promise<{ part: Part; diff: Difficulty }>;
};

// ビルド時に静的パスを生成する
export async function generateStaticParams() {
  const parts = await getAvailableParts();
  const params = await Promise.all(
    parts.map(async (part) => {
      const difficulties = await getAvailableDifficulties(part);
      return difficulties.map((diff) => ({ part, diff }));
    })
  );
  return params.flat();
}

export default async function ProblemListPage({ params }: Props) {
  const { part, diff } = await params;
  // ビルド時にサーバーサイドで問題データを取得
  const problems = await getProblems(part, diff);
  const partNumber = part.replace("part", "");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Part {partNumber} - {diff}点レベル 問題一覧
      </h1>

      {/* クライアントコンポーネントに問題データとパラメータを渡す */}
      <ProblemListClient problems={problems} part={part} diff={diff} />

      <div className="text-center mt-8">
        <Link href={`/${part}`} className="text-blue-600 hover:underline">
          &larr; 難易度選択に戻る
        </Link>
      </div>
    </div>
  );
}
