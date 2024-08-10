/* eslint-disable react-refresh/only-export-components */
import { forwardRef, useRef, useState, useEffect } from 'react'
import { AddButton } from './AddButton'
import { AddModalProps } from '../types/typesComponents'
import { markdownPurifiedStr } from '../utils/MDpurifiedHelper'
import { highlight } from '../utils/highlighter.ts'

const Root = forwardRef<HTMLDialogElement, AddModalProps['root']>(function Root(
  { children, onSubmit, submitLabel, res },
  ref,
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

const Field = forwardRef<HTMLInputElement, AddModalProps['field']>(
  function Field({ type, label }, ref) {
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
  },
)

const Area = forwardRef<HTMLTextAreaElement, AddModalProps['area']>(
  function Area({ label, withMD }, ref) {
    const [mdView, setMdView] = useState({ raw: 'block', view: 'hidden' })
    const [MDstr, setMDstr] = useState(
      'Escreva seu texto para ver a preview aqui, se precisar saber sobre markdown entre [aqui](https://github.com/luong-komorebi/Markdown-Tutorial)',
    )
    const previewDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      console.log('effect')
    }, [MDstr])

    async function markedParse() {
      const finalStr = await markdownPurifiedStr(MDstr)
      setMDstr(finalStr)
    }

    return (
      <label className="flex flex-col text-black text-2xl">
        {label}↴
        <textarea
          ref={ref}
          rows={10}
          onChange={(ev) => {
            if (!withMD) return
            setMDstr(ev.target.value)
          }}
          className={`w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-8 font-normal outline-none ${mdView.raw}`}
        />
        {withMD ? (
          <>
            <pre className="font-[inherit]">
              <div
                ref={previewDivRef}
                className={`markdown ${mdView.view}`}
                dangerouslySetInnerHTML={{ __html: MDstr }}
              />
            </pre>
            <div className="text-lg rounded bg-slate-800/60 text-white w-fit p-2 flex gap-2 font-bold mt-2">
              <button
                onClick={(ev) => {
                  markedParse()
                  highlight()
                  if (mdView.view === 'hidden') {
                    setMdView({ raw: 'hidden', view: 'block' })
                    ev.currentTarget.textContent = 'View'
                  } else {
                    setMdView({ raw: 'block', view: 'hidden' })
                    ev.currentTarget.textContent = 'Raw'
                  }
                }}
              >
                Raw
              </button>
            </div>
          </>
        ) : (
          ''
        )}
      </label>
    )
  },
)

export const AddModal = {
  Root,
  Field,
  Area,
}
