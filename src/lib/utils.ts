import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "hr" | "user";
};
