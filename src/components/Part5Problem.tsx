"use client";

import {
  Problem,
  Part,
  Difficulty,
  ProblemStatus,
  SubmissionPayload,
} from "@/types";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Lightbulb, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useAppContext } from "./providers/AppContextProvider";
import Link from "next/link";

interface Props {
  problem: Problem;
  part: Part;
  level: Difficulty;
  nextProblemId: string | null;
}

const Part5Problem = ({ problem, part, level, nextProblemId }: Props) => {
  const { gasWebhookUrl } = useAppContext();
  const [status, setStatus] = useState<ProblemStatus>("unanswered");
  const [answerStatus, setAnswerStatus] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);

  const question = problem.questions[0]; // Part 5 has only one question

  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    if (status !== "unanswered") return;

    const isCorrect = option === question.answer;
    setStatus(isCorrect ? "correct" : "incorrect");
    setAnswerStatus(option);

    // Post to GAS
    if (gasWebhookUrl) {
      const payload: SubmissionPayload = {
        timestamp: new Date().toISOString(),
        problemId: problem.id,
        part,
        level,
        result: isCorrect ? "correct" : "incorrect",
      };

      fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, gasUrl: gasWebhookUrl }),
      }).catch((err) => console.error("Failed to submit result:", err));
    }
  };

  const getButtonClass = (option: "A" | "B" | "C" | "D") => {
    if (status === "unanswered") {
      return "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700";
    }
    const isSelected = answerStatus === option;
    const isCorrectAnswer = option === question.answer;

    if (isCorrectAnswer) return "bg-green-200 border-green-500 text-slate-500";
    if (isSelected && !isCorrectAnswer) return "bg-red-200 border-red-500";

    return "bg-slate-100 text-slate-500 cursor-not-allowed";
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Part 5 - 問題</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg leading-relaxed bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          {question.problem}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["A", "B", "C", "D"] as const).map((option) => (
            <Button
              key={option}
              onClick={() => handleSelectOption(option)}
              disabled={status !== "unanswered"}
              className={`justify-start p-4 h-auto text-left border-1
                 whitespace-normal ${getButtonClass(option)}`}
            >
              <span className="font-bold mr-4">{option}.</span>
              <span>{question.options[option]}</span>
            </Button>
          ))}
        </div>

        {status !== "unanswered" && (
          <div className="border-t pt-6 space-y-4">
            <div
              className={`p-4 rounded-md flex items-start gap-3 ${
                answerStatus === question.answer
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {answerStatus === question.answer ? <CheckCircle /> : <XCircle />}
              <div>
                <h3 className="font-bold">
                  {answerStatus === question.answer ? "正解！" : "不正解"}
                </h3>
                <p>
                  正解は <span className="font-bold">{question.answer}</span>{" "}
                  です。
                </p>
              </div>
            </div>
            <div className="p-4 rounded-md bg-blue-50 border-l-4 border-blue-400 dark:bg-slate-800">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Lightbulb size={20} />
                解説
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {question.explanation}
              </p>
            </div>
            {nextProblemId && (
              <div className="mt-6 text-center">
                <Link
                  href={`/${part}/${level}/${nextProblemId}`}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  次の問題へ
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Part5Problem;
