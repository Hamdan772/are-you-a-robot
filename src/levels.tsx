import {
  useEffect,
  useRef,
  useState,
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

// Level 11 — Dial to 50
function Level11({ complete, reject }: LevelProps) {
  const [value, setValue] = useState(0)
  const exactAttempts = useRef(0)
  const change = (raw: number) => {
    if (raw === 50) {
      exactAttempts.current += 1
      if (exactAttempts.current < 3) {
        setValue(exactAttempts.current % 2 ? 49.8 : 50.2)
        return
      }
    }
    setValue(raw)
  }
  return (
    <div className="gauge-level">
      <h2>Set the dial to 50. The dial disagrees.</h2>
      <div className="gauge">
        <span style={{ transform: `rotate(${(value - 50) * 1.7}deg)` }} />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step=".1"
        value={value}
        onChange={e => change(+e.target.value)}
      />
      <button
        className="action small"
        onClick={() =>
          value === 50
            ? complete()
            : reject('That is a creative approximation.')
        }
      >
        Confirm {value.toFixed(1)}
      </button>
    </div>
  )
}

// Level 12 — Hold button
function Level12({ complete, reject }: LevelProps) {
  const [held, setHeld] = useState(0)
  const heldRef = useRef(0)
  const timer = useRef<number | null>(null)
  const maxHoldMs = 35_000
  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])
  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    if (heldRef.current > 0 && heldRef.current < 100) {
      heldRef.current = 0
      setHeld(0)
      reject('Commitment interrupted.')
    }
  }
  const start = () => {
    if (timer.current) return
    const began = Date.now()
    timer.current = window.setInterval(() => {
      const elapsed = Date.now() - began
      const time = Math.min(1, elapsed / maxHoldMs)
      const n = 100 * (1 - Math.pow(1 - time, 3))
      heldRef.current = n
      setHeld(n)
      if (time >= 1) {
        if (timer.current) clearInterval(timer.current)
        timer.current = null
        complete()
      }
    }, 30)
  }
  return (
    <div className="prompt-block">
      <h2>Hold until believed.</h2>
      <button
        className="hold-control"
        style={{ '--held': `${held}%` } as React.CSSProperties}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerCancel={stop}
        onPointerLeave={() => { if (heldRef.current > 0) stop() }}
      >
        {held ? `${Math.floor(held)}% convinced` : 'Press and hold'}
      </button>
      <p>Belief becomes more expensive near completion.</p>
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
    return { x: e.clientX - r.left, y: e.clientY - r.top }
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
        onPointerUp={end}
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

// Level 18 — Sliding puzzle
function Level18({ complete, reject }: LevelProps) {
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0]
  const [tiles, setTiles] = useState([8, 6, 7, 2, 5, 4, 3, 0, 1])
  const move = (i: number) => {
    const z = tiles.indexOf(0)
    const adjacent =
      Math.abs(z - i) === 3 ||
      (Math.abs(z - i) === 1 && Math.floor(z / 3) === Math.floor(i / 3))
    if (adjacent) {
      const n = [...tiles]
      ;[n[z], n[i]] = [n[i], n[z]]
      setTiles(n)
      if (n.join() === solved.join()) finishLater(complete)
    } else {
      reject('That tile is not adjacent to the gap.')
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
function Level21({ complete, reject }: LevelProps) {
  const [light, setLight] = useState(0)
  const lightRef = useRef(0)
  const sabotages = useRef(0)
  const toggle = (i: number) => {
    const next = lightRef.current ^ (1 << i)
    if (next === 31 && sabotages.current < 2) {
      const dropped = sabotages.current
      sabotages.current += 1
      lightRef.current = next ^ (1 << dropped)
      setLight(lightRef.current)
      reject('One indicator reconsidered at the last moment.')
      return
    }
    lightRef.current = next
    setLight(next)
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
      <button className="link-button" onClick={() => { lightRef.current = 0; setLight(0); reject('Resetting is a machine instinct.') }}>
        Reset indicators
      </button>
    </div>
  )
}

// Level 22 — Click exactly four times
function Level22({ complete, reject }: LevelProps) {
  const [count, setCount] = useState(0)
  const [waiting, setWaiting] = useState(false)
  const countRef = useRef(0)
  const waitingRef = useRef(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const click = () => {
    if (waitingRef.current) {
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
      waitingRef.current = false
      countRef.current = 0
      setWaiting(false)
      setCount(0)
      reject('The fifth click restarted the count.')
      return
    }
    const next = countRef.current + 1
    countRef.current = next
    setCount(next)
    if (next === 4) {
      waitingRef.current = true
      setWaiting(true)
      timer.current = window.setTimeout(complete, 5000)
    }
  }
  return (
    <div className="prompt-block">
      <h2>Click four times, then leave it alone.</h2>
      <button
        className="large-counter"
        onClick={click}
      >
        {waiting ? 'Wait' : count || 'Click'}
      </button>
      {waiting && <p>Do not click again for five seconds.</p>}
    </div>
  )
}

// Level 23 — Wait for permission
function Level23({ complete, reject }: LevelProps) {
  const [word, setWord] = useState('DO NOT CLICK')
  const [requesting, setRequesting] = useState(false)
  const [reason, setReason] = useState('')
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const submitReason = (event: React.FormEvent) => {
    event.preventDefault()
    if (reason.trim().length < 12) {
      reject('The reason requires at least twelve convincing characters.')
      return
    }
    if (timer.current) clearTimeout(timer.current)
    setWord('REVIEWING REASON')
    timer.current = window.setTimeout(() => {
      setWord('CLICK NOW')
      timer.current = null
    }, 1800)
  }
  return (
    <div className="prompt-block">
      <h2>The button requires its own permission.</h2>
      <button
        className="permission-button"
        onClick={() =>
          word === 'CLICK NOW' ? complete() : reject('Permission was not granted.')
        }
      >
        {word}
      </button>
      {!requesting ? (
        <button className="link-button" onClick={() => setRequesting(true)}>
          Request permission
        </button>
      ) : (
        <form className="permission-form" onSubmit={submitReason}>
          <label htmlFor="permission-reason">Reason for clicking</label>
          <textarea id="permission-reason" value={reason} onChange={event => setReason(event.target.value)} placeholder="Explain why this click is necessary." />
          <button type="submit">Submit reason</button>
        </form>
      )}
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
  const [light, setLight] = useState({ x: 50, y: 50 })
  const [button] = useState(() => {
    const seed = Date.now() % 997
    return {
      x: 16 + ((seed * 37) % 64),
      y: 22 + ((seed * 53) % 52),
    }
  })
  return (
    <div className="prompt-block">
      <h2>The lights are off. Find Continue.</h2>
      <div
        className="flashlight-room"
        style={{ '--x': `${light.x}%`, '--y': `${light.y}%` } as React.CSSProperties}
        onPointerMove={event => {
          const box = event.currentTarget.getBoundingClientRect()
          setLight({
            x: ((event.clientX - box.left) / box.width) * 100,
            y: ((event.clientY - box.top) / box.height) * 100,
          })
        }}
      >
        <button
          style={{ left: `${button.x}%`, top: `${button.y}%` }}
          onClick={complete}
        >
          Continue
        </button>
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
    ['approximate', 'Motor calibration', Level11],
    ['hold-belief', 'Presence', Level12],
    ['human-error', 'Image inspection', Level13],
    ['duck-recall', 'Visual memory', Level14],
    ['parking', 'Spatial control', Level15],
    ['parallel-parking', 'Spatial control', Level15B],
    ['draw-circle', 'Gesture analysis', Level16],
    ['agent-grid', 'Reaction', Level17],
    ['sliding-grid', 'Spatial logic', Level18],
    ['agree-disagree', 'Logical paradox', Level19],
    ['upright', 'Orientation', Level20],
    ['green-lights', 'Systems reasoning', Level21],
    ['four-clicks', 'Counting', Level22],
    ['permission', 'Impulse control', Level23],
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
