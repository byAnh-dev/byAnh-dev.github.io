'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

const palette = ['#161e34', '#3049d9', '#536bfa', '#f6ce25', '#f6ce25', '#fa593e', '#d8ee40']
const sizes = { S: 6, M: 10, L: 16 }
type CellSize = keyof typeof sizes

export default function PixelField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: -1000, y: -1000 })
  const clock = useRef(0)
  const [paused, setPaused] = useState(false)
  const [size, setSize] = useState<CellSize>('M')
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPaused(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    let visible = true
    const cell = sizes[size]
    const hash = (x: number, y: number) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + seed * 53.9) * 43758.5453
      return value - Math.floor(value)
    }
    const noise = (x: number, y: number) => {
      const ix = Math.floor(x), iy = Math.floor(y)
      const fx = x - ix, fy = y - iy
      const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
      return (hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u) * (1 - v)
        + (hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u) * v
    }
    const draw = () => {
      context.fillStyle = '#fff'
      context.fillRect(0, 0, width, height)
      const t = clock.current * 0.00013
      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const nx = x / Math.max(width, 1), ny = y / Math.max(height, 1)
          const wave = Math.sin(nx * 7.5 + t) * 0.13 + Math.sin(nx * 15 - t * 0.8) * 0.05
          const grain = noise(nx * 11 + t, ny * 7) * 0.22 + noise(nx * 37, ny * 23 + t) * 0.09
          const distance = Math.hypot(x - pointer.current.x, y - pointer.current.y)
          const influence = Math.max(0, 1 - distance / 150) * 0.35
          const value = 0.57 + wave + grain - ny + influence
          if (value < 0.035 || (value < 0.1 && hash(x, y) > value * 9)) {
            context.fillStyle = '#f3f4f5'
            context.fillRect(x, y, cell - 1, cell - 1)
            continue
          }
          const color = Math.min(6, Math.max(0, Math.floor((value + noise(nx * 6 - t, ny * 6) * 0.22) * 8)))
          context.fillStyle = palette[color]
          context.fillRect(x, y, cell - 1, cell - 1)
        }
      }
    }
    const tick = (now: number) => {
      if (now - last > 48) {
        clock.current += last ? Math.min(now - last, 100) : 0
        last = now
        draw()
      }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      last = 0
      draw()
      if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      sync()
    })
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    resize.observe(canvas)
    intersection.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [paused, size, seed])

  return <figure className="pixel-field">
    <div className="pixel-stage" onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect()
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }} onPointerLeave={() => { pointer.current = { x: -1000, y: -1000 } }}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
    <figcaption className="field-toolbar">
      <span className="eyebrow field-caption"><span className="status-square" /> A little ordered chaos <span className="pointer-hint">/ Move your cursor</span></span>
      <div className="field-controls">
        <div className="size-controls" role="group" aria-label="Pixel size">
          <span className="eyebrow">Cell</span>
          {(['S', 'M', 'L'] as CellSize[]).map(value => <button type="button" key={value} aria-label={`${value === 'S' ? 'Small' : value === 'M' ? 'Medium' : 'Large'} pixels`} aria-pressed={size === value} onClick={() => setSize(value)}>{value}</button>)}
        </div>
        <button type="button" className="icon-button" onClick={() => setSeed(value => value + 1)} aria-label="Generate a new pattern"><RotateCcw size={15} /></button>
        <button type="button" className="icon-button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play animation' : 'Pause animation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
      </div>
    </figcaption>
  </figure>
}

