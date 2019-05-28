import { useState } from "react"

const useEmail = () => {
  const [showEmail, setShowEmail] = useState(false)
  const [transition, setTransition] = useState(false)
  const [mergeEmail, setMergeEmail] = useState(false)

  return {
    mergeEmail,
    showEmail,
    transition,
    update: () => {
      setShowEmail(true)
      setTimeout(() => setTransition(true), 100)
      setTimeout(() => setMergeEmail(true), 1500)
    },
  }
}

export default useEmail
