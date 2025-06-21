"use client";
import {
  Part,
  Difficulty,
  FetchedResults,
  Problem,
  ProblemStatus,
} from "@/types";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { FileQuestion, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/providers/AppContextProvider";

type Props = {
  problems: Problem[];
  part: Part;
  diff: Difficulty;
};

interface ApiResponse {
  status: string;
  data: FetchedResults[]; // 配列はこのオブジェクトの data プロパティに入っている
  // countなど、他にもキーがあればここに追加
}

export default function ProblemListClient({ problems, part, diff }: Props) {
  const { gasWebhookUrl } = useAppContext();
  const [resultRecord, setResultRecord] = useState<
    Record<string, ProblemStatus>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // GAS URLが設定されている場合のみ、解答状況を取得
    const fetchResults = async () => {
      if (gasWebhookUrl) {
        try {
          const url = new URL(gasWebhookUrl);
          url.searchParams.set("part", part);
          url.searchParams.set("level", diff);

          const resultRes = await fetch(
            `/api/submit?gasUrl=${encodeURIComponent(url.toString())}`
          );

          if (resultRes.ok) {
            const responseObject: ApiResponse = await resultRes.json();

            // dataプロパティから配列を取得
            const resultData = responseObject.data;

            const newRecord = resultData.reduce((acc, item) => {
              acc[item.problemId] = item.result ? item.result : "unanswered";
              return acc;
            }, {} as Record<string, ProblemStatus>);

            // 変換したRecordをstateにセットする
            setResultRecord(newRecord);
            console.log(newRecord["p5_600_001"]);
          } else {
            console.warn("Could not fetch results from GAS.");
          }
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      }
      setIsLoading(false);
    };

    fetchResults();
  }, [part, diff, gasWebhookUrl]);

  const getStatusIcon = (problemId: string) => {
    const status = resultRecord[problemId];
    switch (status) {
      case "correct":
        return <CheckCircle className="text-green-500" />;
      case "incorrect":
        return <XCircle className="text-red-500" />;
      default:
        return <FileQuestion className="text-slate-400" />;
    }
  };

  const getCardClassName = (problemId: string) => {
    const status = resultRecord[problemId];
    console.log(problemId, status === "correct");
    const baseClass =
      "hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex items-center justify-between p-4";
    if (isLoading) return `${baseClass} bg-slate-50 animate-pulse`;
    if (status === "correct") return `${baseClass} bg-green-50`;
    if (status === "incorrect") return `${baseClass} bg-red-50`;
    if (status === "unanswered") return `${baseClass}  dark:bg-gray-950`;
    return baseClass;
  };

  if (!problems.length) {
    return (
      <p className="text-center col-span-full text-red-500">
        この条件の問題が見つかりません。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem, index) => (
        <Link key={problem.id} href={`/${part}/${diff}/${problem.id}`}>
          <Card className={getCardClassName(problem.id)}>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <FileQuestion className="text-slate-300" />
              ) : (
                getStatusIcon(problem.id)
              )}
              <span className="font-medium">問題 {index + 1}</span>
            </div>
            <span className="text-sm text-slate-500">{problem.id}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
