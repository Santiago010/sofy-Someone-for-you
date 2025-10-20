export interface Usuario {
  uid: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordVerification: string;
}

export interface loginData {
  email: string;
  password: string;
}

export interface CardSwipe {
  id: number;
  biography: string;
  interest: string[];
  age: number;
  color: string;
  images: string[];
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  error: boolean;
  message: string;
  payload: Payload;
  statusCode: number;
}

export interface Payload {
  transactionId: string;
}

export interface verificationCodeData {
  code: string;
  transactionId: string;
}

export interface VerificationCodeResponse {
  error: boolean;
  message: string;
  payload: Payload;
  statusCode: number;
}

export interface Payload {
  messageAuth: MessageAuth;
}

export interface MessageAuth {
  createdAt: Date;
  exp: string;
  id: number;
  refreshToken: string;
  transactionId: string;
  updatedAt: Date;
}

export interface RefreshTokenResponse {
  error: boolean;
  message: string;
  payload: Payload;
  statusCode: number;
}

export interface Payload {
  access_token: string;
  expires_in: number;
  'not-before-policy': number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
}
