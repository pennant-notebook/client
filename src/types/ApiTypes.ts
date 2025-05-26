/**
 * API response types for DynamoDB operations
 */

export interface Notebook {
  docID: string;
  title: string;
  created: string;
  language: string;
  lastUpdated?: string;
  wsToken?: string;
}

export interface UserProfile {
  id?: string;
  username: string;
  email?: string;
  githubId?: string;
  googleId?: string;
  notebooks?: Notebook[];
  avatar_url?: string;
}

export interface DocumentDetails {
  docID: string;
  title: string;
  wsToken: string;
  language: string;
  created: string;
  lastUpdated?: string;
  owner: string;
}

export interface CreateUserResponse {
  email: string;
  id: string;
  username: string;
}

export interface CreateDocResponse {
  docID: string;
  title: string;
  wsToken: string;
  username: string;
  language: string;
  created: string;
}

export interface EditDocTitleResponse {
  docID: string;
  title: string;
  success: boolean;
}

export interface DeleteDocResponse {
  docID: string;
  success: boolean;
  message?: string;
}