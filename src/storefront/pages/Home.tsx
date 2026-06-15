import React, { useEffect, useRef, useState } from 'react'
import gtvFront from '../../assets/gtv_front.png'
import redVespaBg from '../../assets/redvespa-bg.jpg'
import redVespa from '../../assets/red-vespa.png'
import gtv2 from '../../assets/gtv2.png'
import { Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Users,
  Smile,
  Boxes,
  Award,
  Wallet,
  Headphones,
  Truck,
  Star,
  Quote,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getProducts, getBrands, getCategories } from '../../data/store'
import { useAsync } from '../../lib/useAsync'
import type { Brand, Product } from '../../types'
import HeroSlider from '../components/HeroSlider'
import FleetCarousel from '../components/FleetCarousel'


const stats: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; value: string; label: string }[] = [
  { icon: Users, value: '4,500+', label: 'Riders Served' },
  { icon: Smile, value: '2,750+', label: 'Happy Customers' },
  { icon: Boxes, value: '600+', label: 'Scooters In Stock' },
  { icon: Award, value: '12+', label: 'Years Experience' },
]

const whyUs = [
  { icon: Wallet, title: 'Deals For Every Budget', desc: 'Transparent pricing and flexible financing on every model.' },
  { icon: Headphones, title: '24/7 Road Assistance', desc: 'Help is one call away, wherever the ride takes you.' },
  { icon: Truck, title: 'Free Pick-Up & Drop-Off', desc: 'Doorstep delivery and collection across the city.' },
]

const steps = [
  { n: '01', title: 'Choose a scooter', desc: 'Browse the showroom and compare the models you love.' },
  { n: '02', title: 'Pick your extras', desc: 'Add parts, accessories and the right warranty plan.' },
  { n: '03', title: 'Confirm your order', desc: 'Secure checkout with doorstep delivery options.' },
  { n: '04', title: 'Enjoy the ride', desc: 'We deliver, you ride away in Italian style.' },
]

const testimonials = [
  {
    name: 'Devid Cullen',
    role: 'Customer',
    text: 'Buying my Vespa GTS here was a fantastic experience from start to finish. The team was knowledgeable, the showroom was immaculate, and the branch pickup was seamlessly organized.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
  },
  {
    name: 'Piter Has',
    role: 'Customer',
    text: 'Outstanding service and a brilliant selection. I walked in not knowing which scooter to get, and walked out with exactly the right one. The staff genuinely know their machines.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
  },
  {
    name: 'Kevin Martin',
    role: 'Customer',
    text: 'The whole process — from choosing the model to picking up at the BGC branch — was smooth and professional. No pressure, just honest advice. I would highly recommend Velocità.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format',
  },
  {
    name: 'Marco Reyes',
    role: 'Customer',
    text: 'Picked up my Lambretta V200 last month and it has been an absolute joy. The accessories selection is impressive too — grabbed a helmet and exhaust kit at the same time. Five stars.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&auto=format',
  },
  {
    name: 'Sarah Lim',
    role: 'Customer',
    text: 'I appreciated how transparent everything was — pricing, specs, delivery timelines. No hidden surprises. The Makati branch team made the document process quick and straightforward.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
  },
]

const posts = [
  {
    day: '14', mon: 'JUN',
    title: 'Your Perfect Weekend Getaway On Two Wheels',
    author: 'Mike Harrison',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&q=80&fit=crop',
  },
  {
    day: '18', mon: 'MAY',
    title: 'The Ultimate Checklist Before You Buy A Scooter',
    author: 'Sofia Conte',
    image: 'https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&h=800&q=80&fit=crop',
  },
  {
    day: '26', mon: 'APR',
    title: 'Tips For Choosing The Right Scooter For The City',
    author: 'Kevin Martin',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=800&q=80&fit=crop',
  },
]

export default function Home() {
  const { data, loading } = useAsync(
    () => Promise.all([getProducts(), getBrands(), getCategories()]),
    [],
  )

  if (loading || !data) return <HomeSkeleton />
  const [products, brands] = data as unknown as [Product[], Brand[]]

  // The 3 hero scooters, in a fixed order (Vespa → Italjet → Lambretta).
  const heroOrder = ['vespa-gts-300-super', 'italjet-dragster-200', 'lambretta-v200-special']
  const heroSlides = heroOrder
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p && p.heroImage))
  const scooters = products.filter(
    (p) => p.type === 'scooter' && p.images.some((img) => img.startsWith('/images/products/')),
  )

  return (
    <div className="overflow-hidden">
      <HeroSlider slides={heroSlides} brands={brands} />

      {/* stats */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <SectionHead center eyebrow="Why ride with us" title="A wide range of premium scooters" />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── Carntel-style orange brands banner ── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8">
        {/* the orange pill band */}
        <div className="relative overflow-visible rounded-[40px] bg-carrot px-10 py-10 lg:py-14">

          {/* Vespa GTS 300 — breaks out top AND bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[-60px] top-[-70px] flex items-center justify-center">
            <img
              src={gtvFront}
              alt="Vespa GTS 300"
              className="h-[500px] w-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div className="relative flex items-center justify-between gap-6">
            {/* left: label + heading */}
            <div className="max-w-xs">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                — Scooter Brands —
              </p>
              <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                Explore Our<br />Premium Brands
              </h3>
            </div>

            {/* centre divider — sits behind the scooter image */}
            <div className="hidden h-20 w-px bg-white/30 lg:block" />

            {/* invisible spacer so the button is pushed right */}
            <div className="flex-1" />

            {/* right divider */}
            <div className="hidden h-20 w-px bg-white/30 lg:block" />

            {/* right: CTA button */}
            <Link
              to="/shop/scooters"
              className="shrink-0 rounded-sm bg-night px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105"
              style={{ backgroundColor: '#0E0E12' }}
            >
              View All Brands
            </Link>
          </div>
        </div>

        {/* brand logo strip below the banner */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-5 lg:justify-between">
          {brands.map((b) => (
            <Link
              key={b.id}
              to={`/shop?brand=${b.slug}`}
              className="font-display text-xl font-extrabold uppercase tracking-widest text-coal-dim/50 transition-colors hover:text-carrot"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── About Us ── */}
      <section className="mx-auto max-w-7xl px-5 pb-40 pt-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* left: image composite — card + outside SINCE/2016 + play btn overhang */}
          <div className="relative pr-16 sm:pr-20 lg:pr-[88px]">

            {/* background card */}
            <div className="relative overflow-hidden rounded-[28px]" style={{ height: 'clamp(320px, 50vw, 520px)' }}>
              <img src={redVespaBg} alt="Red Vespa background" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-night/20" />

              {/* play button — inside card, flush against right edge, right radius = 0 */}
              <button
                className="absolute right-0 flex items-center justify-center bg-paper shadow-lift transition-transform hover:scale-105"
                style={{ width: 'clamp(70px, 10vw, 96px)', height: 'clamp(70px, 10vw, 96px)', borderRadius: '16px 0 0 16px', top: '13%' }}
                aria-label="Play video"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-coal">
                  <div
                    className="ml-1"
                    style={{
                      width: 0, height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderLeft: '14px solid #16161A',
                    }}
                  />
                </div>
              </button>
            </div>

            {/* SINCE + 2016 — outside the card, right column */}
            <div className="absolute right-0 top-4 flex flex-col items-center" style={{ width: 'clamp(56px, 8vw, 88px)' }}>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-coal sm:text-[10px]"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Since
              </span>
              <span
                className="font-display font-extrabold leading-none text-carrot"
                style={{ fontSize: 'clamp(48px, 7vw, 78px)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                2016
              </span>
            </div>

            {/* red vespa — breaks below the card */}
            <img
              src={redVespa}
              alt="Red Vespa scooter"
              className="absolute -bottom-24 right-0 object-contain drop-shadow-2xl sm:-bottom-32"
              style={{ width: 'calc(100% - 155px)' }}
            />
          </div>

          {/* right: copy */}
          <div className="lg:pl-6">
            <p className="eyebrow">— About Us —</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-coal sm:text-4xl">
              We Have Provided Assistance To Riders And Enthusiasts In This Field
            </h2>
            <p className="mt-5 leading-relaxed text-coal-muted">
              Since 2016, Velocità has matched riders across the city with the perfect scooter —
              genuine Italian machines, expert guidance, and after-sale support that doesn't
              disappear the moment you sign. Whether you're a first-time commuter or a seasoned
              collector, we've got you covered.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                'All Scooter Types Available',
                'You Get 24/7 Roadside Assistance',
                'Certified & Warranty-Ready Machines',
              ].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <CheckCircle size={24} className="shrink-0 text-carrot" fill="#F95D0E" color="white" />
                  <span className="font-bold text-coal">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/shop"
              className="mt-8 inline-block rounded-sm bg-night px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105"
              style={{ backgroundColor: '#0E0E12' }}
            >
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Adventure Begin — full-width dark band ── */}
      <section className="relative w-full overflow-hidden py-24" style={{ backgroundColor: '#0E0E12' }}>
        {/* scooter image — right side, dark atmospheric */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-2/5">
          <img
            src="/images/hero/italjet.png"
            alt=""
            className="h-full w-full object-contain object-right opacity-25"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0E0E12 0%, transparent 50%)' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* heading — centered */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-carrot">
              — One Step Towards You —
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Let Your Adventure Begin
            </h2>
          </div>

          {/* 3 items — full width, evenly spaced, centered */}
          <div className="mt-14 grid grid-cols-3 gap-10">
            {whyUs.map((w) => (
              <div key={w.title} className="flex flex-col items-center gap-5 text-center">
                <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-2xl bg-carrot text-white">
                  <w.icon size={46} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-white">{w.title}</h4>
                  <p className="mt-2 text-base leading-relaxed text-white/50">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="bg-white pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHead eyebrow="Why choose us" title="The smarter way to own a scooter" />
            <p className="mt-4 max-w-md text-coal-muted">
              From your first test ride to years down the road, we make ownership effortless —
              honest pricing, genuine parts, and service that shows up.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {whyUs.map((w, i) => (
                <div key={w.title} className="relative flex items-center gap-5 rounded-2xl bg-[#EBEBEB] p-5">
                  {/* white icon box */}
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-white">
                    <w.icon size={32} strokeWidth={1.5} className="text-carrot" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-coal">{w.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-coal-muted">{w.desc}</p>
                  </div>
                  {/* orange right-edge accent on middle card */}
                  {i === 1 && (
                    <span className="absolute right-0 top-1/2 h-12 w-[4px] -translate-y-1/2 rounded-l-sm bg-carrot" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* image composite — orange rect → scooter → help card */}
          <div className="relative overflow-visible" style={{ minHeight: 'clamp(520px, 56vw, 700px)' }}>
            {/* orange rounded rect — upper right, pokes above the container */}
            <div
              className="absolute right-0 rounded-[36px] bg-carrot"
              style={{ width: '62%', height: '58%', top: '-50px' }}
            />

            {/* scooter photo — front layer, no shadow */}
            <img
              src={gtv2}
              alt="Vespa GTV scooter"
              className="absolute bottom-20 left-0 z-10"
              style={{ width: '100%', maxWidth: '520px', borderRadius: '0 40px 40px 0' }}
            />

            {/* "Need any help?" card — no shadow */}
            <div className="absolute bottom-0 left-0 z-20 rounded-2xl bg-white px-6 py-5">
              <p className="font-semibold text-carrot" style={{ fontSize: '19px' }}>Need any help ?</p>
              <div className="mt-2 flex items-center gap-4">
                <a
                  href="tel:+12021022124"
                  className="font-display font-extrabold text-coal"
                  style={{ fontSize: '2.25rem' }}
                >
                  +1 202 102 2124
                </a>
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 border-coal">
                  <Clock size={16} strokeWidth={1.5} className="text-coal" />
                  <span className="text-[9px] font-bold leading-none text-coal">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* working steps */}
      <section className="py-20" style={{ backgroundColor: '#0E0E12' }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHead center dark eyebrow="How it works" title="Riding away in four steps" />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative pt-[82px]"
              >
                {/* number badge + speech-bubble tail */}
                <div className="absolute left-4 top-0 z-10">
                  <div className="rounded-[14px] bg-carrot px-5 py-4">
                    <span className="font-display text-3xl font-extrabold leading-none text-white">{s.n}</span>
                  </div>
                </div>

                {/* card */}
                <div className="rounded-2xl bg-[#EBEBEB] px-5 py-6">
                  <h4 className="font-display text-base font-bold text-coal">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-coal-muted">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* vehicle fleet */}
      <div className="bg-white">
        <FleetCarousel products={scooters} brands={brands} />
      </div>

      {/* testimonials */}
      <TestimonialsSection />

      {/* blog */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10">
            <SectionHead eyebrow="From the blog" title="Scooter & city riding news" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <div
                key={p.title}
                className="group relative cursor-pointer overflow-hidden"
                style={{ borderRadius: '80px 80px 20px 20px' }}
              >
                {/* photo */}
                <div className="aspect-[3/4]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* dark gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />

                {/* bottom content */}
                <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6">
                  {/* date badge */}
                  <div
                    className="shrink-0 rounded-xl bg-white px-3 py-2 text-center"
                    style={{ borderLeft: '3px solid #F95D0E' }}
                  >
                    <span className="block font-display text-2xl font-extrabold leading-none text-carrot">{p.day}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-coal-muted">{p.mon}</span>
                  </div>

                  {/* author + title */}
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-carrot">By {p.author}</p>
                    <h4 className="mt-1 font-display text-base font-bold leading-snug text-white">{p.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── StatCard ─────────────────────────────────────────────── */

function CountUp({ value }: { value: string }) {
  // parse "4,500+" → num=4500, suffix="+"
  const suffix = value.endsWith('+') ? '+' : ''
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) =>
    v >= 1000 ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1).replace('.0', '') + 'k' : Math.round(v).toString()
  )

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(count, num, { duration: 1.6, ease: 'easeOut' })
    return ctrl.stop
  }, [inView, num, count])

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-carrot">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}

type StatItem = { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; value: string; label: string }

function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="group relative overflow-hidden rounded-card bg-[#EBEBEB] p-8 text-center"
      style={{ cursor: 'default' }}
    >
      {/* top-left orange corner square — clipped by card border-radius */}
      <span className="absolute left-0 top-0 h-8 w-8 bg-carrot transition-transform duration-300 group-hover:scale-110" />
      {/* bottom-right thin vertical orange line */}
      <span className="absolute bottom-6 right-0 h-10 w-[3px] rounded-l-sm bg-carrot" />

      {/* icon */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center text-coal transition-transform duration-300 group-hover:scale-110">
        <stat.icon size={38} strokeWidth={1.2} />
      </div>

      {/* animated count */}
      <div className="mt-5">
        <CountUp value={stat.value} />
      </div>

      {/* label */}
      <div className="mt-2 text-sm font-bold text-coal">{stat.label}</div>
    </motion.div>
  )
}

/* ── helpers ──────────────────────────────────────────────── */

function SectionHead({
  eyebrow,
  title,
  center = false,
  dark = false,
}: {
  eyebrow: string
  title: string
  center?: boolean
  dark?: boolean
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`mt-2 font-display text-3xl font-extrabold sm:text-4xl ${dark ? 'text-white' : 'text-coal'}`}>
        {title}
      </h2>
    </div>
  )
}


function TestimonialsSection() {
  const [page, setPage] = useState(0)
  const perPage = 3
  const total = testimonials.length
  const canPrev = page > 0
  const canNext = (page + 1) * perPage < total
  const visible = testimonials.slice(page * perPage, page * perPage + perPage)

  return (
    <section className="w-full bg-[#F0F0F0] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-14 text-center">
          <p className="eyebrow">— Testimonial —</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-coal sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {visible.map((t) => (
            <div key={t.name} className="bg-white p-7" style={{ borderRadius: '80px 80px 20px 20px' }}>
              <div className="flex items-center gap-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-coal">{t.name}</p>
                  <p className="text-sm text-coal-muted">{t.role}</p>
                </div>
                <Quote size={44} className="ml-auto shrink-0 text-carrot/25" />
              </div>
              <p className="mt-5 min-h-[5.75rem] text-sm leading-relaxed text-coal-muted line-clamp-4">{t.text}</p>
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-carrot text-carrot" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center bg-carrot text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setPage((p) => (canNext ? p + 1 : p))}
            disabled={!canNext}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center bg-carrot text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

function HomeSkeleton() {
  return (
    <div className="flex min-h-[92vh] items-center justify-center pt-24">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-paper-line border-t-carrot" />
    </div>
  )
}
