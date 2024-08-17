import axios from 'axios'
import { Post, Comment, User } from '../types/typesAPI'

export const getData = {
  allPosts,
  allPostsFromUser,
  allCommentsFromPost,
  postByID,
  userByID,
  profile,
}

const devMode = false

export const API_URL = devMode
  ? 'http://127.0.0.1:5001/api'
  : 'https://forumbackend-4crd.onrender.com/api'

async function allPosts(): Promise<Post[] | []> {
  const request = await axios.get(`${API_URL}/posts`)
  const data: Post[] = request.data

  if (request.status === 204) return []

  return data
}

async function allPostsFromUser(id: number): Promise<Post[]> {
  const request = await axios.get(`${API_URL}/posts/user/${id}`)
  const data: Post[] = request.data

  if (request.status === 204) return []

  return data
}

async function allCommentsFromPost(id: number): Promise<Comment[] | []> {
  const request = await axios.get(`${API_URL}/comments/${id}`, {
    withCredentials: true,
  })
  const data: Comment[] = request.data

  if (request.status === 204) return []

  return data
}

async function postByID(
  id: number,
): Promise<{ post: Post; comments: Comment[] }> {
  const request = await axios.get(`${API_URL}/posts/${id}`)
  const data: Post = request.data
  const comments = await allCommentsFromPost(id)

  return { post: data, comments }
}

async function userByID(id: number): Promise<User> {
  const request = await axios.get(`${API_URL}/user/${id}`)
  const data: User = request.data

  return data
}

async function profile(): Promise<{ user: User; posts: Post[] | [] }> {
  const request = await axios.get(`${API_URL}/profile`, {
    withCredentials: true,
  })
  const data: User = request.data

  const posts = await allPostsFromUser(data.id)

  if (posts === undefined) return { user: data, posts: [] }

  return { user: data, posts }
}
