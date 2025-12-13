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
  access_token: string;
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

export interface InterestAndSubInterestResponse {
  id: number;
  name: string;
  subcategories: subcategories[];
}

export interface subcategories {
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

export interface CompleteInfoUser2 {
  subcategories: string;
  age: number; // ISO date format YYYY-MM-DD
  gender_id: number;
  interested_gender_id: number;
  max_distance_km: Float;
  min_age: number;
  max_age: number;
  email: string;
  photos: UploadFile[];
  description: string;
  //   TODO:PONER descripcion
}

export interface CompleteInfoUser {
  categories: string;
  age: number; // ISO date format YYYY-MM-DD
  gender_id: number;
  interested_gender_id: number;
  max_distance_km: Float;
  min_age: number;
  max_age: number;
  email: string;
  photos: UploadFile[];
  description: string;
  //   TODO:PONER descripcion
}

export interface EditDetailsInfoUser2 {
  subcategories?: string;
  age?: number; // ISO date format YYYY-MM-DD
  gender_id?: number;
  interested_gender_id?: number;
  max_distance_km?: number; // Cambié Float por number
  min_age?: number;
  max_age?: number;
  email?: string;
  name?: string;
  lastname?: string;
  phone?: string;
  description?: string;
  //   TODO:PONER descripcion
}

export interface EditDetailsInfoUser {
  categories?: string;
  age?: number; // ISO date format YYYY-MM-DD
  gender_id?: number;
  interested_gender_id?: number;
  max_distance_km?: number; // Cambié Float por number
  min_age?: number;
  max_age?: number;
  email?: string;
  name?: string;
  lastname?: string;
  phone?: string;
  description?: string;
  //   TODO:PONER descripcion
}

export interface ChangePasspord {
  newPassword: string;
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
  payload: PayloadDetails2;
  message: string;
}

export interface PayloadDetails2 {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: string;
  description: string;
  identification_number: null;
  country: null;
  city: null;
  identificationType: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  age: number;
  gender: GenderResponse;
  interested_gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: IndividualFile[];
  categories: InterestAndSubInterestResponse[];
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
  individualFiles: IndividualFile[];
}

export interface IDResponse {
  error: boolean;
  statusCode: number;
  payload: PayloadIDResponse;
  message: string;
}

export interface PayloadIDResponse {
  id: number;
}
export interface RecomendationsResponse {
  error: boolean;
  statusCode: number;
  payload: PayloadRecomendationsResponse[];
  meta: Meta;
  message: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasSubcategories: boolean;
}

export interface PayloadRecomendationsResponse {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null | string;
  description: null | string;
  identification_number: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  age: number;
  gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: IndividualFile[];
  categories: Category[];
  matchScore: number;
  subcategoryMatches: number;
}

export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  category: Gender;
}

export interface Gender {
  id: number;
  name: string;
}

export interface IndividualFile {
  id: number;
  file: File;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ResponseWhoLikedMe {
  error: boolean;
  statusCode: number;
  payload: PayloadWhoLikedMe[];
  message: string;
}

export interface PayloadWhoLikedMe {
  id: number;
  fromIndividual: FromIndividual;
  isLike: boolean;
  created_at: Date;
}

export interface FromIndividual {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  description: string;
  identification_number: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  age: number;
  gender: GenderResponse;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: IndividualFile[];
  categories: Category[];
}

export interface ResponseMyLikes {
  error: boolean;
  statusCode: number;
  payload: PayloadResponseMyLikes[];
  message: string;
}

export interface PayloadResponseMyLikes {
  id: number;
  toIndividual: ToIndividual;
  isLike: boolean;
  created_at: Date;
}

export interface ToIndividual {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
  description: null | string;
  identification_number: null;
  profile_image: null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  age: number | null;
  gender: GenderResponse | null;
  max_distance_km: number | null;
  min_age: number | null;
  max_age: number | null;
  individualFiles: IndividualFile[];
  categories: Category[];
}

export interface MatchResponse {
  matchedWith: IndividualMatched;
  message: string;
  timestamp: string; // ISO 8601
}

export interface IndividualMatched {
  id: number;
  name: string;
  lastname: string;
  address: string | null;
  age: number;
  categories: Category[];
  created_at: string; // ISO 8601
  description: string;
  email: string;
  gender: GenderResponse;
  identification_number: string | null;
  individualFiles: IndividualFile[];
  is_active: boolean;
  max_age: number;
  max_distance_km: number;
  min_age: number;
  phone: string;
  profile_image: string | null;
  updated_at: string; // ISO 8601
}

export interface dataForVerifySubscription {
  productId?: string;
  token?: string;
  platform: 'ios' | 'android';
  userId?: number;
}

export interface VerifySubscriptionResponse {
  expires: string;
  isConnect: boolean;
  message: string;
  success: boolean;
}

export interface statusSuscriptionResponse {
  expires: string;
  isConnect: boolean;
}
