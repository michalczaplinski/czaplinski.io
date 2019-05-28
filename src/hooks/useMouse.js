import { useEffect, useState } from "react"

const useMouse = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const onMouse = ({ clientX, clientY }) => {
    setMouse({ x: clientX, y: clientY })
  }

  useEffect(() => {
    window.addEventListener("mousemove", onMouse)

    return () => {
      window.removeEventListener("mousemove", onMouse)
    }
  })

  return mouse
}

export default useMouse
