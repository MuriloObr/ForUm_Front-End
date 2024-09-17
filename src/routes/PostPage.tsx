import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PostComment } from '../components/PostComment'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { AddButton } from '../components/ui/AddButton'
import { Modal } from '../components/Modal'
import { useContext, useEffect, useRef, useState } from 'react'
import { getData } from '../api/getFunctions'
import { postData } from '../api/postFunctions'
import { ArrowFatLinesRight } from '@phosphor-icons/react'
import { ConfigButton } from '../components/ui/ConfigButton'
import { AnswerContext } from '../context/AnswerContext'
import { LoadingSubmit } from '../components/LoadingSubmit'
import { markdownPurifiedStr } from '../utils/MDpurifiedHelper'

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

  const [MainMDCont, setMainMDCont] = useState<string>('')

  const [CommentMDCont, setCommentMDCont] = useState<string[]>([''])

  useEffect(() => {
    async function verifyView() {
      const res = await postData.viewPost(postID)
      if (res === true) queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
    verifyView()
    async function verifyOwner() {
      const res = await getData.profile()

      const exist = res.posts.find(
        ({ id }) => id === parseInt(postID === undefined ? 'NaN' : postID),
      )
      if (exist !== undefined) return setOwner(true)
      return setOwner(false)
    }
    verifyOwner()

    async function parseContMD() {
      const MDstr = await markdownPurifiedStr(data?.post.content ?? '')
      setMainMDCont(MDstr)
      const PromiseListMDstr = data?.comments.map(({ content }) =>
        markdownPurifiedStr(content),
      ) ?? ['']
      const ListMDstr = await Promise.allSettled(PromiseListMDstr)
      setCommentMDCont(
        ListMDstr.map((promise) => {
          if (promise.status === 'fulfilled') {
            return promise.value
          } else {
            return ''
          }
        }),
      )
    }
    parseContMD()
  }, [postID, queryClient, data?.post.content, data?.comments])

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
              <ConfigButton
                id={data.post.id}
                closed={data.post.closed}
                name={data.post.tittle}
              />
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
              <PostComment.Content>{MainMDCont}</PostComment.Content>
              <PostComment.Footer
                nickname={data.post.user.nickname}
                createdAt={data.post.created_at}
              />
            </PostComment.Root>
            {data.comments.map((comment, i) => {
              return (
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
                    <PostComment.Content isAnswer={comment.answer}>
                      {CommentMDCont[i]}
                    </PostComment.Content>
                    <PostComment.Footer
                      nickname={comment.user.nickname}
                      createdAt={comment.created_at}
                    />
                  </PostComment.Root>
                </>
              )
            })}
          </>
        )}
        <AddButton
          text="+ Comment"
          className="right-0 mr-10"
          onClick={() => modalRef.current?.showModal()}
        />
        <Modal.Root
          ref={modalRef}
          res={commentStatus}
          submitLabel="Comentar"
          onSubmit={() => mutate()}
        >
          <Modal.Area withMD label="Conteudo" ref={inputTextareaRef} />
          <LoadingSubmit isLoading={mutateLoading} />
        </Modal.Root>
      </ul>
    </main>
  )
}
