import { useCallback, useEffect, useRef, useState } from 'react'

export type PreviewParams = {
  blur: number
  sharpen: number
  enhance: number
  denoise: number
  brightness: number
  grayscale: number
  jpeg_quality: number
}

export type PreviewHookReturn = {
  imgRef: React.RefObject<HTMLImageElement | null>
  prevUrlRef: React.MutableRefObject<string | null>
  isConnected: boolean
  fps: number
  sendParams: (params: PreviewParams) => void
}

export function useImagePreview(sessionId: string | null): PreviewHookReturn {
  const imgRef = useRef<HTMLImageElement>(null)
  const prevUrlRef = useRef<string | null>(null)
  const fpsCounterRef = useRef(0)
  const wsRef = useRef<WebSocket | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [fps, setFps] = useState(0)

  useEffect(() => {
    console.log('useImagePreview, sessionId', sessionId)

    if (!sessionId) {
      // if (fallbackUrl && imgRef.current) {
      //   imgRef.current.src = fallbackUrl
      // }
      return
    }

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/preview/${sessionId}`)
    ws.binaryType = 'blob'
    wsRef.current = ws

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    ws.onerror = () => setIsConnected(false)

    ws.onmessage = (e: MessageEvent<Blob>) => {
      const newUrl = URL.createObjectURL(e.data)

      console.log('newUrl', newUrl)

      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current)
      }
      prevUrlRef.current = newUrl

      if (imgRef.current) {
        imgRef.current.src = newUrl
      }

      fpsCounterRef.current += 1
    }

    const fpsInterval = setInterval(() => {
      setFps(fpsCounterRef.current)
      fpsCounterRef.current = 0
    }, 1000)

    return () => {
      clearInterval(fpsInterval)
      ws.close()
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current)
        prevUrlRef.current = null
      }
    }
  }, [sessionId])

  const sendParams = useCallback((params: PreviewParams) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(params))
    }
  }, [])

  return { imgRef, prevUrlRef, isConnected, fps, sendParams }
}
