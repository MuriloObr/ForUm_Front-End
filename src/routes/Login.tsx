import { useRef } from "react"
import { Form } from "../components/Form"
import { postData } from "../api/postFunctions"
import { useNavigate } from "react-router-dom"

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  async function login() {
    const res = await postData.login({
      user: userRef.current?.value,
      password: passwordRef.current?.value,
    })
    if (res.status === 200) {
      console.log(res.data)
      navigate(`/profile`)
    } else {
      console.log(res.status)
    }
  }

  return (
    <Form.Root action={login}>
      <Form.Field label="User" name="user" type="text" ref={userRef} />
      <Form.Field
        label="Password"
        name="password"
        type="password"
        ref={passwordRef}
      />
    </Form.Root>
  )
}
