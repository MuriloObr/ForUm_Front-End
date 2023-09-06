import { useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Header } from "../components/Header"
import { PostComment } from "../components/PostComment"
import { Loading } from "../components/Loading"
import { Error } from "../components/Error"
import { AddButton } from "../components/AddButton"
import { AddModal } from "../components/AddModal"
import { useContext, useEffect, useRef, useState } from "react"
import { getData } from "../api/getFunctions"
import { postData } from "../api/postFunctions"
import { ArrowFatLinesRight, CheckFat } from "@phosphor-icons/react"
import { ConfigButton } from "../components/ConfigButton"
import { AnswerContext } from "../context/AnswerContext"

export function PostPage() {
  const { postID } = useParams()
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["post", postID],
    queryFn: () =>
      getData.postByID(postID === undefined ? 0 : parseInt(postID)),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })

  const [owner, setOwner] = useState<boolean>(false)
  const { answer, setAnswer } = useContext(AnswerContext)

  const queryClient = useQueryClient()

  useEffect(() => {
    async function verifyView() {
      const res = await postData.viewPost(postID)
      if (res === true) queryClient.invalidateQueries({ queryKey: ["posts"] })
      console.log(res)
    }
    verifyView()
    async function verifyOwner() {
      const res = await getData.profile()

      const exist = res[1].find(
        (post) => post.id === parseInt(postID === undefined ? "NaN" : postID)
      )
      if (exist !== undefined) return setOwner(true)
      return setOwner(false)
    }
    verifyOwner()
  }, [postID, queryClient])

  const modalRef = useRef<HTMLDialogElement>(null)
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [commentStatus, setCommentStatus] = useState<string>("")

  async function Comentar() {
    const content = inputTextareaRef.current?.value
    const res = await postData.addNewComment({ post_id: postID, content })
    return res
  }

  async function melhorResposta(id: number) {
    const res = await postData.bestComment({
      comment_id: id,
      post_id: postID === undefined ? NaN : parseInt(postID),
    })
    if (res === true) {
      setAnswer()
      queryClient.invalidateQueries({ queryKey: ["post"] })
    }
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
      <main className="w-full p-5 bg-slate-800 text-zinc-900 flex-1 relative">
        <ul className="h-fit flex flex-col">
          {data === undefined ? (
            ""
          ) : (
            <>
              {owner ? (
                <ConfigButton id={data[0].id} closed={data[0].closed} />
              ) : (
                ""
              )}
              <PostComment.Root isMain={true} key={data[0].id}>
                <PostComment.Header
                  id={data[0].id}
                  tittle={data[0].tittle}
                  likes={data[0].likes.length}
                  isClosed={data[0].closed}
                  isMain={true}
                />
                <PostComment.Content>{data[0].content}</PostComment.Content>
                <PostComment.Footer
                  nickname={data[0].user.nickname}
                  createdAt={data[0].created_at}
                />
              </PostComment.Root>
              {data[1].map((comment) => (
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
                      ""
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
                        ""
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
            onSubmit={async () => {
              const commented = await Comentar()
              if (commented === true) {
                modalRef.current?.close()
                queryClient.invalidateQueries({ queryKey: ["post"] })
                return
              }
              if (commented === 401)
                setCommentStatus("Voçê precisa estar logado para comentar!")
            }}
          >
            <AddModal.Area label="Conteudo" ref={inputTextareaRef} />
          </AddModal.Root>
        </ul>
      </main>
    </div>
  )
}
