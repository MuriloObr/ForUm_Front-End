import { useContext, useRef, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { SearchContext } from "../context/SearchContext.tsx"
import { getData } from "../api/getFunctions"
import { Header } from "../components/Header"
import { Post } from "../components/Post"
import { Loading } from "../components/Loading"
import { Error } from "../components/Error"
import { AddButton } from "../components/AddButton"
import { AddModal } from "../components/AddModal"
import { postData } from "../api/postFunctions"

export function App() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getData.allPosts,
    retry: 5,
    staleTime: 30 * 60 * 1000, // 30 minute
  })

  const queryClient = useQueryClient()

  const { search } = useContext(SearchContext)

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTittleRef = useRef<HTMLInputElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [postStatus, setPostStatus] = useState<string>("")

  const filteredPosts =
    search.length > 0
      ? data?.filter((post) =>
          post.tittle.toLowerCase().includes(search.toLowerCase())
        )
      : []

  console.log(data === undefined)

  async function Postar() {
    const tittle = inputTittleRef.current?.value
    const content = inputTextareaRef.current?.value
    const res = await postData.addNewPost({ tittle, content })
    return res
  }

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} />
  }

  return (
    <div className="flex flex-col h-screen-d">
      <Header />
      <main className="w-full p-5 bg-slate-800 flex-1">
        <ul className="h-fit flex flex-col gap-5">
          {search.length > 0 ? (
            filteredPosts?.map((post) => {
              return (
                <Post.Root
                  username={post.user.username}
                  postID={post.id}
                  key={post.id}
                >
                  <Post.Header closed={post.closed}>{post.tittle}</Post.Header>
                  <Post.Content>{post.content}</Post.Content>
                  <Post.Footer
                    views={post.views.length}
                    likes={post.likes.length}
                    createdAt={post.created_at}
                    nickname={post.user.nickname}
                  />
                </Post.Root>
              )
            })
          ) : data === undefined ? (
            <div>No posts to see...</div>
          ) : (
            data.map((post) => {
              return (
                <Post.Root
                  username={post.user.username}
                  postID={post.id}
                  key={post.id}
                >
                  <Post.Header closed={post.closed}>{post.tittle}</Post.Header>
                  <Post.Content>{post.content}</Post.Content>
                  <Post.Footer
                    views={post.views.length}
                    likes={post.likes.length}
                    createdAt={post.created_at}
                    nickname={post.user.nickname}
                  />
                </Post.Root>
              )
            })
          )}
          <AddButton
            text="+ Post"
            className="mr-10"
            onClick={() => modalRef.current?.showModal()}
          />
          <AddModal.Root
            ref={modalRef}
            res={postStatus}
            submitLabel="Postar"
            onSubmit={async () => {
              const posted = await Postar()
              if (posted === true) {
                modalRef.current?.close()
                queryClient.invalidateQueries({ queryKey: ["posts"] })
                return
              }
              if (posted === 401)
                setPostStatus("Voçê precisa estar logado para postar!")
            }}
          >
            <AddModal.Field label="Titulo" type="text" ref={inputTittleRef} />
            <AddModal.Area label="Conteudo" ref={inputTextareaRef} />
          </AddModal.Root>
        </ul>
      </main>
    </div>
  )
}
