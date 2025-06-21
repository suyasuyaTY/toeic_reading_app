import fs from "fs/promises";
import path from "path";
import { Problem, Part, Difficulty } from "@/types";

const problemsDirectory = path.join(process.cwd(), "public/problems");

// public/problems に存在するPartのディレクトリ名一覧を取得する
export async function getAvailableParts(): Promise<Part[]> {
  try {
    const parts = await fs.readdir(problemsDirectory);
    // .DS_Storeなどの隠しファイルを除外
    return parts.filter((part) => part.startsWith("part")) as Part[];
  } catch (error) {
    console.error("Error reading parts directory:", error);
    return [];
  }
}

// 指定されたPartに存在する難易度のJSONファイル名一覧を取得する
export async function getAvailableDifficulties(
  part: Part
): Promise<Difficulty[]> {
  try {
    const partDirectory = path.join(problemsDirectory, part);
    const files = await fs.readdir(partDirectory);
    return files
      .map((file) => file.replace(".json", ""))
      .filter((diff) => ["600", "700", "800"].includes(diff)) as Difficulty[];
  } catch (error) {
    console.error(`Error reading difficulties for ${part}:`, error);
    return [];
  }
}

// 指定されたPartと難易度の問題データをJSONファイルから読み込む
export async function getProblems(
  part: Part,
  diff: Difficulty
): Promise<Problem[]> {
  const filePath = path.join(problemsDirectory, part, `${diff}.json`);
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return data as Problem[];
  } catch (error) {
    console.error(
      `Error reading or parsing problem file for ${part}/${diff}:`,
      error
    );
    return [];
  }
}

/**
 * 指定されたIDの問題データを取得する
 */
export async function getProblemById(
  part: Part,
  diff: Difficulty,
  problemId: string
): Promise<Problem | null> {
  const problems = await getProblems(part, diff);
  const problem = problems.find((p) => p.id === problemId);
  return problem || null;
}

export function getNextProblemId(currentId: string): string | null {
  const match = currentId.match(/^([a-zA-Z0-9]+)_([0-9]+)_([0-9]{3})$/);
  if (!match) return null;

  const [, prefix, group, countStr] = match;
  const count = parseInt(countStr, 10);

  if (count >= 999) return null;

  const nextCount = (count + 1).toString().padStart(3, "0");
  return `${prefix}_${group}_${nextCount}`;
}
