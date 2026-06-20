export type AuthMethod = "google" | "phone" | "email";

export type AuthStep =
  | "auth-method"
  | "phone"
  | "email"
  | "otp"
  | "age-gate"
  | "parent-contact"
  | "consent-sent"
  | "username";

export interface AuthState {
  step: AuthStep;
  authMethod: AuthMethod | null;
  phone: string;
  email: string;
  otp: string[];
  dob: string;
  parentContact: { type: "phone" | "email"; value: string } | null;
  username: string;
}
