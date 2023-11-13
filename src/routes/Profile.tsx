import { useQuery } from '@tanstack/react-query'
import { getData } from '../api/getFunctions'
import { UserComponent } from '../components/UserComponent'
import { Loading } from '../components/Loading'
import { Error } from '../components/Error'
import { postData } from '../api/postFunctions'
import { SignOut } from '@phosphor-icons/react'
import { Post } from '../components/Post'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['user'],
    queryFn: getData.profile,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const navigate = useNavigate()

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error error={error} />
  }

  return (
    <main>
      {data.user === undefined ? (
        ''
      ) : (
        <>
          <UserComponent.Root>
            <UserComponent.Content
              username={data.user.username}
              nickname={data.user.nickname}
              email={data.user.email}
              created_at={data.user.created_at}
            >
              <ul className="w-[60vw] flex flex-col gap-4">
                {data.posts === undefined
                  ? ''
                  : data.posts.map((post) => (
                      <Post.Root
                        username={post.user.username}
                        postID={post.id}
                        key={post.id}
                      >
                        <Post.Header closed={post.closed}>
                          {post.tittle}
                        </Post.Header>
                        <Post.Content>{post.content}</Post.Content>
                        <Post.Footer
                          views={post.views.length}
                          likes={post.likes.length}
                          createdAt={post.created_at}
                          nickname={post.user.nickname}
                        />
                      </Post.Root>
                    ))}
              </ul>
            </UserComponent.Content>
          </UserComponent.Root>
          <button
            className="w-fit p-5 flex items-center gap-2 text-3xl font-bold text-black mx-auto"
            onClick={() => {
              const res = postData.logout()
              console.log(res)
              navigate('/')
            }}
          >
            Logout
            <SignOut />
          </button>
        </>
      )}
    </main>
  )
}
