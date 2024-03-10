import fs from "fs-extra";
import csvParser from "csv-parser";
import path from "path";

export async function ensureFolderExists(folderPath: string): Promise<void> {
  try {
    // Ensure that the folder exists, creating it if it doesn't
    await fs.ensureDir(folderPath);
    console.log(`Folder created or already exists at ${folderPath}`);
  } catch (err) {
    console.error("Error ensuring folder exists:", err);
  }
}

export function createBufferFromByteArray(byteArrayString: string): Buffer {
  return Buffer.from(byteArrayString, "base64");
}

export async function writeFileToFolder(
  blob: Buffer,
  filePath: string,
): Promise<string> {
  try {
    const fileName = "holidays.csv";
    const completePath = path.join(filePath, fileName);
    await fs.outputFile(completePath, blob);
    return completePath;
  } catch (error) {
    console.error("Error while writing file.");
    return "";
  }
}

export async function readCsvFile<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const data: T[] = [];
    const stream = fs
      .createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: T) => {
        data.push(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(data);
      })
      .on("error", (error: Error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
}
