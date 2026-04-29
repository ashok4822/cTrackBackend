export interface GoogleUserDetails {
  email: string;
  name?: string;
  googleId: string;
  profileImage?: string;
}

export interface IAuthService {
  verifyGoogleToken(code: string): Promise<GoogleUserDetails>;
}
