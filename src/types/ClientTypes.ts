export interface ClientType {
  id?: number;
  name?: string;
  color?: string;
  url?: string;
  setByUser?: boolean;
}

export interface UserState {
  user: {
    name: string;
    color: string;
    avatar_url?: string;
  } | null;
}
