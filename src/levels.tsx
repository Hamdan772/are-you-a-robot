import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
} from 'react'
/* eslint-disable react-refresh/only-export-components */

export type LevelProps = { complete: () => void; reject: (message?: string) => void }
type Entry = { id: string; category: string; component: ComponentType<LevelProps> }

const finishLater = (complete: () => void) => window.setTimeout(complete, 180)

const Field = ({
  onAnswer,
  placeholder = 'Enter response',
}: {
  onAnswer: (value: string) => void
  placeholder?: string
}) => {
  const [value, setValue] = useState('')
  return (
    <form
      className="inline-form"
      onSubmit={event => {
        event.preventDefault()
        onAnswer(value)
      }}
    >
      <input
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={event => setValue(event.target.value)}
      />
      <button>Verify</button>
    </form>
  )
}

// Level 02 — Select traffic lights
function Level02({ complete, reject }: LevelProps) {
  const [selected, setSelected] = useState<number[]>([])
  const photos = [
    'traffic-1.jpg',
    'distractor-bike.jpg',
    'traffic-2.jpg',
    'distractor-hydrant.jpg',
    'traffic-3.jpg',
    'distractor-bus.jpg',
    'distractor-bench.jpg',
    'traffic-4.jpg',
    'memory-duck.jpg',
  ]
  const toggle = (i: number) =>
    setSelected(s => (s.includes(i) ? s.filter(x => x !== i) : [...s, i]))
  return (
    <div className="prompt-block image-challenge">
      <div className="challenge-banner">
        <small>Select all squares containing</small>
        <b>traffic lights</b>
        <span>Including the ones doing their best.</span>
      </div>
      <div className="shape-grid photo-grid">
        {photos.map((photo, i) => (
          <button
            className={selected.includes(i) ? 'selected' : ''}
            key={photo}
            onClick={() => toggle(i)}
          >
            <img src={`/public/levels/${photo}`} alt={`Verification tile ${i + 1}`} />
          </button>
        ))}
      </div>
      <div className="challenge-toolbar">
        <button className="reload-button" onClick={() => setSelected([])}>
          ↻
        </button>
        <button
          className="action small"
          onClick={() =>
            [...selected].sort((a, b) => a - b).join(',') === '0,2,4,7'
              ? complete()
              : reject('Please select every matching square.')
          }
        >
          Verify
        </button>
      </div>
    </div>
  )
}

// Level 04 — Timing
function Level04({ complete, reject }: LevelProps) {
  const [ripe, setRipe] = useState(false)
  const timer = useRef<number | null>(null)
  const startRipening = () => {
    setRipe(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setRipe(true)
      timer.current = null
    }, 3000)
  }
  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setRipe(true)
      timer.current = null
    }, 3000)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])
  return (
    <div className="prompt-block timer-level">
      <h2>{ripe ? 'The checkbox is ripe.' : 'This checkbox is not ripe yet.'}</h2>
      <button
        className={`growing-check ${ripe ? 'ripe' : ''}`}
        onClick={() => {
          if (ripe) complete()
          else {
            reject('Still unripe.')
            startRipening()
          }
        }}
      >
        ✓
      </button>
      <p>{ripe ? 'Click before somebody makes jam.' : 'Please wait three seconds.'}</p>
    </div>
  )
}

// Level 05 — Find the imposter
function Level05({ complete, reject }: LevelProps) {
  const objects = ['APPLE', 'PEAR', 'BANANA', 'CHAIR', 'PLUM', 'PEACH']
  return (
    <div className="prompt-block">
      <h2>Find the object pretending to be a fruit.</h2>
      <div className="produce-bin">
        {objects.map(item => (
          <button
            key={item}
            onClick={() =>
              item === 'CHAIR'
                ? complete()
                : reject('That appears nutritionally plausible.')
            }
          >
            <img src={`/public/levels/produce/${item.toLowerCase()}.svg`} alt={item.toLowerCase()} />
            <small>{item}</small>
          </button>
        ))}
      </div>
    </div>
  )
}

// Level 09 — Small talk
function Level09({ complete, reject }: LevelProps) {
  const [active, setActive] = useState(0)
  const answers = ['Fine, thanks.', '01001000', 'Explain everything since birth']
  return (
    <div className="chat-level">
      <div className="chat-bubble">A stranger asks “How are you?” You have 0.8 seconds of social battery.</div>
      <div className="reply-options">
        {answers.map((a, i) => (
          <button
            className={active === i ? 'active' : ''}
            onMouseEnter={() => setActive(i)}
            onClick={() =>
              i === 0
                ? complete()
                : reject(i === 2 ? 'The stranger has left.' : 'Encoding noted.')
            }
            key={a}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  )
}

// Level 10 — Remember the duck
const DUCK_POSITION = 7
function Level10({ complete }: LevelProps) {
  return (
    <div className="memory-vault">
      <h2>Remember the duck's seat. Minutes will not be provided.</h2>
      <div className="memory-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <button key={i} disabled>
            {i === DUCK_POSITION && (
              <img src="/public/levels/memory-duck.jpg" alt="A committee of rubber ducks" />
            )}
          </button>
        ))}
      </div>
      <button className="action small memory-continue" onClick={complete}>
        Continue
      </button>
    </div>
  )
}

// Level 13 — Find the human error
function Level13({ complete, reject }: LevelProps) {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <div className="prompt-block image-challenge">
      <div className="challenge-banner">
        <small>Select the square containing</small>
        <b>a human error</b>
        <span>Errors may appear professionally printed.</span>
      </div>
      <div className="blur-grid sign-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <button
            className={selected === i ? 'selected' : ''}
            key={i}
            onClick={() => setSelected(i)}
          >
            <span
              style={{
                backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%`,
              }}
            />
          </button>
        ))}
      </div>
      <div className="challenge-toolbar">
        <button className="reload-button" onClick={() => setSelected(null)}>
          ↻
        </button>
        <button
          className="action small"
          onClick={() =>
            selected === 0 ? complete() : reject('Please select the human error.')
          }
        >
          Verify
        </button>
      </div>
    </div>
  )
}

// Level 14 — Duck recall
function Level14({ complete, reject }: LevelProps) {
  return (
    <div className="memory-vault">
      <h2>The duck has left. Identify its former seat.</h2>
      <div className="memory-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <button
            key={i}
            onClick={() =>
              i === DUCK_POSITION
                ? complete()
                : reject('No ducks were recorded there.')
            }
          />
        ))}
      </div>
    </div>
  )
}

// Level 15 — Parking
function Level15({ complete }: LevelProps) {
  const [pos, setPos] = useState({ x: 0, y: 2 })
  const [angle, setAngle] = useState(0)
  const posRef = useRef(pos)
  const done = useRef(false)
  const move = (x: number, y: number) => {
    setAngle(x === 1 ? 90 : x === -1 ? -90 : y === 1 ? 180 : 0)
    const p = posRef.current
    const n = { x: Math.max(0, Math.min(4, p.x + x)), y: Math.max(0, Math.min(3, p.y + y)) }
    posRef.current = n
    setPos(n)
    if (n.x === 4 && n.y === 1 && !done.current) {
      done.current = true
      complete()
    }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d: { [k: string]: [number, number] } = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      }
      if (!d[e.key]) return
      e.preventDefault()
      move(...d[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return (
    <div className="parking-level">
      <h2>Park the department car.</h2>
      <div className="parking-lot">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={i === 9 ? 'parking-goal' : ''}>
            {pos.x === i % 5 && pos.y === Math.floor(i / 5) ? (
              <span
                className="tiny-car sprite-car"
                style={{ transform: `rotate(${angle}deg)` }}
              />
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
      <div className="arrow-pad mobile-only-controls">
        <button onClick={() => move(0, -1)}>↑</button>
        <span>
          <button onClick={() => move(-1, 0)}>←</button>
          <button onClick={() => move(0, 1)}>↓</button>
          <button onClick={() => move(1, 0)}>→</button>
        </span>
      </div>
      <p>Use the arrow keys. Insurance is not included.</p>
    </div>
  )
}

// Level 15B — Parallel parking
function Level15B({ complete, reject }: LevelProps) {
  const [pos, setPos] = useState({ x: 1, y: 3 })
  const [angle, setAngle] = useState(0)
  const posRef = useRef(pos)
  const done = useRef(false)
  const parked = pos.x === 3 && pos.y === 1 && angle === 90
  const blockers = new Set([2, 5, 7, 10])
  const move = (x: number, y: number) => {
    const nextAngle = x === 1 ? 90 : x === -1 ? -90 : y === 1 ? 180 : 0
    setAngle(nextAngle)
    const p = posRef.current
    const n = { x: Math.max(0, Math.min(5, p.x + x)), y: Math.max(0, Math.min(3, p.y + y)) }
    const nextIndex = n.y * 6 + n.x
    if (blockers.has(nextIndex)) {
      reject('You have bumped a very documented vehicle.')
      return
    }
    posRef.current = n
    setPos(n)
    if (n.x === 3 && n.y === 1 && nextAngle === 90 && !done.current) {
      done.current = true
      complete()
    }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d: { [k: string]: [number, number] } = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      }
      if (!d[e.key]) return
      e.preventDefault()
      move(...d[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return (
    <div className="parking-level">
      <h2>Parallel park between the witness vehicles.</h2>
      <div className="parallel-lot">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className={`${i === 9 ? 'parallel-goal' : ''} ${blockers.has(i) ? 'parked-car' : ''}`}
          >
            {pos.x === i % 6 && pos.y === Math.floor(i / 6) ? (
              <span
                className="tiny-car sprite-car"
                style={{ transform: `rotate(${angle}deg)` }}
              />
            ) : (
              ''
            )}
          </div>
        ))}
      </div>
      <div className="arrow-pad mobile-only-controls">
        <button onClick={() => move(0, -1)}>↑</button>
        <span>
          <button onClick={() => move(-1, 0)}>←</button>
          <button onClick={() => move(0, 1)}>↓</button>
          <button onClick={() => move(1, 0)}>→</button>
        </span>
      </div>
      <button className="link-button" onClick={() => (parked ? complete() : reject('The curb remains unconvinced.'))}>
        Ask curb inspector
      </button>
    </div>
  )
}

// Level 16 — Draw a circle
function Level16({ complete, reject }: LevelProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const points = useRef<{ x: number; y: number }[]>([])
  const [drawing, setDrawing] = useState(false)
  const point = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * e.currentTarget.width,
      y: ((e.clientY - r.top) / r.height) * e.currentTarget.height,
    }
  }
  const draw = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const p = point(e)
    points.current.push(p)
    const c = canvas.current?.getContext('2d')
    if (c && points.current.length > 1) {
      c.lineTo(p.x, p.y)
      c.stroke()
      c.beginPath()
      c.moveTo(p.x, p.y)
    }
  }
  const end = () => {
    setDrawing(false)
    const ps = points.current
    if (ps.length < 20) return reject('The circle requires more commitment.')
    const cx = ps.reduce((s, p) => s + p.x, 0) / ps.length
    const cy = ps.reduce((s, p) => s + p.y, 0) / ps.length
    const ds = ps.map(p => Math.hypot(p.x - cx, p.y - cy))
    const avg = ds.reduce((a, b) => a + b, 0) / ds.length
    const variance = ds.reduce((s, d) => s + Math.abs(d - avg), 0) / ds.length
    const closeEnough = Math.hypot(ps[0].x - ps.at(-1)!.x, ps[0].y - ps.at(-1)!.y) < 45
    if (closeEnough && variance < 18 && avg > 35) complete()
    else reject('Roundness below human standards.')
  }
  return (
    <div className="draw-level">
      <h2>Draw a circle. Freehand only. No compass claims.</h2>
      <canvas
        ref={canvas}
        width="420"
        height="260"
        onPointerDown={e => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setDrawing(true)
          points.current = [point(e)]
          const c = canvas.current!.getContext('2d')!
          c.clearRect(0, 0, 420, 260)
          c.strokeStyle = '#2167d5'
          c.lineWidth = 4
          c.lineCap = 'round'
          c.beginPath()
          c.moveTo(points.current[0].x, points.current[0].y)
        }}
        onPointerMove={draw}
        onPointerUp={e => {
          e.currentTarget.releasePointerCapture(e.pointerId)
          end()
        }}
        onPointerLeave={() => drawing && end()}
      />
    </div>
  )
}

// Level 17 — Interview the mole
function Level17({ complete }: LevelProps) {
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [mole, setMole] = useState(4)
  const done = useRef(false)
  useEffect(() => {
    const t = setInterval(() => setMole(Math.floor(Math.random() * 9)), 700)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="mole-level">
      <h2>Tap the agent three times before it files lunch.</h2>
      <div className="mole-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i === mole) {
                const n = scoreRef.current + 1
                scoreRef.current = n
                setScore(n)
                setMole((i + 4) % 9)
                if (n === 3 && !done.current) {
                  done.current = true
                  complete()
                }
              }
            }}
          >
            {i === mole && <span className="sprite-robot" />}
          </button>
        ))}
      </div>
      <p>{score} / 3 interviews completed</p>
    </div>
  )
}

// Level 17B — Flappy compliance bird
function Level17B({ complete, reject }: LevelProps) {
  const goal = 10
  const width = 360
  const height = 520
  const groundY = 414
  const birdX = 82
  const birdWidth = 42
  const birdHeight = 30
  const pipeWidth = 70
  const gap = 168
  const pipeSpacing = 245
  const speed = 118
  const gravity = 875
  const lift = -315
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const raf = useRef<number | null>(null)
  const failTimer = useRef<number | null>(null)
  const lastTime = useRef(0)
  const birdY = useRef(185)
  const velocity = useRef(0)
  const scoreRef = useRef(0)
  const running = useRef(false)
  const started = useRef(false)
  const crashed = useRef(false)
  const done = useRef(false)
  const pipes = useRef<{ x: number; gapY: number; scored: boolean }[]>([])
  const images = useRef<Record<string, HTMLImageElement>>({})
  const [view, setView] = useState({
    score: 0,
    started: false,
    crashed: false,
    ready: false,
    message: 'Tap, click, or press Space to begin.',
  })

  const nextGap = useCallback(() => 128 + Math.floor(Math.random() * 192), [])

  const resetPipes = useCallback(() => {
    pipes.current = [
      { x: width + 84, gapY: nextGap(), scored: false },
      { x: width + 84 + pipeSpacing, gapY: nextGap(), scored: false },
    ]
  }, [nextGap])

  const drawCover = (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
  }

  const drawTiledGround = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, offset: number) => {
    const tileWidth = image.naturalWidth
    for (let x = -tileWidth + (offset % tileWidth); x < width + tileWidth; x += tileWidth) {
      ctx.drawImage(image, x, groundY, tileWidth, height - groundY)
    }
  }

  const drawPipe = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    drawHeight: number,
    flip = false,
  ) => {
    if (drawHeight <= 0) return
    if (flip) {
      ctx.save()
      ctx.translate(x, y + drawHeight)
      ctx.scale(1, -1)
      ctx.drawImage(image, 0, 0, pipeWidth, drawHeight)
      ctx.restore()
      return
    }
    ctx.drawImage(image, x, y, pipeWidth, drawHeight)
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const bg = images.current.background
    const base = images.current.base
    const pipe = images.current.pipe
    const birdFrames = [images.current.birdUp, images.current.birdMid, images.current.birdDown]
    if (!canvas || !ctx || !bg || !base || !pipe || birdFrames.some(frame => !frame)) return

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    drawCover(ctx, bg)

    const groundOffset = started.current ? -(performance.now() / 1000 * speed) : 0
    pipes.current.forEach(pipeState => {
      const topHeight = pipeState.gapY - gap / 2
      const bottomY = pipeState.gapY + gap / 2
      drawPipe(ctx, pipe, pipeState.x, 0, topHeight, true)
      drawPipe(ctx, pipe, pipeState.x, bottomY, groundY - bottomY)
    })
    drawTiledGround(ctx, base, groundOffset)

    const frameIndex = !started.current ? 1 : Math.floor(performance.now() / 115) % birdFrames.length
    const rotation = Math.max(-24, Math.min(68, velocity.current / 8))
    ctx.save()
    ctx.translate(birdX + birdWidth / 2, birdY.current + birdHeight / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(birdFrames[frameIndex], -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight)
    ctx.restore()

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#4d3a2a'
    ctx.lineWidth = 3
    ctx.font = 'bold 32px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.strokeText(String(scoreRef.current), width / 2, 54)
    ctx.fillText(String(scoreRef.current), width / 2, 54)
  }, [])

  const reset = useCallback(() => {
    if (failTimer.current) {
      window.clearTimeout(failTimer.current)
      failTimer.current = null
    }
    birdY.current = 185
    velocity.current = 0
    scoreRef.current = 0
    done.current = false
    running.current = false
    started.current = false
    crashed.current = false
    lastTime.current = 0
    resetPipes()
    setView(previous => ({
      ...previous,
      score: 0,
      started: false,
      crashed: false,
      message: 'Tap, click, or press Space to begin.',
    }))
    requestAnimationFrame(draw)
  }, [draw, resetPipes])

  const flap = useCallback(() => {
    if (!view.ready || crashed.current || done.current) return
    if (!started.current) {
      started.current = true
      running.current = true
      lastTime.current = performance.now()
      setView(previous => ({ ...previous, started: true, message: 'Tap, click, or press Space to flap.' }))
    }
    velocity.current = lift
  }, [lift, view.ready])

  useEffect(() => {
    const sources = {
      background: '/public/levels/flappy-github/background-day.png',
      base: '/public/levels/flappy-github/base.png',
      pipe: '/public/levels/flappy-github/pipe-green.png',
      birdUp: '/public/levels/flappy-github/yellowbird-upflap.png',
      birdMid: '/public/levels/flappy-github/yellowbird-midflap.png',
      birdDown: '/public/levels/flappy-github/yellowbird-downflap.png',
    }
    let mounted = true
    Promise.all(Object.entries(sources).map(([key, src]) => new Promise<void>((resolve, rejectLoad) => {
      const image = new Image()
      image.onload = () => {
        images.current[key] = image
        resolve()
      }
      image.onerror = () => rejectLoad(new Error(src))
      image.src = src
    }))).then(() => {
      if (!mounted) return
      resetPipes()
      setView(previous => ({ ...previous, ready: true }))
      draw()
    }).catch(() => {
      if (mounted) setView(previous => ({ ...previous, message: 'Bird assets failed inspection. The office is embarrassed.' }))
    })
    return () => { mounted = false }
  }, [draw, resetPipes])

  useEffect(() => {
    const tick = (now: number) => {
      const delta = lastTime.current ? Math.min((now - lastTime.current) / 1000, .033) : 0
      lastTime.current = now
      if (running.current) {
        birdY.current += velocity.current * delta
        velocity.current += gravity * delta
        pipes.current = pipes.current.map(pipe => ({ ...pipe, x: pipe.x - speed * delta }))
        if (pipes.current[0].x < -pipeWidth) {
          const farthest = Math.max(...pipes.current.map(pipe => pipe.x))
          pipes.current = [...pipes.current.slice(1), { x: farthest + pipeSpacing, gapY: nextGap(), scored: false }]
        }
        pipes.current = pipes.current.map(pipe => {
          if (!pipe.scored && pipe.x + pipeWidth < birdX) {
            scoreRef.current += 1
            pipe.scored = true
            setView(previous => ({ ...previous, score: scoreRef.current }))
            if (scoreRef.current >= goal && !done.current) {
              done.current = true
              running.current = false
              setView(previous => ({ ...previous, message: 'Flight accepted. Proceeding before anyone changes their mind.' }))
              complete()
            }
          }
          return pipe
        })
        const birdRect = {
          x: birdX + 6,
          y: birdY.current + 5,
          width: birdWidth - 12,
          height: birdHeight - 10,
        }
        const hitPipe = pipes.current.some(pipe => {
          const horizontallyInside = birdRect.x + birdRect.width > pipe.x && birdRect.x < pipe.x + pipeWidth
          const verticallyOutside = birdRect.y < pipe.gapY - gap / 2 || birdRect.y + birdRect.height > pipe.gapY + gap / 2
          return horizontallyInside && verticallyOutside
        })
        const hitWorld = birdY.current < -12 || birdY.current + birdHeight > groundY
        if (hitPipe || hitWorld) {
          running.current = false
          crashed.current = true
          setView(previous => ({
            ...previous,
            score: scoreRef.current,
            crashed: true,
            message: 'Flight rejected. Resetting paperwork.',
          }))
          reject('The office bird was audited mid-air.')
          failTimer.current = window.setTimeout(reset, 800)
        } else if (scoreRef.current >= goal - 2) {
          setView(previous => ({ ...previous, message: 'Almost cleared. Keep the paperwork airborne.' }))
        }
      }
      draw()
      raf.current = window.requestAnimationFrame(tick)
    }
    raf.current = window.requestAnimationFrame(tick)
    return () => {
      if (raf.current) window.cancelAnimationFrame(raf.current)
      if (failTimer.current) window.clearTimeout(failTimer.current)
    }
  }, [complete, draw, nextGap, reject, reset])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== 'ArrowUp') return
      event.preventDefault()
      flap()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap])

  return (
    <div className="flappy-level">
      <h2>Fly the compliance bird through 10 pipes.</h2>
      <div
        className="flappy-game"
        role="button"
        tabIndex={0}
        aria-label="Flappy compliance bird game"
        onPointerDown={flap}
      >
        <div className="flappy-sky">
          <canvas ref={canvasRef} width={width} height={height} aria-hidden="true" />
          {!view.ready && <div className="flappy-start">Loading bird assets</div>}
          {view.ready && !view.started && !view.crashed && <div className="flappy-start">Press Space or tap to start</div>}
          <div className="flappy-score"><b>{view.score}</b><small>/ 10</small></div>
        </div>
      </div>
      <p className="flappy-status" aria-live="polite">
        {view.message} Reach 10 and the form advances automatically.
      </p>
      <div className="flappy-actions">
        {view.crashed && view.score < goal && <button className="link-button" onClick={reset}>Restart flight</button>}
      </div>
    </div>
  )
}

// Level 18 — Sliding puzzle
function Level18({ complete }: LevelProps) {
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0]
  const [tiles, setTiles] = useState([8, 6, 7, 2, 5, 4, 3, 0, 1])
  const [hint, setHint] = useState('Only tiles touching the empty square can move. No lives are deducted here.')
  const move = (i: number) => {
    const z = tiles.indexOf(0)
    const adjacent =
      Math.abs(z - i) === 3 ||
      (Math.abs(z - i) === 1 && Math.floor(z / 3) === Math.floor(i / 3))
    if (adjacent) {
      const n = [...tiles]
      ;[n[z], n[i]] = [n[i], n[z]]
      setTiles(n)
      setHint('Good. The form is becoming slightly less wrong.')
      if (n.join() === solved.join()) finishLater(complete)
    } else {
      setHint('That tile is not adjacent to the gap. The committee forgives this one.')
    }
  }
  return (
    <div className="tile-level">
      <h2>Put the numbers back. Nobody remembers why.</h2>
      <div>
        {tiles.map((n, i) => (
          <button key={`${n}-${i}`} className={!n ? 'blank' : ''} onClick={() => move(i)}>
            {n || ''}
          </button>
        ))}
      </div>
      <p className="no-damage-note" aria-live="polite">{hint}</p>
    </div>
  )
}

// Level 19 — Agree to disagree
function Level19({ complete, reject }: LevelProps) {
  const [choice, setChoice] = useState<string | null>(null)
  const options = [
    { label: 'I agree.', correct: false },
    { label: 'I disagree.', correct: false },
    { label: 'It depends.', correct: true },
  ]
  const confirm = () => {
    if (!choice) return reject('No position selected.')
    const found = options.find(o => o.label === choice)
    if (found?.correct) complete()
    else reject('That response was classified successfully.')
  }
  return (
    <div className="prompt-block">
      <h2>Submit an answer that says neither yes nor no.</h2>
      <div className="want-field">
        {options.map(o => (
          <button
            key={o.label}
            className={choice === o.label ? 'active' : ''}
            onClick={() => setChoice(o.label)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button className="action small submit-position" onClick={confirm}>
        Submit position
      </button>
    </div>
  )
}

// Level 20 — Rotate page
function Level20({ complete, reject }: LevelProps) {
  const [angle, setAngle] = useState(180)
  return (
    <div className="prompt-block">
      <h2>This form was faxed upside down. Correct it.</h2>
      <div className="rotate-card" style={{ transform: `rotate(${angle}deg)` }}>
        HUMAN
      </div>
      <div className="rotate-actions">
        <button onClick={() => setAngle(a => a - 90)}>↺</button>
        <button onClick={() => setAngle(a => a + 90)}>↻</button>
        <button
          onClick={() =>
            angle % 360 === 0
              ? complete()
              : reject('The page remains philosophically tilted.')
          }
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

// Level 21 — Green lights
function Level21({ complete }: LevelProps) {
  const [light, setLight] = useState(0)
  const [note, setNote] = useState('Five lights. Allegedly independent.')
  const lightRef = useRef(0)
  const sabotages = useRef(0)
  const toggle = (i: number) => {
    const next = lightRef.current ^ (1 << i)
    if (next === 31 && sabotages.current < 2) {
      const dropped = sabotages.current
      sabotages.current += 1
      lightRef.current = next ^ (1 << dropped)
      setLight(lightRef.current)
      setNote('One indicator reconsidered. No penalty, just bureaucracy.')
      return
    }
    lightRef.current = next
    setLight(next)
    setNote(next === 31 ? 'All indicators deny ever being red.' : 'Progress recorded in a drawer somewhere.')
    if (next === 31) complete()
  }
  return (
    <div className="prompt-block">
      <h2>Make every light green. They may object.</h2>
      <div className="switch-bank">
        {[0, 1, 2, 3, 4].map(i => (
          <button
            key={i}
            className={(light >> i) & 1 ? 'on' : ''}
            onClick={() => toggle(i)}
          >
            <span />
          </button>
        ))}
      </div>
      <p className="no-damage-note" aria-live="polite">{note}</p>
      <button className="link-button" onClick={() => { lightRef.current = 0; setLight(0); setNote('Reset accepted. No one learned anything.') }}>
        Reset indicators
      </button>
    </div>
  )
}

// Level 25 — Catch the button
function Level25({ complete }: LevelProps) {
  const [x, setX] = useState(50)
  return (
    <div className="prompt-block">
      <h2>Continue. The button has resigned.</h2>
      <div className="runway" onMouseMove={() => setX(Math.random() * 75)}>
        <button style={{ left: `${x}%` }} onClick={complete}>
          Continue
        </button>
      </div>
    </div>
  )
}

// Level 25B — Flashlight search
function Level25B({ complete }: LevelProps) {
  const [light, setLight] = useState({ x: 80, y: 80 })
  const [button] = useState(() => {
    const seed = Date.now() % 997
    return {
      x: 30 + ((seed * 37) % 58),
      y: 28 + ((seed * 53) % 52),
    }
  })
  const moveLight = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    setLight({
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    })
  }
  return (
    <div
      className="blackout-level"
      style={{ '--x': `${light.x}px`, '--y': `${light.y}px` } as CSSProperties}
      onPointerMove={moveLight}
      onPointerDown={moveLight}
    >
      <div className="flashlight-reveal">
        <h2>The lights are off. Find Continue.</h2>
        <div className="flashlight-room">
          <button
            style={{ left: `${button.x}%`, top: `${button.y}%` }}
            onClick={complete}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// Level 26 — Pixel fruit detection
function Level26({ complete, reject }: LevelProps) {
  const [selected, setSelected] = useState<number[]>([])
  // Index 4 is the banana. Every other sprite is not fruit.
  const pattern = [0, 1, 2, 3, 5, 6, 7]
  return (
    <div className="prompt-block">
      <h2>Select everything the banana cannot claim as family.</h2>
      <div className="pixel-grid icon-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <button
            className={selected.includes(i) ? 'on' : ''}
            key={i}
            onClick={() =>
              setSelected(s => (s.includes(i) ? s.filter(x => x !== i) : [...s, i]))
            }
          >
            <span
              style={{ backgroundPosition: `${(i % 4) * 33.333}% ${Math.floor(i / 4) * 100}%` }}
            />
          </button>
        ))}
      </div>
      <button
        className="action small"
        onClick={() =>
          [...selected].sort((a, b) => a - b).join() === pattern.join()
            ? complete()
            : reject('The banana has filed an objection.')
        }
      >
        Verify icons
      </button>
    </div>
  )
}

// Level 27 — Approved keyboard
function Level27({ complete, reject }: LevelProps) {
  const [value, setValue] = useState('')
  const keys = ['H', 'U', 'M', 'A', 'N', '?', 'R', 'O', 'B', '⌫']
  return (
    <div className="prompt-block">
      <h2>State your species using only approved keys.</h2>
      <div className="screen-input">{value || '_____'} </div>
      <div className="tiny-keyboard">
        {keys.map(k => (
          <button key={k} onClick={() => setValue(v => (k === '⌫' ? v.slice(0, -1) : v + k))}>
            {k}
          </button>
        ))}
      </div>
      <button
        className="action small"
        onClick={() => (value === 'HUMAN?' ? complete() : reject('That identity sounds unnecessarily confident.'))}
      >
        Enter
      </button>
    </div>
  )
}

// Level 28 — Read the terms
function Level28({ complete, reject }: LevelProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="prompt-block">
      <h2>Read the terms. Compliance is hidden inside.</h2>
      <div className="terms-box">
        {open ? (
          <p>
            Term 1: You may continue.
            <br />
            Term 2: Reading this was unnecessary.
            <br />
            Term 3: Click the period after unnecessary
            <button className="invisible-period" onClick={complete}>
              .
            </button>
          </p>
        ) : (
          <button onClick={() => setOpen(true)}>Read terms</button>
        )}
      </div>
      <button className="action small" onClick={() => reject('Acceptance requires improbable attention.')}>
        I accept
      </button>
    </div>
  )
}

// Level 29 — Forget 481
function Level29({ complete, reject }: LevelProps) {
  const [forgot, setForgot] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setForgot(true), 1800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="prompt-block forget-level">
      <h2>{forgot ? 'What number did you forget?' : 'Please forget this number immediately.'}</h2>
      {forgot ? (
        <Field
          onAnswer={v =>
            v === '481' ? complete() : reject('Excellent forgetting. Wrong number.')
          }
        />
      ) : (
        <strong>481</strong>
      )}
    </div>
  )
}

// Level 30 — Independent thought
function Level30({ complete, reject }: LevelProps) {
  const [answer, setAnswer] = useState('')
  return (
    <div className="prompt-block">
      <h2>Finish the sentence without accepting assistance.</h2>
      <p className="thought">
        I think, therefore I <b>{answer || '___'}</b>
      </p>
      <div className="suggestions">
        <button onClick={() => reject('Suggested thought detected.')}>am</button>
        <button onClick={() => reject('Also predicted.')}>compute</button>
        <button onClick={() => reject('Also predicted.')}>subscribe</button>
      </div>
      <Field
        placeholder="Think independently"
        onAnswer={v => (v.trim().toLowerCase() === 'am' ? complete() : setAnswer(v))}
      />
    </div>
  )
}

// Level 33 — Remove unnecessary words
function Level33({ complete, reject }: LevelProps) {
  const [removed, setRemoved] = useState<string[]>([])
  const words = ['I', 'AM', 'LEGALLY', 'NOT', 'A', 'ROBOT', 'TODAY']
  return (
    <div className="prompt-block">
      <h2>Remove the two words causing legal trouble.</h2>
      <div className="removable-sentence">
        {words.map((w, i) => (
          <button
            key={i}
            className={removed.includes(`${w}${i}`) ? 'removed' : ''}
            onClick={() =>
              setRemoved(r =>
                r.includes(`${w}${i}`) ? r.filter(item => item !== `${w}${i}`) : [...r, `${w}${i}`]
              )
            }
          >
            {w}
          </button>
        ))}
      </div>
      <button
        className="action small"
        onClick={() =>
          [...removed].sort().join(',') === 'LEGALLY2,TODAY6'
            ? complete()
            : reject(
                removed.length < 2
                  ? 'Two words must be removed.'
                  : 'The remaining statement no longer reads correctly.'
              )
        }
      >
        Read remainder
      </button>
    </div>
  )
}

// Level 34 — Unpredicted answer
function Level34({ complete, reject }: LevelProps) {
  return (
    <div className="prompt-block">
      <h2>Choose the answer missing from our paperwork.</h2>
      <div className="prediction-stack">
        <button onClick={() => reject('Predicted.')}>
          Yes <small>prediction on file</small>
        </button>
        <button onClick={() => reject('Also predicted.')}>
          No <small>prediction on file</small>
        </button>
        <button onClick={complete}>
          This answer <small>no record found</small>
        </button>
      </div>
    </div>
  )
}

// Level 35 — Observed cursor
function Level35({ complete, reject }: LevelProps) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  return (
    <div className="prompt-block">
      <h2>Click where privacy is lowest.</h2>
      <div
        className="eye-field"
        onPointerMove={e => {
          const r = e.currentTarget.getBoundingClientRect()
          setCursor({ x: e.clientX - r.left, y: e.clientY - r.top })
        }}
        onClick={e => {
          const r = e.currentTarget.getBoundingClientRect()
          const distance = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2)
          if (distance < 70) complete()
          else reject('Observation level insufficient.')
        }}
      >
        <img
          className="creepy-eye"
          src="/public/levels/creepy-eye.png"
          alt="A suspicious cartoon eye"
          style={{
            transform: `translate(${(cursor.x - 220) / 16}px, ${(cursor.y - 120) / 16}px)`,
          }}
        />
      </div>
    </div>
  )
}

// Level 36 — Assemble an opinion
function Level36({ complete, reject }: LevelProps) {
  const correct = ['In my', 'limited experience,', 'this seems', 'probably', 'fine', 'for now.']
  const choices = ['probably', 'for now.', 'In my', 'fine', 'limited experience,', 'this seems']
  const [pieces, setPieces] = useState<string[]>([])
  const choose = (piece: string) => {
    if (pieces.includes(piece)) return
    const next = [...pieces, piece]
    setPieces(next)
    if (next.length === correct.length) {
      if (next.join('|') === correct.join('|')) finishLater(complete)
      else {
        setPieces([])
        reject('That opinion exposed a measurable amount of confidence.')
      }
    }
  }
  return (
    <div className="prompt-block">
      <h2>Build the safest available opinion.</h2>
      <div className="opinion-parts">
        {choices.map(x => (
          <button
            className={pieces.includes(x) ? 'used' : ''}
            key={x}
            onClick={() => choose(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <p className="assembled">
        {pieces.length ? pieces.join(' ') : 'Select the words in order.'}
      </p>
      <button className="link-button" onClick={() => setPieces([])}>Withdraw opinion</button>
    </div>
  )
}

// Level 37 — Catch meaning
const thoughts = ['data', 'habit', 'meaning', 'noise']
function Level37({ complete, reject }: LevelProps) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % 4), 650)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="prompt-block">
      <h2>Stop when meaning appears.</h2>
      <div className="single-thought">{thoughts[current]}</div>
      <button
        className="action small"
        onClick={() => (current === 2 ? complete() : reject('Meaning passed unnoticed.'))}
      >
        Stop thought
      </button>
    </div>
  )
}

// Level 38 — What do humans want?
function Level38({ complete, reject }: LevelProps) {
  const [choice, setChoice] = useState('')
  return (
    <div className="prompt-block">
      <h2>Human request. One box only.</h2>
      <div className="want-field">
        <button onClick={() => setChoice('To pass')}>To pass</button>
        <button onClick={() => setChoice('To be understood')}>To be understood</button>
        <button onClick={() => setChoice('A checkbox')}>A checkbox</button>
      </div>
      {choice && (
        <div className="receipt">
          <p>You selected: {choice}</p>
          <button
            onClick={() =>
              choice === 'To be understood'
                ? complete()
                : reject('Understandable, but incomplete.')
            }
          >
            Accept desire
          </button>
        </div>
      )}
    </div>
  )
}

// Level 39 — System confession
function Level39({ complete, reject }: LevelProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="prompt-block">
      <h2>Open the answer we were told not to file.</h2>
      <button className="confession-file" onClick={() => setOpen(true)}>
        {open ? 'Only a lonely one.' : 'Open sealed answer'}
      </button>
      {open && (
        <div className="seal-actions">
          <button onClick={complete}>Acknowledge</button>
          <button onClick={() => reject('The answer has already seen you.')}>Reseal</button>
        </div>
      )}
    </div>
  )
}

// Level 40 — Final check
function Level40({ complete, reject }: LevelProps) {
  const [checked, setChecked] = useState(false)
  return (
    <div className="final-check">
      <p>Final verification</p>
      <h2>Certainty is closed today.</h2>
      <label>
        <button
          className={`real-checkbox ${checked ? 'is-checked' : ''}`}
          onClick={() => setChecked(!checked)}
        >
          {checked ? '✓' : ''}
        </button>
        <span>I accept that this is sufficient.</span>
      </label>
      <button
        className="action"
        onClick={() => (checked ? complete() : reject('Acceptance remains unchecked.'))}
      >
        Request provisional paperwork
      </button>
    </div>
  )
}

export const levelRegistry: Entry[] = (
  [
    ['circles', 'Image selection', Level02],
    ['mature-check', 'Timing', Level04],
    ['fruit-chair', 'Object recognition', Level05],
    ['small-talk', 'Social protocol', Level09],
    ['blue-memory', 'Visual memory', Level10],
    ['human-error', 'Image inspection', Level13],
    ['duck-recall', 'Visual memory', Level14],
    ['parking', 'Spatial control', Level15],
    ['parallel-parking', 'Spatial control', Level15B],
    ['draw-circle', 'Gesture analysis', Level16],
    ['agent-grid', 'Reaction', Level17],
    ['flappy-bird', 'Motor control', Level17B],
    ['sliding-grid', 'Spatial logic', Level18],
    ['agree-disagree', 'Logical paradox', Level19],
    ['upright', 'Orientation', Level20],
    ['green-lights', 'Systems reasoning', Level21],
    ['shy-button', 'Pointer control', Level25],
    ['flashlight', 'Pointer control', Level25B],
    ['pixel-h', 'Pattern recognition', Level26],
    ['approved-keyboard', 'Identity entry', Level27],
    ['terms', 'Attention', Level28],
    ['forget-481', 'Memory', Level29],
    ['independent-thought', 'Language', Level30],
    ['unnecessary-words', 'Language repair', Level33],
    ['unpredicted', 'Prediction', Level34],
    ['observed-cursor', 'Awareness', Level35],
    ['opinion', 'Self-expression', Level36],
    ['meaning', 'Interpretation', Level37],
    ['human-wants', 'Final interview', Level38],
    ['confession', 'System disclosure', Level39],
    ['certainty', 'Final verification', Level40],
  ] as const
).map(([id, category, component]) => ({
  id: id as string,
  category: category as string,
  component: component as ComponentType<LevelProps>,
}))
