/* eslint-disable no-use-before-define */

export interface Comment {
  answer: boolean
  content: string
  created_at: string
  id: number
  likes: number[]
  post: number
  updated_at: string
  user: User
}

export interface Post {
  id: number
  tittle: string
  user: User
  content: string
  views: number[]
  likes: number[]
  comments: number[]
  closed: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  nickname: string
  email: string
  comments: number[]
  comment_likes: number[]
  posts: number[]
  post_likes: number[]
  post_views: number[]
  created_at: string
  updated_at: string
}

export interface ApiRes<T> {
  0: { message: string }
  1: T
}
