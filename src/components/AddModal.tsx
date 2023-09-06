import { MouseEventHandler, ReactNode, forwardRef } from "react"
import { AddButton } from "./AddButton"

interface RootProps {
  children: ReactNode
  onSubmit: MouseEventHandler
  submitLabel: string
  res: string
}

interface FieldProps {
  type: string
  label: string
}

interface AreaProps {
  label: string
}

const Root = forwardRef<HTMLDialogElement, RootProps>(function Root(
  { children, onSubmit, submitLabel, res },
  ref
) {
  return (
    <dialog ref={ref} className="w-1/3 rounded-md backdrop:bg-slate-900/80">
      <div className="flex flex-col gap-5 p-8 rounded-md bg-white">
        {children}
        <span className="h-5 text-red-700">{res}</span>
        <AddButton
          text={submitLabel}
          onClick={onSubmit}
          className="bottom-0 mr-0"
        />
      </div>
    </dialog>
  )
})

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { type, label },
  ref
) {
  return (
    <label className="flex flex-col text-black text-2xl">
      {label}↴
      <input
        type={type}
        ref={ref}
        className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none"
      />
    </label>
  )
})

const Area = forwardRef<HTMLTextAreaElement, AreaProps>(function Area(
  { label },
  ref
) {
  return (
    <label className="flex flex-col text-black text-2xl">
      {label}↴
      <textarea
        ref={ref}
        className="w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-10 font-normal outline-none"
      />
    </label>
  )
})

export const AddModal = {
  Root,
  Field,
  Area,
}
