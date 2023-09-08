import axios from "axios"

export const getData = {
  allPosts,
  allPostsFromUser,
  allCommentsFromPost,
  postByID,
  userByID,
  profile
}

export const old_API_URL = "http://127.0.0.1:8080/api"

export const API_URL = "https://backend-forum.onrender.com/api"

interface Comment {
  answer: boolean,
  content: string,
  created_at: string,
  id: number,
  likes: number[],
  post: number,
  updated_at: string,
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

async function allPosts(): Promise<Post[]> {
  const request = await axios.get(`${API_URL}/posts`)
  const data: ApiRes<Post[]> = request.data
  
  return data[1]
}

async function allPostsFromUser(id: number): Promise<Post[]> {
  const request = await axios.get(`${API_URL}/posts/user/${id}`)
  const data: ApiRes<Post[]> = request.data

  return data[1]
}

async function allCommentsFromPost(id: number): Promise<Comment[] | []> {
  const request = await axios.get(`${API_URL}/comments/${id}`, {withCredentials: true})
  const data: ApiRes<Comment[]> = request.data

  if (request.status === 204) {
    return []
  }
  return data[1]
}

async function postByID(id: number): Promise<[Post, Comment[]]> {
  const request = await axios.get(`${API_URL}/posts/${id}`)
  const data: ApiRes<Post> = request.data
  const comments = await allCommentsFromPost(id)

  return [data[1], comments]
}

async function userByID(id: number): Promise<User> {
  const request = await axios.get(`${API_URL}/user/${id}`)
  const data: ApiRes<User> = request.data

  return data[1]
}

async function profile(): Promise<[User, Post[] | []]> {
  const request = await axios.get(`${API_URL}/profile`, {withCredentials: true})
  const data: ApiRes<User> = request.data

  const posts = await allPostsFromUser(data[1].id)

  if (posts === undefined) return [data[1], []]
  
  return [data[1], posts]
}

