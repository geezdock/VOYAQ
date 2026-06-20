import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z
  .string()
  .email("Enter a valid email address");

export const otpSchema = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d{6}$/, "OTP must be numeric");

export const dobSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .refine(
    (val) => {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 0 && age <= 120;
    },
    { message: "Enter a valid date of birth" }
  );

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9]([a-zA-Z0-9_]*[a-zA-Z0-9])?$/,
    "Only letters, numbers, and underscores"
  )
  .regex(/^[^_]/, "Cannot start with an underscore")
  .refine(
    (val) => !val.includes("__"),
    "No consecutive underscores"
  );

const TAKEN_USERNAMES = [
  "admin",
  "user",
  "test",
  "trip",
  "squad",
  "travel",
  "voyaq",
  "demo",
  "guest",
  "support",
  "help",
  "info",
  "contact",
  "team",
  "group",
];

export function isUsernameAvailable(username: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!TAKEN_USERNAMES.includes(username.toLowerCase()));
    }, 600 + Math.random() * 400);
  });
}
