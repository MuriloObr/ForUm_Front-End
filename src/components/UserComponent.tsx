import { ReactNode } from "react"
import { getRandomAvatar } from "../api/randomAvatar"

export const UserComponent = {
  Root,
  Content,
}

interface RootProps {
  children: ReactNode
}

interface ContentProps {
  username: string
  nickname: string
  email: string
  children: ReactNode
  created_at: string
}

function Root({ children }: RootProps) {
  return <div className="h-full p-8 flex justify-center">{children}</div>
}

function Content({
  username,
  nickname,
  email,
  children,
  created_at,
}: ContentProps) {
  const date = new Date(created_at)

  return (
    <div className="w-1/6 flex flex-col items-start gap-5 text-2xl text-black font-bold">
      <div className="flex items-center gap-4 self-center">
        <img src={getRandomAvatar()} alt="avatar" className="rounded-full" />
        <span className="text-4xl flex items-center">{username}</span>
      </div>
      <span className="flex items-center gap-5">
        Nickname:
        <span className="text-3xl font-normal flex items-center">
          {nickname}
        </span>
      </span>
      <span className="flex items-center gap-5">
        Email:
        <span className="text-3xl font-normal flex items-center">{email}</span>
      </span>
      <div className="self-center">{children}</div>
      <span className="text-xl font-normal self-center opacity-70">
        Here since {date.toDateString()}
      </span>
    </div>
  )
}
