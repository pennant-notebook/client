export interface ClientType {
  id?: number;
  name?: string;
  color?: string;
  url?: string;
}

export interface UserState {
  user: {
    name: string;
    color: string;
  } | null;
}