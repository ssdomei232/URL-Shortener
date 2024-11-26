'use client'

import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"

export default function Redirect({ url }: { url: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          window.location.href = url
          return 100
        }
        const diff = 100 / 50 // 50 steps for 5 seconds
        return Math.min(oldProgress + diff, 100)
      })
    }, 100)

    return () => clearInterval(timer)
  }, [url])

  return (
    <Progress value={progress} className="w-full h-2 bg-blue-200 fixed top-0 left-0 z-50" />
  )
}

