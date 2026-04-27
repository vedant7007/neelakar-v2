'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, X, Loader2, RefreshCw } from 'lucide-react'

interface FaceCaptureProps {
  onCapture: (descriptor: number[]) => void
  onCancel: () => void
  mode: 'register' | 'login'
}

export default function FaceCapture({ onCapture, onCancel, mode }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const faceApiRef = useRef<typeof import('@vladmandic/face-api') | null>(null)
  const cancelledRef = useRef(false)

  const [status, setStatus] = useState<'loading' | 'ready' | 'scanning' | 'computing' | 'captured' | 'error'>('loading')
  const [message, setMessage] = useState('Initializing...')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    cancelledRef.current = false
    // Tiny offscreen canvas for faster processing
    const pCanvas = document.createElement('canvas')
    pCanvas.width = 160
    pCanvas.height = 120
    processCanvasRef.current = pCanvas

    async function init() {
      try {
        setProgress(10)
        setMessage('Loading face engine...')

        const cameraPromise = navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 320, height: 240 },
        })

        const faceapi = await import('@vladmandic/face-api')
        if (cancelledRef.current) return

        // Force WebGL GPU acceleration
        if (faceapi.tf) {
          await (faceapi.tf as any).setBackend('webgl')
          await (faceapi.tf as any).ready()
        }

        setProgress(20)
        const MODEL_URL = '/models/face-api'

        const [stream] = await Promise.all([
          cameraPromise,
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])

        if (cancelledRef.current) { stream.getTracks().forEach(t => t.stop()); return }
        setProgress(80)
        setMessage('Warming up GPU...')

        // GPU warm-up: first WebGL inference compiles shaders (~slow),
        // so burn it here during loading instead of during live detection
        const warmup = document.createElement('canvas')
        warmup.width = 160
        warmup.height = 120
        const wCtx = warmup.getContext('2d')
        if (wCtx) {
          wCtx.fillStyle = '#888'
          wCtx.fillRect(0, 0, 160, 120)
        }
        const warmupOpts = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.1 })
        try { await faceapi.detectSingleFace(warmup, warmupOpts).withFaceLandmarks(true).withFaceDescriptor() } catch {}

        if (cancelledRef.current) { stream.getTracks().forEach(t => t.stop()); return }
        setProgress(95)

        faceApiRef.current = faceapi
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        setProgress(100)
        setStatus('ready')
        setMessage(mode === 'register' ? 'Position your face and click Capture' : 'Hold still...')

        if (mode === 'login') {
          startAutoDetect(faceapi)
        }
      } catch (err) {
        if (!cancelledRef.current) {
          setStatus('error')
          setMessage(err instanceof Error ? err.message : 'Failed to start camera')
        }
      }
    }

    init()
    return () => {
      cancelledRef.current = true
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [mode])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    const pc = processCanvasRef.current
    if (!video || !pc) return null
    const ctx = pc.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, 160, 120)
    return pc
  }, [])

  const startAutoDetect = useCallback(async (faceapi: typeof import('@vladmandic/face-api')) => {
    if (cancelledRef.current || !videoRef.current) return

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.15 })
    setStatus('scanning')

    const runDetection = async () => {
      if (cancelledRef.current) return

      // Capture frame to tiny canvas — faster than processing live video
      const frame = captureFrame()
      if (!frame) {
        if (!cancelledRef.current) setTimeout(runDetection, 30)
        return
      }

      try {
        const result = await faceapi
          .detectSingleFace(frame, options)
          .withFaceLandmarks(true)
          .withFaceDescriptor()

        if (cancelledRef.current) return

        if (result) {
          setStatus('captured')
          setMessage('Verified!')
          streamRef.current?.getTracks().forEach(t => t.stop())
          onCapture(Array.from(result.descriptor))
          return
        }
      } catch {
        if (cancelledRef.current) return
      }

      if (!cancelledRef.current) {
        setTimeout(runDetection, 20)
      }
    }

    runDetection()
  }, [onCapture, captureFrame])

  const detectFace = useCallback(async () => {
    if (!faceApiRef.current || !videoRef.current || !canvasRef.current) return

    setStatus('computing')
    setMessage('Detecting face...')

    const faceapi = faceApiRef.current
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.15 })

    const frame = captureFrame()
    const detection = await faceapi
      .detectSingleFace(frame || videoRef.current, options)
      .withFaceLandmarks(true)
      .withFaceDescriptor()

    if (!detection) {
      setStatus('ready')
      setMessage('No face detected. Try better lighting.')
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (ctx) {
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)
    }

    setStatus('captured')
    setMessage('Face captured!')
    streamRef.current?.getTracks().forEach(t => t.stop())
    onCapture(Array.from(detection.descriptor))
  }, [onCapture, captureFrame])

  const handleCancel = () => {
    cancelledRef.current = true
    streamRef.current?.getTracks().forEach(t => t.stop())
    onCancel()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[280px] h-[210px] rounded-xl overflow-hidden bg-black/30 border border-white/10">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${status === 'captured' ? 'hidden' : ''}`}
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover ${status === 'captured' ? '' : 'hidden'}`}
        />

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-3">
            <Loader2 size={24} className="text-white/40 animate-spin" />
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neel-rust rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/30 text-[11px]">{message}</p>
          </div>
        )}

        {status === 'computing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], borderColor: ['rgba(201,86,30,0.4)', 'rgba(201,86,30,0.8)', 'rgba(201,86,30,0.4)'] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-20 h-20 rounded-full border-2"
            />
            <p className="text-white/60 text-[11px] mt-3 font-medium">Verifying...</p>
          </div>
        )}

        {(status === 'scanning' || (mode === 'login' && status === 'ready')) && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-neel-rust"
              />
              <span className="text-white/50 text-[10px]">Scanning...</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {status === 'captured' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check size={14} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status !== 'loading' && (
        <p className="text-xs text-white/40 text-center">{message}</p>
      )}

      <div className="flex gap-2">
        {mode === 'register' && status === 'ready' && (
          <button
            onClick={detectFace}
            className="px-4 py-2 rounded-lg bg-neel-rust text-white text-xs font-medium hover:bg-neel-rust/85 transition-colors flex items-center gap-1.5"
          >
            <Camera size={14} />
            Capture
          </button>
        )}

        {status === 'error' && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        )}

        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </div>
  )
}
