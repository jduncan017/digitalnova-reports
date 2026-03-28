import fs from "fs/promises";
import path from "path";
import { type Report } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

/** Get all available report dates for a client, sorted newest first. */
export async function getReportDates(clientSlug: string): Promise<string[]> {
  const clientDir = path.join(DATA_DIR, clientSlug);
  try {
    const files = await fs.readdir(clientDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

/** Load a specific report by client slug and date. */
export async function getReport(
  clientSlug: string,
  date: string,
): Promise<Report | null> {
  const filePath = path.join(DATA_DIR, clientSlug, `${date}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Report;
  } catch {
    return null;
  }
}

/** Load all reports for a client, sorted oldest to newest. */
export async function getAllReports(clientSlug: string): Promise<Report[]> {
  const dates = await getReportDates(clientSlug);
  const reports = await Promise.all(
    dates.map((date) => getReport(clientSlug, date)),
  );
  return reports.filter((r): r is Report => r !== null).reverse();
}
