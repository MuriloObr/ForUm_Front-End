import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { postData } from "../api/postFunctions"
import { Form } from "../components/Form"

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

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
    } else {
      console.log(res.status)
    }
  }

  return (
    <Form.Root cautionMessage action={register}>
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
    </Form.Root>
  )
}
