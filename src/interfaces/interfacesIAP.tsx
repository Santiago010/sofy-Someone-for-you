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

export interface ResMembersCommunity {
  data: DataMembersCommunity[];
  meta: Meta;
}

export interface DataMembersCommunity {
  uid: string;
  name: string;
  avatar: string;
  status: string;
  role: string;
  lastActiveAt: number;
  scope: string;
  joinedAt: number;
  createdAt: number;
}

export interface Meta {
  pagination: Pagination;
  cursor: Cursor;
}

export interface Cursor {
  joinedAt: number;
  affix: string;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface ResFeedOfCommunity {
  data: DatResFeedCommunity[];
  meta: Meta;
}

export interface DatResFeedCommunity {
  id: string;
  muid: string;
  conversationId: string;
  sender: string;
  receiverType: string;
  receiver: string;
  category: string;
  type: string;
  data: SubDataRedFeedCommunity;
  sentAt: number;
  deliveredAt?: number;
  updatedAt: number;
  readAt?: number;
}

export interface SubDataRedFeedCommunity {
  attachments?: Attachment[];
  entities: Entities;
  text: string;
}

export interface Attachment {
  mimeType: string;
  name: string;
  url: string;
}

export interface Entities {
  receiver: Receiver;
  sender: Sender;
}

export interface Receiver {
  entity: ReceiverEntity;
  entityType: string;
}

export interface Sender {
  entity: SenderEntity;
  entityType: string;
}

export interface SenderEntity {
  name: string;
  role: string;
  status: string;
  uid: string;
  createdAt?: number;
  lastActiveAt?: number;
  avatar?: string;
}

export interface Meta {
  current: Current;
  next: Next;
}

export interface Current {
  limit: number;
  count: number;
}

export interface Next {
  affix: string;
  sentAt: number;
  id: string;
}

export interface ResMessageOfCommunity {
  data: DataMessageOfCommunity[];
  meta: Meta;
}

export interface DataMessageOfCommunity {
  id: string;
  muid: string;
  conversationId: string;
  sender: string;
  receiverType: string;
  receiver: string;
  category: string;
  type: string;
  data: DataMessageOfCommunityData;
  sentAt: number;
  updatedAt: number;
}

export interface DataMessageOfCommunityData {
  entities: Entities;
  reactions: Reaction[];
  resource: string;
  text?: string;
  attachments?: Attachment[];
  category?: string;
  file?: File;
  name?: string;
  sender?: EntitiesSender;
  type?: string;
  url?: string;
}

export interface Reaction {
  reaction: string;
  count: number;
}

export interface Attachment {
  extension: string;
  mimeType: string;
  name: string;
  size: number;
  url: string;
}

export interface Entities {
  receiver: Receiver;
  sender: EntitiesSender;
}

export interface Receiver {
  entity: ReceiverEntity;
  entityType: string;
}

export interface ReceiverEntity {
  conversationId: string;
  createdAt: number;
  description: string;
  guid: string;
  hasJoined: boolean;
  icon: string;
  joinedAt: number;
  membersCount: number;
  name: string;
  onlineMembersCount: number;
  owner: string;
  scope: string;
  type: string;
  updatedAt: number;
}

export interface EntitiesSender {
  entity: SenderEntity;
  entityType: string;
}

export interface File {
  name: string;
  type: string;
  uri: string;
}

export interface DataSender {
  authToken: string;
  blockedByMe: boolean;
  deactivatedAt: number;
  hasBlockedMe: boolean;
  lastActiveAt: number;
  avatar?: string;
  name: string;
  role: string;
  status: string;
  uid: string;
}

export interface Meta {
  current: Current;
  next: Next;
}

export interface Current {
  limit: number;
  count: number;
}

export interface Next {
  affix: string;
  sentAt: number;
  id: string;
}
export interface ResSendReaction {
  data: ResSendReactionData;
}

export interface ResSendReactionData {
  id: string;
  conversationId: string;
  sender: string;
  receiverType: string;
  receiver: string;
  category: string;
  type: string;
  data: DataData;
  sentAt: number;
  updatedAt: number;
}

export interface DataData {
  text: string;
  entities: Entities;
  reactions: Reaction[];
}

export interface Reaction {
  reaction: string;
  count: number;
  reactedByMe?: boolean;
}

export interface ResAddMember {
  data: ResAddMemberData;
}

export interface ResAddMemberData {
  usersToBan: Admins;
  admins: Admins;
  moderators: Admins;
  participants: Participants;
}

export interface Admins {}

export interface Participants {
  '19': The19;
}

export interface The19 {
  success: boolean;
  data: The19_Data;
}

export interface The19_Data {
  id: string;
  conversationId: string;
  sender: string;
  receiverType: string;
  receiver: string;
  category: string;
  type: string;
  data: DataData;
  sentAt: number;
  updatedAt: number;
}

export interface DataData {
  action: string;
  entities: Entities;
}

export interface Entities {
  by: By;
  for: For;
  on: By;
}

export interface By {
  entity: ByEntity;
  entityType: string;
}

export interface ByEntity {
  uid: string;
  name: string;
  status: string;
  role: string;
  createdAt: number;
  avatar?: string;
}

export interface For {
  entity: ForEntity;
  entityType: string;
}

export interface ForEntity {
  guid: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  membersCount: number;
  conversationId: string;
  createdAt: number;
  owner: string;
  updatedAt: number;
  onlineMembersCount: number;
}

export interface ResRemoveMember {
  data: DataRestRemoveMember;
}

export interface DataRestRemoveMember {
  success: boolean;
  message: string;
}

export interface ResSendMessageGroup {
  data: ResSendMessageGroupData;
}

export interface ResSendMessageGroupData {
  id: string;
  muid: string;
  conversationId: string;
  sender: string;
  receiverType: string;
  receiver: string;
  category: string;
  type: string;
  data: DataSendMessageGroup;
  sentAt: number;
  updatedAt: number;
}

export interface DataSendMessageGroup {
  attachments: Attachment[];
  text: string;
  entities: Entities;
}

export interface Attachment {
  url: string;
  name: string;
  mimeType: string;
}

export interface Entities {
  sender: Sender;
  receiver: Receiver;
}

export interface Receiver {
  entity: ReceiverEntity;
  entityType: string;
}

export interface ReceiverEntity {
  guid: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  membersCount: number;
  conversationId: string;
  createdAt: number;
  owner: string;
  updatedAt: number;
  onlineMembersCount: number;
}

export interface Sender {
  entity: SenderEntity;
  entityType: string;
}
