export type AuthStep = "welcome" | "username";

export interface AuthState {
  step: AuthStep;
  username: string;
}
