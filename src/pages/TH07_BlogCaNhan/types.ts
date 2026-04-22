export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
  skills?: string[];
  socials?: {
    facebook?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  author: Author;
}
