import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { Brand, Product } from '../../types'
import { formatPrice, effectivePrice } from '../../lib/format'

interface Props {
  slides: Product[]
  brands: Brand[]
}

const AUTOPLAY_MS = 6000

const TYPES = [
  { value: 'scooters', label: 'Scooters' },
  { value: 'parts', label: 'Parts' },
  { value: 'accessories', label: 'Accessories' },
]

const LINE1 = 'The Finest Italian'
const LINE2 = 'Scooters & Parts'
const CHAR_MS = 65
const DELETE_MS = 38
const PAUSE_INITIAL = 2000
const PAUSE_HOLD = 1400
const PAUSE_BETWEEN = 300

const STATS = [
  { value: '600+', label: 'In stock' },
  { value: '24', label: 'Branches' },
  { value: '12 yrs', label: 'Experience' },
]

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* Original looping typewriter: both lines shown, then delete L1 -> retype L1 ->
   delete L2 -> retype L2 -> loop. Disabled (static) under reduced motion. */
type TwPhase = 'idle' | 'deleting1' | 'typing1' | 'hold1' | 'deleting2' | 'typing2' | 'hold2'

function useTypewriter(enabled: boolean) {
  const [l1, setL1] = useState(LINE1)
  const [l2, setL2] = useState(LINE2)
  const [phase, setPhase] = useState<TwPhase>('idle')

  useEffect(() => {
    if (!enabled) return
    let id: ReturnType<typeof setTimeout>

    if (phase === 'idle') {
      id = setTimeout(() => setPhase('deleting1'), PAUSE_INITIAL)
    } else if (phase === 'deleting1') {
      if (l1.length > 0) id = setTimeout(() => setL1(l1.slice(0, -1)), DELETE_MS)
      else id = setTimeout(() => setPhase('typing1'), PAUSE_BETWEEN)
    } else if (phase === 'typing1') {
      if (l1.length < LINE1.length) id = setTimeout(() => setL1(LINE1.slice(0, l1.length + 1)), CHAR_MS)
      else id = setTimeout(() => setPhase('hold1'), PAUSE_HOLD)
    } else if (phase === 'hold1') {
      setPhase('deleting2')
    } else if (phase === 'deleting2') {
      if (l2.length > 0) id = setTimeout(() => setL2(l2.slice(0, -1)), DELETE_MS)
      else id = setTimeout(() => setPhase('typing2'), PAUSE_BETWEEN)
    } else if (phase === 'typing2') {
      if (l2.length < LINE2.length) id = setTimeout(() => setL2(LINE2.slice(0, l2.length + 1)), CHAR_MS)
      else id = setTimeout(() => setPhase('hold2'), PAUSE_HOLD)
    } else {
      setPhase('deleting1')
    }

    return () => clearTimeout(id)
  }, [phase, l1, l2, enabled])

  const cursorLine =
    phase === 'deleting1' || phase === 'typing1' || phase === 'hold1' ? 1
    : phase === 'idle' ? 0
    : 2

  return { l1, l2, cursorLine }
}

function TypewriterHeadline() {
  const reduce = useReducedMotion()
  const { l1, l2, cursorLine } = useTypewriter(!reduce)
  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-5 min-h-[2.1em] font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
    >
      <span>
        {l1}
        {cursorLine === 1 && (
          <span className="cursor-blink ml-1 inline-block w-[3px] translate-y-[3px] rounded-sm bg-white align-middle" style={{ height: '0.82em' }} />
        )}
      </span>
      <br />
      <span className="text-carrot">
        {l2}
        {cursorLine === 2 && (
          <span className="cursor-blink ml-1 inline-block w-[3px] translate-y-[3px] rounded-sm bg-carrot align-middle" style={{ height: '0.82em' }} />
        )}
        {/* reserve space so layout doesn't shift when l2 empties */}
        {l2.length === 0 && <span className="invisible">x</span>}
      </span>
    </motion.h1>
  )
}

export default function HeroSlider({ slides, brands }: Props) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused] = useState(false)
  const [type, setType] = useState('scooters')
  const [brand, setBrand] = useState('')

  // Cursor-driven depth. Normalised -0.5..0.5 across the stage, smoothed.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 110, damping: 18, mass: 0.4 })
  const rotY = useTransform(sx, [-0.5, 0.5], [14, -14])
  const rotX = useTransform(sy, [-0.5, 0.5], [-9, 9])
  const scootX = useTransform(sx, [-0.5, 0.5], [26, -26])
  const gridX = useTransform(sx, [-0.5, 0.5], [-26, 26])
  const gridY = useTransform(sy, [-0.5, 0.5], [-18, 18])

  const count = slides.length
  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, count, index])

  // Preload hero cutouts so slide swaps never flash.
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.heroImage ?? s.images[0]
    })
  }, [slides])

  if (count === 0) return null

  const active = slides[index]
  const activeBrand = brands.find((b) => b.id === active.brandId)
  const brandName = activeBrand?.name ?? ''
  const heroSrc = active.heroImage ?? active.images[0]
  const specChips = Object.entries(active.specs).slice(0, 2)

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const onFind = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    navigate(`/shop/${type}${params.toString() ? `?${params}` : ''}`)
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  }
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  // Slide-to-slide motion for the scooter + its reflection.
  const slideIn = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }
    : {
        initial: { opacity: 0, scale: 1.08, filter: 'blur(16px)', x: 50 },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 },
        exit: { opacity: 0, scale: 0.92, filter: 'blur(16px)', x: -36 },
        transition: { duration: 0.75, ease: EASE },
      }

  // Continuous up/down levitation for the floating spec + price cards.
  const float = (i: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 3.6 + i * 0.8, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.5 },
        }

  return (
    <section className="relative w-full overflow-hidden pt-32">
      <div
        className="relative flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: '#08080B', minHeight: 'calc(100svh - 8rem)' }}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
        {/* ── ambient dot grid (parallax + slow drift) ── */}
        <motion.div
          aria-hidden
          className="hero-grid-pan pointer-events-none absolute inset-[-50px]"
          style={{
            x: gridX,
            y: gridY,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            animation: reduce ? undefined : 'hero-grid-pan 14s linear infinite',
          }}
        />

        {/* ── vignette so copy stays legible ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 80% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }}
        />

        {/* ── huge faded brand wordmark, swaps per slide ── */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`word-${index}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="pointer-events-none absolute right-6 top-6 z-[2] hidden select-none font-display text-[120px] font-extrabold uppercase leading-none tracking-tighter text-white/[0.035] lg:block"
          >
            {brandName}
          </motion.span>
        </AnimatePresence>

        {/* ── content grid ── */}
        <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-4 lg:px-10">
          {/* left — copy + glassy finder + stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-20 lg:col-span-6 lg:pr-6"
          >
            <motion.p variants={rise} className="text-xs font-bold uppercase tracking-[0.28em] text-carrot">
              Find the ride of your dreams
            </motion.p>

            <TypewriterHeadline />

            {/* glassy finder bar */}
            <motion.form
              variants={rise}
              onSubmit={onFind}
              className="mt-7 flex max-w-lg flex-wrap items-stretch gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-2 backdrop-blur-md"
            >
              <GlassSelect label="Category" value={type} onChange={setType}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="text-coal">
                    {t.label}
                  </option>
                ))}
              </GlassSelect>
              <GlassSelect label="Brand" value={brand} onChange={setBrand}>
                <option value="" className="text-coal">All brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug} className="text-coal">
                    {b.name}
                  </option>
                ))}
              </GlassSelect>
              <motion.button
                type="submit"
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-carrot px-6 py-3 text-sm font-bold text-white shadow-glow transition-colors hover:bg-carrot-deep sm:w-auto sm:flex-none"
              >
                <Search size={17} /> Search
              </motion.button>
            </motion.form>

            {/* slim stat row */}
            <motion.div variants={rise} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden h-7 w-px bg-white/15 sm:block" />}
                  <div>
                    <div className="font-display text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* right — spotlit scooter on a turntable */}
          <div className="relative z-10 lg:col-span-6">
            <motion.div
              className="relative mx-auto flex h-[330px] items-center justify-center sm:h-[410px] lg:h-[510px]"
              style={{ rotateX: rotX, rotateY: rotY, x: scootX, transformPerspective: 1100 }}
            >
              {/* breathing spotlight — centred behind the scooter. x/y do the
                  centring via framer so the scale animation can't wipe it out. */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2"
                style={{
                  x: '-50%',
                  y: '-50%',
                  width: 'min(720px, 116%)',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(249,93,14,0.45) 0%, rgba(249,93,14,0) 62%)',
                }}
                animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.62, 0.9, 0.62] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* BBQ-style smoke off the scooter — its own pattern per slide */}
              <SmokeLayer key={`steam-${index}`} reduce={!!reduce} seed={index} />

              {/* scooter + ground reflection */}
              <AnimatePresence mode="wait">
                <motion.div key={`art-${index}`} {...slideIn} className="relative z-10 flex h-full w-full flex-col items-center justify-center">
                  <Link to={`/product/${active.slug}`} className="relative block">
                    <img
                      src={heroSrc}
                      alt={active.name}
                      className="h-auto max-h-[300px] w-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)] sm:max-h-[370px] lg:max-h-[470px]"
                    />
                  </Link>
                  <img
                    src={heroSrc}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute top-[88%] h-auto max-h-[230px] w-auto -scale-y-100 object-contain opacity-20 blur-[1px] sm:max-h-[300px] lg:max-h-[400px]"
                    style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 55%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 55%)' }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* floating spec chips (real specs) — levitating */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chips-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute inset-0 hidden lg:block"
                >
                  {specChips.map(([k, v], i) => (
                    <motion.div
                      key={k}
                      {...float(i)}
                      className="absolute rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-md"
                      style={i === 0 ? { left: '2%', top: '16%' } : { right: '2%', bottom: '20%' }}
                    >
                      <div className="font-display text-sm font-extrabold text-white">{v}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-carrot">{k}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ── price badge — levitating ── */}
        <motion.div className="absolute bottom-20 right-6 z-30 sm:bottom-16" {...float(2)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`price-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 px-5 py-3 text-right backdrop-blur-md"
              style={{ backgroundColor: 'rgba(14,14,18,0.82)' }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/55">{brandName}</div>
              <div className="font-display text-2xl font-extrabold text-white">{formatPrice(effectivePrice(active))}</div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── nav cluster: prev · progress dots · next ── */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
          <NavArrow dir="prev" onClick={() => go(index - 1)} />
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative h-1.5 overflow-hidden rounded-pill transition-all duration-300"
                style={{ width: i === index ? 34 : 10, background: 'rgba(255,255,255,0.28)' }}
              >
                {i === index && (
                  <span
                    key={`fill-${index}`}
                    className="hero-progress-fill absolute inset-0 origin-left rounded-pill bg-carrot"
                    style={{
                      animation: reduce ? 'none' : `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                      animationPlayState: paused ? 'paused' : 'running',
                      transform: reduce ? 'scaleX(1)' : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <NavArrow dir="next" onClick={() => go(index + 1)} />
        </div>
      </div>
    </section>
  )
}

/* ── helpers ─────────────────────────────────────────────── */

/* BBQ-grill smoke — soft tongues that lift off the engine line, roll and
   billow outward as they rise, then thin out. Two behaviours mix so it looks
   organic: 'billow' puffs swell and spread (the rolling grill smoke), 'crawl'
   ones rise slower and stay wispier. Emission runs along the bottom from the
   front tyre, across the engine, to the rear tyre. Each slide is given its own
   `seed` so every scooter smokes differently, and the layer is keyed on the
   slide so nothing lingers across a change. Off under reduced motion. */
const SMOKE_BASE = [
  { left: 36, bottom: 4, h: 115, w: 30 }, // front tyre — low & wide
  { left: 41, bottom: 9, h: 120, w: 28 },
  { left: 46, bottom: 6, h: 125, w: 34 }, // engine
  { left: 50, bottom: 11, h: 120, w: 32 }, // engine
  { left: 54, bottom: 7, h: 122, w: 33 }, // engine
  { left: 59, bottom: 10, h: 118, w: 30 },
  { left: 64, bottom: 4, h: 115, w: 30 }, // rear tyre — low & wide
  { left: 48, bottom: 16, h: 118, w: 28 }, // engine, higher
  { left: 56, bottom: 15, h: 115, w: 27 }, // engine, higher
] as const

// Smoke waits this long after a slide change before it starts, so it appears
// with the incoming scooter instead of during the crossfade gap.
const SMOKE_ENTER_DELAY = 1.0

function SmokeLayer({ reduce, seed }: { reduce: boolean; seed: number }) {
  if (reduce) return null
  // Deterministic per-wisp jitter keyed on the slide seed → each scooter
  // gets its own emission pattern, but every frame is reproducible.
  const rnd = (i: number, salt: number) => {
    const x = Math.sin((i + 1) * 12.9898 + seed * 78.233 + salt * 3.137) * 43758.5453
    return x - Math.floor(x)
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 11 }}>
      {SMOKE_BASE.map((b, i) => {
        const left = b.left + (rnd(i, 1) - 0.5) * 9
        const bottom = b.bottom + (rnd(i, 2) - 0.5) * 5
        const h = b.h * (0.85 + rnd(i, 3) * 0.4)
        const w = b.w * (0.9 + rnd(i, 4) * 0.35)
        // How high it climbs scales with how low it started: a wisp off the
        // tyre travels much further than one already up on the engine.
        const travel = 120 + (20 - bottom) * 8.5
        const dur = 6 + rnd(i, 5) * 3.2
        const delay = SMOKE_ENTER_DELAY + rnd(i, 6) * 1.6
        const dir = rnd(i, 7) > 0.5 ? 1 : -1
        const sway = (12 + rnd(i, 8) * 16) * dir
        const billow = rnd(i, 9) > 0.4 // ~60% rolling billows, varies per scooter
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              bottom: `${bottom}%`,
              width: w,
              height: h,
              marginLeft: -w / 2,
              borderRadius: '999px',
              transformOrigin: 'bottom center',
              filter: `blur(${billow ? 11 : 8}px)`,
              willChange: 'transform, opacity',
              background:
                'radial-gradient(ellipse 60% 58% at 50% 58%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0) 76%)',
            }}
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scaleX: 0.65, scaleY: 0.65 }}
            animate={
              billow
                ? {
                    // rolling grill smoke — swells and spreads wide as it lifts
                    opacity: [0, 0.8, 0.82, 0],
                    x: [0, sway * 0.5, -sway * 0.4, sway * 1.1],
                    y: [0, -travel * 0.4, -travel * 0.72, -travel],
                    rotate: [0, dir * 8, -dir * 7, dir * 12],
                    scaleX: [0.7, 1.25, 1.7, 2.1],
                    scaleY: [0.65, 1.1, 1.3, 1.5],
                  }
                : {
                    // slower wispy tongue — rises and weaves, thins out
                    opacity: [0, 0.7, 0.76, 0.52, 0],
                    x: [0, sway * 0.5, -sway * 0.5, sway * 0.8, sway * 0.4],
                    y: [0, -travel * 0.3, -travel * 0.58, -travel * 0.82, -travel],
                    rotate: [0, dir * 7, -dir * 9, dir * 6, -dir * 4],
                    scaleX: [0.6, 0.95, 1.2, 1.4, 1.6],
                    scaleY: [0.7, 1.05, 1.25, 1.4, 1.55],
                  }
            }
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: billow ? 'easeOut' : 'linear',
            }}
          />
        )
      })}
    </div>
  )
}

function GlassSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="relative min-w-0 flex-1 basis-[140px]">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full min-w-0 appearance-none truncate rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 pr-9 text-sm font-semibold text-white outline-none transition-colors focus:border-carrot"
      >
        {children}
      </select>
      <ChevronRight size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white/45" />
    </label>
  )
}

function NavArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-carrot hover:bg-carrot hover:text-white"
    >
      {dir === 'prev' ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
    </button>
  )
}
