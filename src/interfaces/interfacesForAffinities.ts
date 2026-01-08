export interface ResGetUserForInterest {
  error: boolean;
  statusCode: number;
  payload: ListGetUserForInterest[];
  message: string;
}

export interface ListGetUserForInterest {
  id: number;
  name: string;
  lastname: string;
  address: null;
  email: string;
  phone: null;
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
  gender: Gender;
  interested_gender: Gender;
  max_distance_km: number;
  min_age: number;
  max_age: number;
  individualFiles: IndividualFile[];
  categories: Category[];
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
