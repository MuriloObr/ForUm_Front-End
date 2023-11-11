import { useRef, useState } from 'react'
import { Form } from '../components/Form'
import { postData } from '../api/postFunctions'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { CircleNotch } from '@phosphor-icons/react'

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [res, setRes] = useState({
    message: '',
    color: 'white',
  })
  const { mutate, isLoading } = useMutation({
    mutationFn: login,
  })

  async function login() {
    const res = await postData.login({
      user: userRef.current?.value,
      password: passwordRef.current?.value,
    })
    if (res.status === 200) {
      navigate(`/profile`)
    } else if (res.status === 204) {
      setRes({
        message: 'Perfil não encontrado',
        color: 'text-red-500',
      })
    }
  }

  return (
    <Form.Root action={() => mutate()}>
      <Form.Field label="User" name="user" type="text" ref={userRef} />
      <Form.Field
        label="Password"
        name="password"
        type="password"
        ref={passwordRef}
      />
      <Form.ResField res={res.message} color={res.color} />
      {isLoading ? (
        <div className="absolute inset-0 m-auto h-screen w-screen bg-white/75">
          <CircleNotch
            size={80}
            className="absolute inset-0 m-auto animate-spin"
          />
        </div>
      ) : (
        ''
      )}
    </Form.Root>
  )
}
