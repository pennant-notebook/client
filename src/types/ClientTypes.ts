export interface BaseUser {
  id?: number;
  name?: string;
  color?: string;
}

export interface UserState extends BaseUser {
  login?: string;
  setByUser?: boolean;
  avatar_url?: string; // for github
  avatar?: string; // for gmail
}

export interface AwarenessUserState {
  user: {
    id: number;
    name: string;
    color: string;
    avatar_url?: string;
    avatar?: string;
  } | null;
}