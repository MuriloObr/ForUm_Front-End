import { useQuery } from "@tanstack/react-query"
import { postData } from "../api/postFunctions"
import searchIcon from "/searchSvg.svg"
import { useContext } from "react"
import { SearchContext } from "../context/SearchContext"

export function Header() {
  const { data } = useQuery({
    queryKey: ["loggedIn"],
    queryFn: postData.loggedIn,
  })

  const { search, setSearch } = useContext(SearchContext)

  return (
    <div className="p-3 flex items-center justify-between border-b-2 border-zinc-200">
      <div className="flex items-center">
        <img src="/forUm.svg" alt="Logo" className="h-10 w-10" />
        <span className="font-bold text-2xl text-zinc-900 select-none">
          ForUm
        </span>
      </div>

      <div className="flex items-center w-2/3 ml-auto mr-5 py-1 px-2 bg-zinc-300/70 rounded-lg border border-[#fafafa] focus-within:border-zinc-900/50">
        <img src={searchIcon} alt="Buscar" className="h-6 w-6" />
        <input
          type="text"
          className="w-full ml-2 bg-transparent text-lg text-zinc-900 outline-none"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>

      <nav className="text-xl text-zinc-900 flex gap-x-16">
        <a
          href={`/`}
          className="py-1 px-2 relative 
          after:absolute after:inline-block after:inset-x-0 after:h-0.5 after:w-full after:top-1 after:scale-x-0 after:origin-left after:bg-zinc-900 after:transition-all
          before:absolute before:inline-block before:inset-x-0 before:h-0.5 before:w-full before:bottom-1 before:scale-x-0 before:origin-right before:bg-zinc-900 before:transition-all
          hover:after:scale-x-100 hover:before:scale-x-100"
        >
          Home
        </a>
        <a
          href={`/about`}
          className="py-1 px-2 relative 
          after:absolute after:inline-block after:inset-x-0 after:h-0.5 after:w-full after:top-1 after:scale-x-0 after:origin-left after:bg-zinc-900 after:transition-all
          before:absolute before:inline-block before:inset-x-0 before:h-0.5 before:w-full before:bottom-1 before:scale-x-0 before:origin-right before:bg-zinc-900 before:transition-all
          hover:after:scale-x-100 hover:before:scale-x-100"
        >
          Sobre
        </a>
        {!data ? (
          <div className="flex">
            <a
              href={`/login`}
              className="font-bold text-white bg-blue-500 py-1 px-2 rounded-l-lg border-2 border-r-0 border-black hover:brightness-90"
            >
              Logar
            </a>
            <a
              href={`/register`}
              className="font-bold text-white bg-orange-500 py-1 px-2 rounded-r-lg border-2 border-l-0 border-black hover:brightness-90"
            >
              Registrar
            </a>
          </div>
        ) : (
          <a
            href={`/profile`}
            className="py-1 px-2 relative 
            after:absolute after:inline-block after:inset-x-0 after:h-0.5 after:w-full after:top-1 after:scale-x-0 after:origin-left after:bg-zinc-900 after:transition-all
            before:absolute before:inline-block before:inset-x-0 before:h-0.5 before:w-full before:bottom-1 before:scale-x-0 before:origin-right before:bg-zinc-900 before:transition-all
            hover:after:scale-x-100 hover:before:scale-x-100"
          >
            Profile
          </a>
        )}
      </nav>
    </div>
  )
}
