import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PostComment } from '../components/PostComment'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { AddButton } from '../components/AddButton'
import { AddModal } from '../components/AddModal'
import { useContext, useEffect, useRef, useState } from 'react'
import { getData } from '../api/getFunctions'
import { postData } from '../api/postFunctions'
import { ArrowFatLinesRight, CheckFat } from '@phosphor-icons/react'
import { ConfigButton } from '../components/ConfigButton'
import { AnswerContext } from '../context/AnswerContext'
import { LoadingSubmit } from '../components/LoadingSubmit'

export function PostPage() {
  const { postID } = useParams()
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['post', postID],
    queryFn: () =>
      getData.postByID(postID === undefined ? 0 : parseInt(postID)),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })

  const { mutate, isLoading: mutateLoading } = useMutation({
    mutationFn: Comentar,
  })

  const [owner, setOwner] = useState<boolean>(false)
  const { answer, setAnswer } = useContext(AnswerContext)

  const queryClient = useQueryClient()

  useEffect(() => {
    async function verifyView() {
      const res = await postData.viewPost(postID)
      if (res === true) queryClient.invalidateQueries({ queryKey: ['posts'] })
      console.log(res)
    }
    verifyView()
    async function verifyOwner() {
      const res = await getData.profile()

      const exist = res.posts.find(
        (post) => post.id === parseInt(postID === undefined ? 'NaN' : postID),
      )
      if (exist !== undefined) return setOwner(true)
      return setOwner(false)
    }
    verifyOwner()
  }, [postID, queryClient])

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [commentStatus, setCommentStatus] = useState<string>('')

  async function Comentar() {
    const comment = async () => {
      const content = inputTextareaRef.current?.value
      const res = await postData.addNewComment({ post_id: postID, content })
      return res
    }
    const commented = await comment()
    if (commented === true) {
      modalRef.current?.close()
      queryClient.invalidateQueries({ queryKey: ['post'] })
      return
    }
    if (commented === 401)
      setCommentStatus('Você precisa estar logado para comentar!')
  }

  async function melhorResposta(id: number) {
    const res = await postData.bestComment({
      comment_id: id,
      post_id: postID === undefined ? NaN : parseInt(postID),
    })
    if (res === true) {
      setAnswer()
      queryClient.invalidateQueries({ queryKey: ['post'] })
    }
  }

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <Error error={error} />
  }

  return (
    <main className="w-full p-5 bg-slate-800 text-zinc-900 flex-1 relative">
      <ul className="h-fit flex flex-col">
        {data === undefined ? (
          ''
        ) : (
          <>
            {owner ? (
              <ConfigButton id={data.post.id} closed={data.post.closed} />
            ) : (
              ''
            )}
            <PostComment.Root isMain={true} key={data.post.id}>
              <PostComment.Header
                id={data.post.id}
                tittle={data.post.tittle}
                likes={data.post.likes.length}
                isClosed={data.post.closed}
                isMain={true}
              />
              <PostComment.Content>{data.post.content}</PostComment.Content>
              <PostComment.Footer
                nickname={data.post.user.nickname}
                createdAt={data.post.created_at}
              />
            </PostComment.Root>
            {data.comments.map((comment) => (
              <>
                <PostComment.Root isMain={false} key={comment.id}>
                  {owner && answer ? (
                    <div className="flex absolute -left-10">
                      <input
                        type="button"
                        className="appearance-none h-8 w-8 rounded-full bg-emerald-500 hover:brightness-90"
                        onClick={() => melhorResposta(comment.id)}
                      />
                      <ArrowFatLinesRight
                        size={24}
                        className="absolute inset-0 m-auto pointer-events-none text-white"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <PostComment.Header
                    id={comment.id}
                    tittle="comentario"
                    likes={comment.likes.length}
                    isClosed={false}
                    isMain={false}
                  />
                  <PostComment.Content>
                    {comment.answer ? (
                      <CheckFat className="text-emerald-500" size={32} />
                    ) : (
                      ''
                    )}
                    {comment.content}
                  </PostComment.Content>
                  <PostComment.Footer
                    nickname={comment.user.nickname}
                    createdAt={comment.created_at}
                  />
                </PostComment.Root>
              </>
            ))}
          </>
        )}
        <AddButton
          text="+ Comment"
          className="right-0 mr-10"
          onClick={() => modalRef.current?.showModal()}
        />
        <AddModal.Root
          ref={modalRef}
          res={commentStatus}
          submitLabel="Comentar"
          onSubmit={() => mutate()}
        >
          <AddModal.Area label="Conteudo" ref={inputTextareaRef} />
          <LoadingSubmit isLoading={mutateLoading} />
        </AddModal.Root>
      </ul>
    </main>
  )
}
