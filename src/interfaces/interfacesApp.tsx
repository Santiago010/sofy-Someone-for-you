import {Float} from 'react-native/Libraries/Types/CodegenTypes';

export interface Usuario {
  uid: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export interface SignUpResponse {
  error: boolean;
  statusCode: number;
  payload: PayloadSignUp;
  message: string;
}

export interface PayloadSignUp {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  identification_number: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  date_of_birth: null;
  max_distance_km: null;
  min_age: null;
  max_age: null;
}

export interface UserChat {
  id: string;
}

export interface SignUpError {
  error: boolean;
  message: string;
  payload: null;
  statusCode: number;
}
export interface SignInError {
  error: boolean;
  payload: null;
  statusCode: number;
  message: string;
}

export interface VerificationCodeError {
  error: boolean;
  payload: null;
  statusCode: number;
  message: string;
}

export interface InterestResponse {
  id: number;
  name: string;
}

export interface GenderResponse {
  id: number;
  name: string;
}

export interface UploadFile {
  uri: string;
  type: string;
  name: string;
}

export interface CompleteInfoUser {
  categories: string;
  date_of_birth: string; // ISO date format YYYY-MM-DD
  gender_id: number;
  interested_gender_id: number;
  max_distance_km: Float;
  min_age: number;
  max_age: number;
  email: string;
  photos?: UploadFile[];
  //   TODO:PONER descripcion
}

export interface EditDetailsInfoUser {
  categories?: string;
  date_of_birth?: string; // ISO date format YYYY-MM-DD
  gender_id?: number;
  interested_gender_id?: number;
  max_distance_km?: number; // Cambié Float por number
  min_age?: number;
  max_age?: number;
  email?: string;
  name?: string;
  lastname?: string;
  //   TODO:PONER descripcion
}

export interface CompleteInfoUserResponse {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  identification_number: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  date_of_birth: Date;
  gender: GenderResponse;
  interested_gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
}

export interface CompleteInfoUserError {
  error: boolean;
  message: string;
  payload: null;
  statusCode: number;
}

export interface GetDetailsResponse {
  error: boolean;
  statusCode: number;
  payload: PayloadDetails;
  message: string;
}

export interface PayloadDetails {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  identification_number: null;
  country: null;
  city: null;
  identificationType: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  date_of_birth: Date;
  gender: GenderResponse;
  interested_gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: IndividualFile[];
}

export interface IndividualFile {
  id: number;
  file: File;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface File {
  id: number;
  versionId: string;
  type: null;
  size: number;
  bucketName: string;
  etag: null;
  uploadedBy: null;
  fileName: string;
  mimeType: string;
  isNotificated: boolean;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

export interface ResponseEditDetailsUser {
  error: boolean;
  statusCode: number;
  payload: PayloadResponseEditDetailsUser;
  message: string;
}

export interface PayloadResponseEditDetailsUser {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  identification_number: null;
  country: null;
  city: null;
  identificationType: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  date_of_birth: Date;
  gender: GenderResponse;
  interested_gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: any[];
}
