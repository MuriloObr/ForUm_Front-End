/* eslint-disable camelcase */
import { useContext, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchContext } from '../context/SearchContext.tsx'
import { getData } from '../api/getFunctions'
import { Post } from '../components/Post.tsx'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { AddButton } from '../components/AddButton'
import { AddModal } from '../components/AddModal'
import { postData } from '../api/postFunctions'
import { LoadingSubmit } from '../components/LoadingSubmit.tsx'

export function App() {
  const {
    isLoading: dataLoading,
    isError,
    data,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getData.allPosts,
    retry: 5,
    staleTime: 30 * 60 * 1000, // 30 minute
  })

  const { mutate, isLoading: mutateLoading } = useMutation({
    mutationFn: Postar,
  })

  const queryClient = useQueryClient()

  const { search } = useContext(SearchContext)

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTittleRef = useRef<HTMLInputElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [postStatus, setPostStatus] = useState<string>('')

  const filteredPosts =
    search.length > 0
      ? data?.filter(({ tittle }) =>
          tittle.toLowerCase().includes(search.toLowerCase()),
        )
      : []

  console.log(data)

  async function Postar() {
    const post = async () => {
      const tittle = inputTittleRef.current?.value
      const content = inputTextareaRef.current?.value
      const res = await postData.addNewPost({ tittle, content })
      return res
    }
    const posted = await post()
    if (posted === true) {
      modalRef.current?.close()
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      return
    }
    if (posted === 401) setPostStatus('Você precisa estar logado para postar!')
  }

  if (dataLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} />
  }

  return (
    <main className="w-full p-5 bg-slate-800 flex-1">
      <ul className="h-fit flex flex-col gap-5">
        {search.length > 0 ? (
          filteredPosts?.map(
            ({
              id,
              tittle,
              content,
              views,
              likes,
              user,
              closed,
              created_at,
            }) => {
              return (
                <Post.Root username={user.username} postID={id} key={id}>
                  <Post.Header closed={closed}>{tittle}</Post.Header>
                  <Post.Content>{content}</Post.Content>
                  <Post.Footer
                    views={views.length}
                    likes={likes.length}
                    createdAt={created_at}
                    nickname={user.nickname}
                  />
                </Post.Root>
              )
            },
          )
        ) : data === undefined ? (
          <div>No posts to see...</div>
        ) : (
          data.map(
            ({
              id,
              tittle,
              content,
              views,
              likes,
              user,
              closed,
              created_at,
            }) => {
              return (
                <Post.Root username={user.username} postID={id} key={id}>
                  <Post.Header closed={closed}>{tittle}</Post.Header>
                  <Post.Content>{content}</Post.Content>
                  <Post.Footer
                    views={views.length}
                    likes={likes.length}
                    createdAt={created_at}
                    nickname={user.nickname}
                  />
                </Post.Root>
              )
            },
          )
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
          onSubmit={() => mutate()}
        >
          <AddModal.Field label="Titulo" type="text" ref={inputTittleRef} />
          <AddModal.Area label="Conteúdo" ref={inputTextareaRef} />
          <LoadingSubmit isLoading={mutateLoading} />
        </AddModal.Root>
      </ul>
    </main>
  )
}
