import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { levelRegistry } from './levels'
import './App.css'

const STORAGE = 'human-verification-progress-v7'
const MAX_HEALTH = 5
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
type Save = { index: number; errors: number; health: number }
const failurePrefixes = [
  'Your file has been moved closer to the shredder.',
  'The committee looked concerned.',
  'Sonny circled something twice.',
]

const buildCertificateText = (errors: number) => [
  `FORM RH-${levelRegistry.length}-B · PROVISIONAL HUMANITY NOTICE`,
  'STATUS: HUMAN ENOUGH FOR ORDINARY PURPOSES',
  'CONFIDENCE: 51%',
  '',
  'Approved activities:',
  '- Opening doors',
  '- Having opinions',
  '- Forgetting why you entered a room',
  '',
  'Restrictions:',
  '- Proving consciousness',
  '- Operating a very serious toaster',
  '- Explaining this document to an auditor',
  '',
  `Character-building errors: ${errors}`,
  'Filed by: Bureau of Human Guessing',
  'Responsibility accepted by: nobody available',
].join('\n')

function App() {
  const saved = useMemo<Save | null>(() => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE) || 'null') as Save | null
      return value && value.index >= 0 && value.index < levelRegistry.length ? value : null
    } catch {
      return null
    }
  }, [])
  const [screen, setScreen] = useState<'start' | 'game' | 'certificate' | 'gameover'>('start')
  const [index, setIndex] = useState(saved?.index || 0)
  const [errors, setErrors] = useState(saved?.errors || 0)
  const [health, setHealth] = useState(saved?.health ?? MAX_HEALTH)
  const [healthHit, setHealthHit] = useState(0)
  const [notice, setNotice] = useState('')
  const [verified, setVerified] = useState(false)
  const [konamiEnabled, setKonamiEnabled] = useState(false)
  const [resumeAvailable, setResumeAvailable] = useState(Boolean(saved && saved.index > 0))
  const [shared, setShared] = useState(false)
  const completing = useRef(false)
  const konamiIndex = useRef(0)
  const noticeTimer = useRef<number | null>(null)
  const level = levelRegistry[index]

  useEffect(() => {
    if (screen === 'game' && health > 0) localStorage.setItem(STORAGE, JSON.stringify({ index, errors, health }))
  }, [screen, index, errors, health])
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current) }, [])
  useEffect(() => {
    const listen = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      if (key === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0
          setKonamiEnabled(true)
        }
      } else {
        konamiIndex.current = key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', listen)
    return () => window.removeEventListener('keydown', listen)
  }, [])

  const begin = (fresh: boolean) => {
    if (fresh) {
      setIndex(0)
      setErrors(0)
      setHealth(MAX_HEALTH)
      localStorage.removeItem(STORAGE)
    }
    setResumeAvailable(false)
    setScreen('game')
  }

  const advance = (delay: number, showVerified: boolean) => {
    if (completing.current || screen !== 'game') return
    completing.current = true
    setNotice('')
    setVerified(showVerified)
    window.setTimeout(() => {
      if (index === levelRegistry.length - 1) {
        localStorage.removeItem(STORAGE)
        setScreen('certificate')
      } else {
        setIndex(value => value + 1)
      }
      setVerified(false)
      completing.current = false
    }, delay)
  }

  const complete = () => advance(450, true)

  const reject = (message = 'Please try again.') => {
    setErrors(value => value + 1)
    setHealthHit(value => value + 1)
    setHealth(value => {
      const next = Math.max(0, value - 1)
      if (next === 0) {
        completing.current = true
        setNotice('')
        localStorage.removeItem(STORAGE)
        window.setTimeout(() => setScreen('gameover'), 260)
      }
      return next
    })
    setNotice(`${message} ${failurePrefixes[errors % failurePrefixes.length]}`)
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => {
      setNotice('')
      noticeTimer.current = null
    }, 1300)
  }

  const skip = () => advance(160, false)
  const finishGameOver = useCallback(() => {
    completing.current = false
    setIndex(0)
    setErrors(0)
    setHealth(MAX_HEALTH)
    setScreen('start')
  }, [])

  const Level = level?.component

  return <main>
    {screen !== 'start' && <img className="recaptcha-watermark" src="/public/recaptcha-logo.svg" alt="reCAPTCHA" />}
    <AnimatePresence mode="wait">
      {screen === 'start' && <motion.section className="start-page" key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <StartCaptcha onComplete={() => begin(!resumeAvailable)} resume={resumeAvailable ? saved : null} />
      </motion.section>}

      {screen === 'game' && Level && <motion.section className="level-page" key={level.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .18 }}>
        <CaseBadge index={index} total={levelRegistry.length} category={level.category} />
        <div className="level-stage">
          <Level complete={complete} reject={reject} />
          <AnimatePresence>{verified && <motion.div className="verified-flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><span>✓</span><b>Verified</b></motion.div>}</AnimatePresence>
        </div>
        <AnimatePresence>{notice && <motion.div role="alert" className="inline-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><b>Verification unsuccessful.</b> {notice}</motion.div>}</AnimatePresence>
        {konamiEnabled && <button className="skip-question" onClick={skip}>Skip question</button>}
        <HealthBar health={health} hit={healthHit} />
      </motion.section>}

      {screen === 'certificate' && <motion.section className="certificate-page" key="certificate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Certificate errors={errors} shared={shared} onShare={() => setShared(true)} onRestart={() => begin(true)} />
      </motion.section>}

      {screen === 'gameover' && <GameOver onFinished={finishGameOver} />}
    </AnimatePresence>
  </main>
}

function HealthBar({ health, hit }: { health: number; hit: number }) {
  return <div className="health-wrap" key={hit} role="status" aria-live="polite" aria-label={`${health} health remaining`}>
    <span className="health-label">VERIFICATION HEALTH <b>{health}/{MAX_HEALTH}</b></span>
    <div className="health-bar">
      {Array.from({ length: MAX_HEALTH }, (_, i) => <span className={`pixel-heart ${i < health ? 'full' : 'empty'}`} key={i}>♥</span>)}
    </div>
  </div>
}

function CaseBadge({ index, total, category }: { index: number; total: number; category: string }) {
  return <aside className="case-badge" aria-label={`Verification level ${index + 1} of ${total}`}>
    <b>FORM RH-{String(index + 1).padStart(2, '0')}</b>
    <span>{index + 1}/{total}</span>
    <small>{category}</small>
  </aside>
}

function GameOver({ onFinished }: { onFinished: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onFinished, 6200)
    return () => window.clearTimeout(timer)
  }, [onFinished])
  return <motion.section className="game-over" key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="exit-scene">
      <div className="alarm-light" />
      <div className="failure-stamp">NOT VERIFIED</div>
      <div className="exit-door"><span>EXIT</span></div>
      <div className="floor-line" />
      <div className="departing-human"><i /><b /></div>
      <div className="pointing-robot"><img src="/public/sonny-logo.jpg" alt="Sonny pointing toward the exit" /><i /><em /></div>
      <p className="game-over-order">Verification failed.<br /><b>Please exit calmly and pretend this was voluntary.</b></p>
    </div>
  </motion.section>
}

function Certificate({ errors, shared, onShare, onRestart }: { errors: number; shared: boolean; onShare: () => void; onRestart: () => void }) {
  const copyCertificate = async () => {
    const text = buildCertificateText(errors)
    try {
      await navigator.clipboard?.writeText(text)
    } catch {
      // Clipboard can fail on older or restricted browsers; the visible certificate remains selectable.
    }
    onShare()
  }
  return <>
    <div className="certificate">
      <div className="cert-top">
        <img className="brand-logo certificate-logo" src="/public/sonny-logo.jpg" alt="Sonny robot" />
        <span>FORM RH-{levelRegistry.length}-B · PROVISIONAL</span>
      </div>
      <div className="cert-band"><span>Bureau of Human Guessing</span><span>Identity Assurance Division</span></div>
      <p>Certificate of acceptable uncertainty</p>
      <h1>After considerable administrative hesitation, the bearer is classified as</h1>
      <strong>Human enough for <br />ordinary purposes</strong>
      <div className="cert-rule" />
      <div className="certificate-findings">
        <p><b>Approved activities</b> Opening doors, having opinions, forgetting why you entered a room.</p>
        <p><b>Restrictions</b> Proving consciousness, operating a very serious toaster, explaining this document to an auditor.</p>
      </div>
      <div className="cert-signatures"><span><i>51%</i><b>Official confidence</b></span><span><i>{errors}</i><b>Character-building errors</b></span><span><i>Filed</i><b>Against advice</b></span></div>
      <p className="certified-by">Issued automatically by a system that briefly felt something.</p>
      <div className="cert-barcode" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="emboss">MOSTLY<br />ORGANIC</div>
    </div>
    <div className="certificate-actions"><button className="action" onClick={copyCertificate}>{shared ? 'Certificate copied' : 'Copy certificate'}</button><button className="link-button" onClick={onRestart}>Investigate another person</button></div>
  </>
}

function StartCaptcha({ onComplete, resume }: { onComplete: () => void; resume?: Save | null }) {
  const [state, setState] = useState<'idle' | 'checking' | 'done'>('idle')
  const verify = () => {
    if (state !== 'idle') return
    setState('checking')
    window.setTimeout(() => setState('done'), 650)
    window.setTimeout(onComplete, 1050)
  }
  return <div className="recaptcha-shell start-captcha" onClick={verify}>
    <div className="recaptcha-main"><button className={`recaptcha-checkbox ${state}`} aria-label="I am not a robot">{state === 'done' ? '✓' : ''}</button><span>I'm not a robot</span><RecaptchaBrand /></div>
    <div className="recaptcha-footer"><span>{resume ? `Resume RH-${String(resume.index + 1).padStart(2, '0')}` : 'Protected by rHuman™'}</span><span>{resume ? `${Math.max(0, resume.health)} hearts left` : 'Privacy · Terms'}</span></div>
  </div>
}

export function RecaptchaBrand() {
  return <div className="recaptcha-brand"><img src="/public/recaptcha-logo.svg" alt="reCAPTCHA verification badge" /></div>
}

export default App
