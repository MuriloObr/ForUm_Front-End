import axios from 'axios'
import { Post, Comment, User, ApiRes } from '../types/typesAPI'

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
  const data: ApiRes<Post[]> = request.data

  if (request.status === 204) return []

  return data[1]
}

async function allPostsFromUser(id: number): Promise<Post[]> {
  const request = await axios.get(`${API_URL}/posts/user/${id}`)
  const data: ApiRes<Post[]> = request.data

  return data[1]
}

async function allCommentsFromPost(id: number): Promise<Comment[] | []> {
  const request = await axios.get(`${API_URL}/comments/${id}`, {
    withCredentials: true,
  })
  const data: ApiRes<Comment[]> = request.data

  if (request.status === 204) return []

  return data[1]
}

async function postByID(
  id: number,
): Promise<{ post: Post; comments: Comment[] }> {
  const request = await axios.get(`${API_URL}/posts/${id}`)
  const data: ApiRes<Post> = request.data
  const comments = await allCommentsFromPost(id)

  return { post: data[1], comments }
}

async function userByID(id: number): Promise<User> {
  const request = await axios.get(`${API_URL}/user/${id}`)
  const data: ApiRes<User> = request.data

  return data[1]
}

async function profile(): Promise<{ user: User; posts: Post[] | [] }> {
  const request = await axios.get(`${API_URL}/profile`, {
    withCredentials: true,
  })
  const data: ApiRes<User> = request.data

  const posts = await allPostsFromUser(data[1].id)

  if (posts === undefined) return { user: data[1], posts: [] }

  return { user: data[1], posts }
}
