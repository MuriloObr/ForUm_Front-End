import {
  X,
  Check,
  CaretUp,
  CaretDown,
  FunnelSimple,
} from '@phosphor-icons/react'
import { postData } from '../api/postFunctions'
import { useQueryClient } from '@tanstack/react-query'
import { PostCommentProps } from '../types/typesComponents'

export const PostComment = {
  Root,
  Header,
  Content,
  Footer,
}

function Root({ children, isMain = false }: PostCommentProps['root']) {
  return (
    <div
      className={
        'w-5/6 mx-auto my-8 p-5 bg-white rounded-md relative' +
        (isMain ? ' mb-10' : ' flex items-center gap-5')
      }
    >
      {children}
      {isMain ? (
        <FunnelSimple
          size={32}
          className="text-white absolute -bottom-8 inset-x-0 mx-auto"
        />
      ) : (
        ''
      )}
    </div>
  )
}

function Header({
  id,
  tittle,
  likes,
  isClosed,
  isMain = false,
}: PostCommentProps['header']) {
  const queryClient = useQueryClient()

  return (
    <div className="flex justify-between items-center gap-5">
      <span className="flex flex-col items-center">
        <CaretUp
          size={32}
          className="border-transparent border rounded-md hover:border-zinc-500/70 transition-all cursor-pointer"
          onClick={async () => {
            if (isMain) {
              const req = await postData.likePost(id)
              if (req === true)
                queryClient.invalidateQueries({ queryKey: ['post'] })

              return
            }
            const req = await postData.likeComment(id)
            if (req === true)
              queryClient.invalidateQueries({ queryKey: ['post'] })
          }}
        />
        <span className="select-none">{likes}</span>
        <CaretDown
          size={32}
          className="border-transparent border rounded-md hover:border-zinc-500/70 transition-all cursor-pointer"
          onClick={async () => {
            if (isMain) {
              const req = await postData.rmlikePost(id)
              if (req === true)
                queryClient.invalidateQueries({ queryKey: ['post'] })

              return
            }
            const req = await postData.rmlikeComment(id)
            if (req === true)
              queryClient.invalidateQueries({ queryKey: ['post'] })
          }}
        />
      </span>
      {isMain ? (
        <>
          <h1 className="mr-auto text-2xl">{tittle}</h1>
          <span
            className={
              'h-fit flex items-center gap-2 p-2 rounded-md text-white font-bold' +
              ` ${isClosed ? 'bg-emerald-500' : 'bg-purple-600'}`
            }
          >
            {isClosed
              ? ['Closed', <X size={18} weight="bold" key={'iconX'} />]
              : ['Open', <Check size={18} weight="bold" key={'iconOpen'} />]}
          </span>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

function Content({ children }: PostCommentProps['content']) {
  return <p className="mt-5 mb-5 flex items-center gap-2">{children}</p>
}

function Footer({ nickname, createdAt }: PostCommentProps['footer']) {
  const date = new Date(createdAt)
  return (
    <div className="w-fit ml-auto flex gap-5 self-end">
      <span className="hover:underline cursor-pointer">{nickname}</span>
      <span>{date.toDateString()}</span>
    </div>
  )
}
