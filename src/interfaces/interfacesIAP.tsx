export interface ListGroup {
  data: Data[];
  meta: Meta;
}

export interface Data {
  guid: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  scope: string;
  membersCount: number;
  joinedAt: number;
  conversationId: string;
  hasJoined: boolean;
  createdAt: number;
  owner: string;
  tags: string[];
}

export interface Meta {
  pagination: Pagination;
  cursor: Cursor;
}

export interface Cursor {
  updatedAt: number;
  affix: string;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}
export interface ResUploadFileGroup {
  error: boolean;
  statusCode: number;
  payload: Payload;
  message: string;
}

export interface Payload {
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

export interface ResCreateGroup {
  data: ResCreateGroupData;
}

export interface ResCreateGroupData {
  guid: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  membersCount: number;
  conversationId: string;
  createdAt: number;
  owner: string;
  tags: string[];
  members: Members;
}

export interface Members {
  data: MembersData;
  debug: any[];
}

export interface MembersData {
  usersToBan: Moderators;
  admins: any;
  //   admins: Admins;
  moderators: Moderators;
  participants: Moderators;
}

export interface Admins {
  '15': The15;
}

export interface The15 {
  success: boolean;
  error: Error;
}

export interface Error {
  code: string;
  message: string;
}

export interface Moderators {}

export interface ResDetailsGroup {
  data: DataGroup;
}

export interface DataGroup {
  guid: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  membersCount: number;
  conversationId: string;
  createdAt: number;
  owner: string;
  onlineMembersCount: number;
  tags: string[];
}
