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
import {
  CheckCircle,
  XCircle,
  PanelRightOpen,
  X,
  ArrowRight,
} from "lucide-react";
import { useAppContext } from "./providers/AppContextProvider";
import Link from "next/link";

interface Props {
  problem: Problem;
  part: Part;
  level: Difficulty;
  nextProblemId: string | null;
}

const Part6And7Problem = ({ problem, part, level, nextProblemId }: Props) => {
  const { gasWebhookUrl } = useAppContext();
  const [status, setStatus] = useState<ProblemStatus>("unanswered");
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: "A" | "B" | "C" | "D";
  }>({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSubmit = () => {
    if (status !== "unanswered") return;

    let allCorrect = true;

    problem.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.answer;
      if (!isCorrect) allCorrect = false;
    });

    setStatus(allCorrect ? "correct" : "incorrect");
    setIsPanelOpen(true);

    // Post to GAS
    if (gasWebhookUrl) {
      const payload: SubmissionPayload = {
        timestamp: new Date().toISOString(),
        problemId: problem.id,
        part,
        level,
        result: allCorrect ? "correct" : "incorrect",
      };
      fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, gasUrl: gasWebhookUrl }),
      }).catch((err) => console.error("Failed to submit result:", err));
    }
  };

  const handleSelectOption = (
    questionId: string,
    option: "A" | "B" | "C" | "D"
  ) => {
    if (status !== "unanswered") return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const getOptionClass = (qId: string, option: "A" | "B" | "C" | "D") => {
    if (status === "unanswered") {
      return selectedAnswers[qId] === option
        ? "bg-blue-200 border-blue-500 dark:bg-blue-400 dark:border-blue-800"
        : "bg-white hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700";
    }

    const isCorrectAnswer =
      option === problem.questions.find((q) => q.id === qId)!.answer;

    if (isCorrectAnswer)
      return "bg-green-200 border-green-500 dark:bg-green-800";
    if (selectedAnswers[qId] === option)
      return "bg-red-200 border-red-500 dark:bg-red-800";

    return "bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-600 dark:text-slate-100";
  };

  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === problem.questions.length;

  const QuestionsPanel = () => (
    <div className="space-y-8">
      {problem.questions.map((q, index) => (
        <div key={q.id}>
          <p className="font-bold mb-2">
            問題 {index + 1}: {q.problem}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {(["A", "B", "C", "D"] as const).map((opt) => (
              <Button
                key={opt}
                variant="outline"
                onClick={() => handleSelectOption(q.id, opt)}
                disabled={status !== "unanswered"}
                className={`text-left justify-start ${getOptionClass(
                  q.id,
                  opt
                )}`}
              >
                {opt}. {q.options[opt]}
              </Button>
            ))}
          </div>
          {status !== "unanswered" && (
            <div className="mt-4 space-y-2">
              <div
                className={`text-sm p-2 rounded-md flex items-center gap-2 ${
                  selectedAnswers[q.id] === q.answer
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedAnswers[q.id] === q.answer ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span>正解: {q.answer}</span>
              </div>
              <div className="p-2 rounded-md bg-blue-50 border-l-2 border-blue-400">
                <p className="text-sm text-slate-700">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>
      ))}
      {status === "unanswered" && (
        <Button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered}
          className="w-full mt-8"
        >
          採点する
        </Button>
      )}

      {status !== "unanswered" && nextProblemId && (
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
  );

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 relative">
        {/* Passage */}
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm border dark:bg-slate-800">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">
            Part {part.replace("part", "")} - 読解文
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: problem.content.replace(/\n/g, "<br/>"),
            }}
          />
        </div>

        {/* Questions for Desktop */}
        <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm border dark:bg-slate-800">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">設問</h2>
          <QuestionsPanel />
        </div>
      </div>

      {/* Floating button for mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-10">
        <Button
          onClick={() => setIsPanelOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          <PanelRightOpen size={28} />
        </Button>
      </div>

      {/* Slide-in panel for mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-10 transition-opacity ${
          isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsPanelOpen(false)}
      ></div>
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-4/5 max-w-md bg-white shadow-xl z-30 transform transition-transform p-6 overflow-y-auto dark:bg-slate-800 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-bold">設問</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPanelOpen(false)}
          >
            <X />
          </Button>
        </div>
        <QuestionsPanel />
      </div>
    </div>
  );
};

export default Part6And7Problem;
