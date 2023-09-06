import { GearSix, X } from "@phosphor-icons/react"
import * as Popover from "@radix-ui/react-popover"
import { postData } from "../api/postFunctions"
import { useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import { AnswerContext } from "../context/AnswerContext"

interface ConfigProps {
  id: number
  closed: boolean
}

export function ConfigButton({ id, closed }: ConfigProps) {
  const queryClient = useQueryClient()
  const { answer, setAnswer } = useContext(AnswerContext)

  async function CloseOpenPost() {
    const res = await postData.closeOpenPost(id)
    if (res === true) {
      queryClient.invalidateQueries({ queryKey: ["post"] })
      return
    }
    return
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="w-fit ml-auto border rounded-md p-2">
        <GearSix className="text-white" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="relative w-fit mt-2 flex flex-col gap-2 pt-2 pb-4 px-3 bg-white border rounded-md text-white">
          <h2 className="mx-auto text-black opacity-80">Options</h2>
          {
            <button
              className={
                "p-1 hover:brightness-90 rounded-md" +
                (closed ? " bg-emerald-500" : " bg-purple-600")
              }
              onClick={() => CloseOpenPost()}
            >
              Mark as {closed ? "Opened" : "Closed"}
            </button>
          }
          <button
            className={
              "hover:brightness-90 rounded-md p-1" +
              (answer ? " bg-slate-800" : " bg-slate-600")
            }
            onClick={() => setAnswer()}
          >
            Choose Best Answer
          </button>
          <button className="bg-red-600 hover:brightness-90 rounded-md p-1">
            Delete Post
          </button>
          <Popover.Close className="absolute right-2 top-2 p-1 rounded-full hover:bg-black/30">
            <X className="text-black" />
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
