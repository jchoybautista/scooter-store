import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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

/**
 * Carntel-style hero: a clipped dark banner panel (radial wash, orange dome,
 * faded brand wordmark, heading + finder card on the left) with the scooter
 * photo rendered as a SEPARATE, non-clipped layer so it can break out below
 * the panel's bottom edge — the signature Carntel "vehicle overhang" effect.
 * Photo / wordmark / price cycle per slide; heading + finder card stay put.
 */
export default function HeroSlider({ slides, brands }: Props) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [type, setType] = useState('scooters')
  const [brand, setBrand] = useState('')

  const count = slides.length
  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, count])

  if (count === 0) return null

  const active = slides[index]
  const activeBrand = brands.find((b) => b.id === active.brandId)
  const brandName = activeBrand?.name ?? ''

  const onFind = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    navigate(`/shop/${type}${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="bg-paper px-3 pb-20 pt-24 sm:px-5 lg:px-8 lg:pb-24">
      <div
        className="relative mx-auto max-w-7xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── clipped dark panel ── */}
        <div
          className="relative overflow-hidden rounded-[28px] bg-night lg:min-h-[480px]"
          style={{ backgroundColor: '#0E0E12' }}
        >
          {/* radial wash */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 100% at 12% 8%, #1c1c22 0%, #0e0e12 58%)' }}
          />

          {/* orange dome / circle on the right */}
          <div
            className="absolute -right-16 top-1/2 hidden aspect-square w-[52%] -translate-y-1/2 rounded-full lg:block"
            style={{ background: 'linear-gradient(180deg, #FF7A33 0%, #F95D0E 55%, #C8430B 100%)' }}
          />

          {/* big faded brand wordmark over the dome */}
          <AnimatePresence mode="wait">
            <motion.span
              key={`word-${index}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute right-8 top-8 z-[5] hidden select-none font-display text-[96px] font-extrabold uppercase leading-none tracking-tight text-night/30 lg:block"
            >
              {brandName}
            </motion.span>
          </AnimatePresence>

          {/* content grid */}
          <div className="relative grid grid-cols-1 items-center gap-6 px-6 pb-12 pt-12 sm:px-10 lg:grid-cols-12 lg:gap-4">
            {/* left: heading + finder card */}
            <div className="relative z-20 lg:col-span-6 lg:pr-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-carrot">
                Find the ride of your dreams
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-5xl">
                The Finest Italian <br />
                <span className="text-carrot">Scooters &amp; Parts</span>
              </h1>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Available now
              </p>

              {/* finder card */}
              <form
                onSubmit={onFind}
                className="mt-4 max-w-md rounded-2xl bg-paper p-4 shadow-lift"
              >
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coal-dim">
                      Category
                    </span>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-soft px-3 py-2.5 text-sm font-semibold text-coal outline-none focus:border-carrot"
                    >
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coal-dim">
                      Brand
                    </span>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-paper-line bg-paper-soft px-3 py-2.5 text-sm font-semibold text-coal outline-none focus:border-carrot"
                    >
                      <option value="">All brands</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.slug}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-night px-5 py-3 font-bold text-white transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: '#0E0E12' }}
                >
                  <Search size={17} /> Find your ride
                </button>
              </form>
            </div>

            <div className="hidden lg:col-span-6 lg:block" />
          </div>

          {/* price badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`price-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="absolute right-6 top-8 z-30 rounded-2xl bg-night/85 px-5 py-3 text-right shadow-lift backdrop-blur sm:right-10"
              style={{ backgroundColor: 'rgba(14,14,18,0.85)' }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                {brandName}
              </div>
              <div className="font-display text-2xl font-extrabold text-white">
                {formatPrice(effectivePrice(active))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* slider controls (inside the panel) */}
          <div className="absolute bottom-5 left-6 z-30 flex gap-2 sm:left-10">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-1.5 rounded-pill transition-all duration-300"
                style={{ width: i === index ? 32 : 12, background: i === index ? '#F95D0E' : 'rgba(255,255,255,0.35)' }}
              />
            ))}
          </div>
          <div className="absolute bottom-5 right-6 z-30 flex gap-2 sm:right-10">
            <button
              onClick={() => go(index - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(index + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── scooter cutout — SEPARATE non-clipped layer, breaks out the bottom ── */}
        <Link
          to={`/product/${active.slug}`}
          className="absolute inset-x-0 bottom-[-28px] z-20 flex justify-center lg:left-[36%] lg:right-4 lg:bottom-[-56px]"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`art-${index}`}
              src={active.heroImage ?? active.images[0]}
              alt={active.name}
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-auto w-[58%] max-w-[360px] object-contain drop-shadow-2xl sm:w-[46%] lg:w-[78%] lg:max-w-[460px]"
            />
          </AnimatePresence>
        </Link>
      </div>
    </section>
  )
}
