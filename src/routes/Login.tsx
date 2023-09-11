import { useRef, useState } from "react"
import { Form } from "../components/Form"
import { postData } from "../api/postFunctions"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { CircleNotch } from "@phosphor-icons/react"

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [res, setRes] = useState("")
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
      setRes("Perfil não encontrado")
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
      <Form.ResField res={res} color="text-red-500" />
      {isLoading ? <CircleNotch className="absolute inset-0" /> : ""}
    </Form.Root>
  )
}
