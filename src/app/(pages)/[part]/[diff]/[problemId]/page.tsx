import {
  getAvailableDifficulties,
  getAvailableParts,
  getNextProblemId,
  getProblemById,
  getProblems,
} from "@/lib/problems";
import { Part, Difficulty } from "@/types";
import Part5Problem from "@/components/Part5Problem";
import Part6And7Problem from "@/components/Part6And7Problem";
import Link from "next/link";

type Props = {
  params: Promise<{
    part: Part;
    diff: Difficulty;
    problemId: string;
  }>;
};

// ビルド時に静的パスを生成する
export async function generateStaticParams() {
  const allParams = [];
  const parts = await getAvailableParts();

  for (const part of parts) {
    const difficulties = await getAvailableDifficulties(part);
    for (const diff of difficulties) {
      const problems = await getProblems(part, diff);
      for (const problem of problems) {
        allParams.push({
          part,
          diff,
          problemId: problem.id,
        });
      }
    }
  }

  return allParams;
}

export default async function ProblemPage({ params }: Props) {
  const { part, diff, problemId } = await params;
  const problem = await getProblemById(part, diff, problemId);
  const nextProblemId = getNextProblemId(problemId);

  console.log(nextProblemId);

  if (!problem) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          問題が見つかりません
        </h1>
        <p className="mt-4">
          指定された問題ID ({problemId}) は存在しませんでした。
        </p>
        <Link
          href={`/${part}/${diff}`}
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          問題一覧に戻る
        </Link>
      </div>
    );
  }

  const partNumber = parseInt(part.replace("part", ""), 10);

  return (
    <div>
      {partNumber === 5 ? (
        <Part5Problem
          problem={problem}
          part={part}
          level={diff}
          nextProblemId={nextProblemId}
        />
      ) : (
        <Part6And7Problem
          problem={problem}
          part={part}
          level={diff}
          nextProblemId={nextProblemId}
        />
      )}
      <div className="text-center mt-12">
        <Link
          href={`/${part}/${diff}`}
          className="text-blue-600 hover:underline"
        >
          &larr; 問題一覧に戻る
        </Link>
      </div>
    </div>
  );
}
