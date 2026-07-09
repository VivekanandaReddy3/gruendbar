export interface FounderRef {
  _id: string;
  name?: string;
  username?: string;
  image?: string;
  bio?: string;
  email?: string;
}

export interface StartupItem {
  _id: string;
  _createdAt: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  category?: string;
  image?: string;
  views?: number;
  upvotes?: number;
  lookingFor?: string[];
  author?: FounderRef;
}

export interface StartupDetail extends StartupItem {
  pitch?: string;
  voters?: string[];
}
