export interface IInitiateSignup {
  execute(email: string): Promise<void>;
}
