import { AxiosError } from "axios"
import { Header } from "./Header"

export function Error({ error }: { error: unknown }) {
  return (
    <>
      {error instanceof AxiosError ? (
        <div className="h-screen-d">
          <Header />
          <div className="h-5/6 text-black text-3xl flex flex-col gap-3 items-center justify-center">
            {error.message.includes("401")
              ? "Voçê precisa estar logado para acessar está página!"
              : ""}
            <span className="opacity-80 text-xl">{`${error.message}`}</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}
