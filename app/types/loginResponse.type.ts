export interface AuthTokenResponse {
  accessToken: string;
  tokenExpiryTime: string;
  refreshTokenExpiryTime: string;
  statusCode: number;
}
export interface UserResponse {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  mobile: string;
  phoneVerified: boolean;
  referralCode: string;
  userType: string;
  gender: string;
}

export interface ILoginResponse {
  authTokenResponse: AuthTokenResponse;
  user: UserResponse;
}
