import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { postData } from "../api/postFunctions"
import { Form } from "../components/Form"
import { useMutation } from "@tanstack/react-query"
import { CircleNotch } from "@phosphor-icons/react"

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [res, setRes] = useState({
    message: "",
    color: "white",
  })
  const { mutate, isLoading } = useMutation({
    mutationFn: register,
  })

  async function register() {
    const res = await postData.register({
      username: usernameRef.current?.value,
      nickname: nicknameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    })
    if (res.status === 201) {
      console.log(res.data)
      navigate(`/login`)
    } else if (res.status === 409) {
      setRes({
        message: "Algo deu errado",
        color: "text-red-500",
      })
    }
  }

  return (
    <Form.Root cautionMessage action={() => mutate()}>
      <Form.Field
        label="Username"
        name="username"
        type="text"
        ref={usernameRef}
      />
      <Form.Field
        label="Nickname"
        name="nickname"
        type="text"
        ref={nicknameRef}
      />
      <Form.Field label="Email" name="email" type="text" ref={emailRef} />
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
        ""
      )}
    </Form.Root>
  )
}
