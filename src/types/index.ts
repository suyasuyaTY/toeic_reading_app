export type Problem = {
  id: string;
  content: string;
  questions: Question[];
};

export type Question = {
  id: string;
  problem: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type Part = "part5" | "part6" | "part7";
export type Difficulty = "600" | "700" | "800";

// Data format for sending to GAS
export type SubmissionPayload = {
  timestamp: string;
  problemId: string;
  part: Part;
  level: Difficulty;
  result: ProblemStatus;
};

export type ProblemStatus = "correct" | "incorrect" | "unanswered";

export type FetchedResults = {
  problemId: string;
  result: ProblemStatus;
};
