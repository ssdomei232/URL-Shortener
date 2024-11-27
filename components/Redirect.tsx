'use client'

import { useEffect, useState, useCallback } from 'react'

export default function Redirect({ url }: { url: string }) {
  const [progress, setProgress] = useState(0)

  const updateProgress = useCallback(() => {
    setProgress(oldProgress => {
      if (oldProgress >= 100) {
        window.location.href = url
        return 100
      }
      return oldProgress + 2 // 每 100ms 增加 2%
    })
  }, [url])

  useEffect(() => {
    const timer = setInterval(updateProgress, 100)
    return () => clearInterval(timer)
  }, [updateProgress])

  return progress
}

