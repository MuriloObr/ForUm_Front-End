import axios, { AxiosError } from "axios"
import { API_URL } from "./getFunctions"

export const postData = {
  register,
  login,
  logout,
  loggedIn,
  addNewPost,
  addNewComment,
  likePost,
  viewPost,
  likeComment,
  rmlikePost,
  closeOpenPost,
  rmlikeComment,
  bestComment
}

interface RegisterProps {
  username: string | undefined
  nickname: string | undefined
  email: string | undefined
  password: string | undefined
}

async function register({ username, nickname, email, password }: RegisterProps) {
  const response = await axios({
    method: "post",
    url: `${API_URL}/register`,
    headers: {
      "Content-Type": "application/json"
    },
    data: { username, nickname, email, password },
  })

  return response
}

async function login({ user, password }: {user: string | undefined, password: string | undefined}) {
  const response = await axios({
    method: "post",
    url: `${API_URL}/login`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    data: { user, password },
    withCredentials: true
  })

  return response
}

async function logout() {
  const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
  return response
}

async function loggedIn(): Promise<boolean | undefined> {
  try {
    const response = await axios.get(`${API_URL}/logged`, { withCredentials: true })
    if (response.status === 200) return true
  } catch (error) {
    console.log(error)
    return false
  }
}

async function addNewPost({tittle, content}: {tittle: string|undefined, content: string|undefined}): Promise<number | true | undefined> {
  try {
    const response = await axios.post(`${API_URL}/posts/create`, { tittle, content }, { withCredentials: true })
    console.log(response.data)
    
    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function addNewComment({post_id, content}: {post_id: string|undefined, content: string|undefined}): Promise<number | true | undefined> {
  try {
    const response = await axios.post(`${API_URL}/posts/comment`, { post_id, content }, { withCredentials: true })
    console.log(response.data)
    
    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function likePost(post_id: number) {
  try {
    const response = await axios.post(`${API_URL}/posts/like`, { post_id }, { withCredentials: true })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function rmlikePost(post_id: number) {
  try {
    const response = await axios.delete(`${API_URL}/posts/like`, {
      data: { post_id },
      withCredentials: true
    })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function viewPost(post_id: string | undefined) {
  try {
    const response = await axios.post(`${API_URL}/posts/view`, { post_id }, { withCredentials: true })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function closeOpenPost(post_id: number) {
  try {
    const response = await axios.put(`${API_URL}/posts/closed`, { post_id }, { withCredentials: true })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function likeComment(comment_id: number) {
  try {
    const response = await axios.post(`${API_URL}/comments/like`, { comment_id }, { withCredentials: true })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function rmlikeComment(comment_id: number) {
  try {
    const response = await axios.delete(`${API_URL}/comments/like`, {
      data: { comment_id },
      withCredentials: true
    })
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}

async function bestComment({ comment_id, post_id }: {comment_id: number, post_id: number }) {
  try {
    const response = await axios.put(
      `${API_URL}/comments/best`, 
      { comment_id, post_id },
      { withCredentials: true }
    )
    console.log(response.data)

    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error.response?.status
    }
  }
}