import { ReactNode, forwardRef, useRef } from "react"

interface RootProps {
  action: () => void
  cautionMessage?: true
  children: ReactNode
}

interface FieldProps {
  label: string
  type: string
  name: string
}

function Root({ action, cautionMessage, children }: RootProps) {
  const cautionRef = useRef<HTMLInputElement>(null)

  return (
    <div className="h-screen-d flex items-center justify-center">
      <img src="/forUm.svg" alt="logo" className="w-2/6" />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (cautionMessage === true) {
            if (cautionRef.current?.checked) {
              action()
              return
            }
            return
          }
          action()
          console.log(action)
        }}
        className={
          "h-fit w-1/5 flex flex-col items-center justify-center rounded-md text-zinc-900 font-bold" +
          (cautionMessage ? " gap-1 text-md" : " gap-8 text-3xl")
        }
      >
        {children}
        {cautionMessage ? <CautionMessage ref={cautionRef} /> : ""}
        <div
          className="py-3 px-2 relative 
          after:absolute after:inline-block after:inset-x-0 after:h-0.5 after:w-full after:top-1 after:scale-x-0 after:origin-left after:bg-zinc-900 after:transition-all
          before:absolute before:inline-block before:inset-x-0 before:h-0.5 before:w-full before:bottom-1 before:scale-x-0 before:origin-right before:bg-zinc-900 before:transition-all
          hover:after:scale-x-100 hover:before:scale-x-100"
        >
          <input
            type="submit"
            value={cautionMessage ? "Registrar" : "Entrar"}
            className="text-2xl cursor-pointer"
          />
        </div>
      </form>
    </div>
  )
}

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, type, name },
  ref
) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="tracking-wide">
        {label}↴
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none"
        ref={ref}
      />
    </div>
  )
})

function ResField({ res, color }: { res: string; color: string }) {
  return <span className={`${color} text-xl h-8`}>{res}</span>
}

const CautionMessage = forwardRef<HTMLInputElement>(function CautionMessage(
  _,
  ref
) {
  return (
    <>
      <legend>
        <h2 className="text-red-500 text-xl">Aviso!!</h2>
        <p className="text-lg text-justify">
          Este site utiliza algumas formas de manter seus dados seguros, porém
          evite utilizar qualquer informação real ou sensível este é somente um
          projeto de exemplo, utilize dados fictícios.
        </p>
      </legend>
      <label className="text-lg font-normal flex items-center gap-2 self-start">
        Li o aviso acima e agi de acordo
        <input
          type="checkbox"
          name="aviso"
          id="avisoDados"
          className="h-5 w-5"
          ref={ref}
        />
      </label>
    </>
  )
})

export const Form = {
  Root,
  Field,
  ResField,
}
