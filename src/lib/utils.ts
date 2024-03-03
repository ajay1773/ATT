import { type ClassValue, clsx } from "clsx";
import { startCase, toLower } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeUnderscore = (word: string): string => {
  return word.split("_").join(" ");
};

export const toLowerCase = (str: string): string => startCase(toLower(str));
