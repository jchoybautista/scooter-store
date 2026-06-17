import React, { useEffect, useRef, useState } from "react";
import sprintWhite from "../../assets/products_previews/Vespa Sprint S 150 – White Innocente 2.png";
import redVespaBg from "../../assets/redvespa-bg.jpg";
import redVespa from "../../assets/red-vespa.png";
import gtv2 from "../../assets/gtv2.png";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import {
  Users,
  Heart,
  Bike,
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
  Wrench,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { getProducts, getBrands, getCategories } from "../../data/store";
import { useAsync } from "../../lib/useAsync";
import type { Brand, Product } from "../../types";
import HeroSlider from "../components/HeroSlider";
import FleetCarousel from "../components/FleetCarousel";

const BRAND_LOGOS: Record<string, string> = {
  vespa: '/images/brands/vespa.svg',
  lambretta: '/images/brands/lambretta.svg',
  italjet: '/images/brands/italjet.svg',
  honda: '/images/brands/honda.svg',
  shoei: '/images/brands/shoei.svg',
  arai: '/images/brands/arai.svg',
  hjc: '/images/brands/hjc.svg',
  bell: '/images/brands/bell.svg',
  pirelli: '/images/brands/pirelli.svg',
  michelin: '/images/brands/michelin.svg',
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const stats: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  value: string;
  label: string;
}[] = [
  { icon: Users, value: "4,500+", label: "Riders Served" },
  { icon: Heart, value: "2,750+", label: "Happy Customers" },
  { icon: Bike, value: "600+", label: "Scooters In Stock" },
  { icon: Award, value: "12+", label: "Years Experience" },
];

const whyUs = [
  {
    icon: Wallet,
    title: "Deals For Every Budget",
    desc: "Transparent pricing and flexible financing on every model.",
  },
  {
    icon: Headphones,
    title: "24/7 Road Assistance",
    desc: "Help is one call away, wherever the ride takes you.",
  },
  {
    icon: Truck,
    title: "Free Pick-Up & Drop-Off",
    desc: "Doorstep delivery and collection across the city.",
  },
];

const steps = [
  {
    n: "01",
    icon: Bike,
    title: "Choose a scooter",
    desc: "Browse the showroom and compare the models you love.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "Pick your extras",
    desc: "Add parts, accessories and the right warranty plan.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Confirm your order",
    desc: "Secure checkout with doorstep delivery options.",
  },
  {
    n: "04",
    icon: Flag,
    title: "Enjoy the ride",
    desc: "We deliver, you ride away in Italian style.",
  },
];

const testimonials = [
  {
    name: "Devid Cullen",
    role: "Customer",
    tag: "Vespa GTS owner",
    text: "Buying my Vespa GTS here was a fantastic experience from start to finish. The team was knowledgeable, the showroom was immaculate, and the branch pickup was seamlessly organized.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=600&fit=crop&auto=format",
  },
  {
    name: "Piter Has",
    role: "Customer",
    tag: "First-time buyer",
    text: "Outstanding service and a brilliant selection. I walked in not knowing which scooter to get, and walked out with exactly the right one. The staff genuinely know their machines.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=480&h=600&fit=crop&auto=format",
  },
  {
    name: "Kevin Martin",
    role: "Customer",
    tag: "BGC branch pickup",
    text: "The whole process — from choosing the model to picking up at the BGC branch — was smooth and professional. No pressure, just honest advice. I would highly recommend Velocità.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&h=600&fit=crop&auto=format",
  },
  {
    name: "Marco Reyes",
    role: "Customer",
    tag: "Lambretta V200 owner",
    text: "Picked up my Lambretta V200 last month and it has been an absolute joy. The accessories selection is impressive too — grabbed a helmet and exhaust kit at the same time. Five stars.",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&h=600&fit=crop&auto=format",
  },
  {
    name: "Sarah Lim",
    role: "Customer",
    tag: "Makati branch pickup",
    text: "I appreciated how transparent everything was — pricing, specs, delivery timelines. No hidden surprises. The Makati branch team made the document process quick and straightforward.",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&h=600&fit=crop&auto=format",
  },
];

const posts = [
  {
    day: "14",
    mon: "JUN",
    title: "Your Perfect Weekend Getaway On Two Wheels",
    author: "Mike Harrison",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&q=80&fit=crop",
  },
  {
    day: "18",
    mon: "MAY",
    title: "The Ultimate Checklist Before You Buy A Scooter",
    author: "Sofia Conte",
    image:
      "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&h=800&q=80&fit=crop",
  },
  {
    day: "26",
    mon: "APR",
    title: "Tips For Choosing The Right Scooter For The City",
    author: "Kevin Martin",
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=800&q=80&fit=crop",
  },
];

export default function Home() {
  const { data, loading } = useAsync(
    () => Promise.all([getProducts(), getBrands(), getCategories()]),
    [],
  );

  if (loading || !data) return <HomeSkeleton />;
  const [products, brands] = data as unknown as [Product[], Brand[]];

  const heroOrder = [
    "vespa-gts-300-super",
    "lambretta-v200-special",
    "italjet-dragster-200",
    "honda-giorno-plus",
  ];
  const heroSlides = heroOrder
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p && p.heroImage));

  const scooters = products.filter(
    (p) =>
      p.type === "scooter" &&
      p.images.some((img) => img.startsWith("/images/products/")),
  );

  return (
    <div className="overflow-hidden">
      <HeroSlider slides={heroSlides} brands={brands} />

      {/* brand logo marquee */}
      <div className="relative overflow-hidden border-y border-paper-line py-6">
        <div className="animate-marquee flex w-max items-center gap-x-14">
          {[...brands, ...brands].map((b, i) => {
            const logoSrc = BRAND_LOGOS[b.slug]
            return (
              <Link
                key={`${b.id}-${i}`}
                to={`/shop?brand=${b.slug}`}
                className="group flex shrink-0 items-center"
                aria-label={b.name}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={b.name}
                    draggable={false}
                    className="h-28 w-auto max-w-[200px] object-contain grayscale opacity-40 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                ) : (
                  <span className="whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-widest text-coal-dim/50 transition-colors group-hover:text-carrot">
                    {b.name}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* stats — dark instrument-panel readout */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 lg:px-8">
        <Reveal>
          <SectionHead
            center
            eyebrow="Why ride with us"
            title="A wide range of premium scooters"
          />
        </Reveal>
        <div className="relative mt-10 overflow-hidden rounded-[32px] bg-night px-4 py-12 shadow-lift">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(249,93,14,0.28), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(249,93,14,0.15), transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="relative grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0">
            {stats.map((s, i) => (
              <StatReadout
                key={s.label}
                stat={s}
                delay={i * 0.08}
                divided={i > 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section className="mx-auto max-w-7xl px-5 pb-40 pt-10 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* left: image composite */}
          <motion.div
            initial={{ opacity: 0, x: -56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative pr-16 sm:pr-20 lg:pr-[88px]"
          >
            {/* background card */}
            <div
              className="relative overflow-hidden rounded-[28px]"
              style={{ height: "clamp(320px, 50vw, 520px)" }}
            >
              <img
                src={redVespaBg}
                alt="Red Vespa background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-night/20" />

              {/* play button */}
              <button
                className="absolute right-0 flex items-center justify-center bg-paper shadow-lift transition-transform hover:scale-105"
                style={{
                  width: "clamp(70px, 10vw, 96px)",
                  height: "clamp(70px, 10vw, 96px)",
                  borderRadius: "16px 0 0 16px",
                  top: "13%",
                }}
                aria-label="Play video"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-coal">
                  <div
                    className="ml-1"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: "14px solid #16161A",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* SINCE + 2016 */}
            <div
              className="absolute right-0 top-4 flex flex-col items-center"
              style={{ width: "clamp(56px, 8vw, 88px)" }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-coal sm:text-[10px]"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Since
              </span>
              <span
                className="font-display font-extrabold leading-none text-carrot"
                style={{
                  fontSize: "clamp(48px, 7vw, 78px)",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                2016
              </span>
            </div>

            {/* red vespa — breaks below the card */}
            <motion.img
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
              src={redVespa}
              alt="Red Vespa scooter"
              className="absolute -bottom-24 right-0 object-contain drop-shadow-2xl sm:-bottom-32"
              style={{ width: "calc(100% - 155px)" }}
            />
          </motion.div>

          {/* right: copy */}
          <motion.div
            initial={{ opacity: 0, x: 56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="lg:pl-6"
          >
            <p className="eyebrow">— About Us —</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-coal sm:text-4xl">
              We Have Provided Assistance To Riders And Enthusiasts In This
              Field
            </h2>
            <p className="mt-5 leading-relaxed text-coal-muted">
              Since 2016, Velocità has matched riders across the city with the
              perfect scooter — genuine Italian machines, expert guidance, and
              after-sale support that doesn't disappear the moment you sign.
              Whether you're a first-time commuter or a seasoned collector,
              we've got you covered.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                "All Scooter Types Available",
                "You Get 24/7 Roadside Assistance",
                "Certified & Warranty-Ready Machines",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: EASE }}
                  className="flex items-center gap-4"
                >
                  <CheckCircle
                    size={24}
                    className="shrink-0 text-carrot"
                    fill="#F95D0E"
                    color="white"
                  />
                  <span className="font-bold text-coal">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            >
              <Link
                to="/shop"
                className="mt-8 inline-block rounded-sm bg-night px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#0E0E12" }}
              >
                Read More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Adventure Begin — full-width dark band ── */}
      <section
        className="relative w-full overflow-hidden py-24"
        style={{ backgroundColor: "#0E0E12" }}
      >
        {/* scooter image — right side, dark atmospheric */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-2/5">
          <img
            src="/images/hero/italjet.png"
            alt=""
            className="h-full w-full object-contain object-right opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0E0E12 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: EASE }}
            className="text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-carrot">
              — One Step Towards You —
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Let Your Adventure Begin
            </h2>
          </motion.div>

          {/* 3 items */}
          <div className="mt-14 grid grid-cols-3 gap-10">
            {whyUs.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: EASE }}
                className="flex flex-col items-center gap-5 text-center"
              >
                <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-2xl bg-carrot text-white">
                  <w.icon size={46} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-white">
                    {w.title}
                  </h4>
                  <p className="mt-2 text-base leading-relaxed text-white/50">
                    {w.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="bg-white pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <Reveal>
              <SectionHead
                eyebrow="Why choose us"
                title="The smarter way to own a scooter"
              />
              <p className="mt-4 max-w-md text-coal-muted">
                From your first test ride to years down the road, we make
                ownership effortless — honest pricing, genuine parts, and service
                that shows up.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-col gap-4">
              {whyUs.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, x: -36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="relative flex items-center gap-5 rounded-2xl bg-[#EBEBEB] p-5"
                >
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-white">
                    <w.icon
                      size={32}
                      strokeWidth={1.5}
                      className="text-carrot"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-coal">
                      {w.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-coal-muted">
                      {w.desc}
                    </p>
                  </div>
                  {i === 1 && (
                    <span className="absolute right-0 top-1/2 h-12 w-[4px] -translate-y-1/2 rounded-l-sm bg-carrot" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* image composite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative overflow-visible"
            style={{ minHeight: "clamp(520px, 56vw, 700px)" }}
          >
            {/* orange rounded rect */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="absolute right-0 rounded-[36px] bg-carrot"
              style={{ width: "62%", height: "58%", top: "-50px" }}
            />

            {/* scooter photo */}
            <img
              src={gtv2}
              alt="Vespa GTV scooter"
              className="absolute bottom-20 left-0 z-10"
              style={{
                width: "100%",
                maxWidth: "520px",
                borderRadius: "0 40px 40px 0",
              }}
            />

            {/* "Need any help?" card */}
            <div className="absolute bottom-0 left-0 z-20 rounded-2xl bg-white px-6 py-5">
              <p
                className="font-semibold text-carrot"
                style={{ fontSize: "19px" }}
              >
                Need any help ?
              </p>
              <div className="mt-2 flex items-center gap-4">
                <a
                  href="tel:+12021022124"
                  className="font-display font-extrabold text-coal"
                  style={{ fontSize: "2.25rem" }}
                >
                  +1 202 102 2124
                </a>
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 border-coal">
                  <Clock size={16} strokeWidth={1.5} className="text-coal" />
                  <span className="text-[9px] font-bold leading-none text-coal">
                    24
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* working steps */}
      <section className="py-20" style={{ backgroundColor: "#0E0E12" }}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHead
              center
              dark
              eyebrow="How it works"
              title="Riding away in four steps"
            />
          </Reveal>
          <div className="relative mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* connecting timeline path (desktop only) */}
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[23px] hidden h-px lg:block"
              style={{
                background:
                  "linear-gradient(90deg, #F95D0E 0%, #F95D0E 72%, rgba(58,42,32,0.6) 100%)",
                opacity: 0.5,
              }}
            />
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* number badge sitting on the path */}
                <div
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-carrot ring-[6px] ring-[#0E0E12] transition-transform duration-300 group-hover:scale-110"
                  style={{ boxShadow: "0 8px 22px rgba(249,93,14,0.4)" }}
                >
                  <span className="font-display text-lg font-extrabold leading-none text-white">
                    {s.n}
                  </span>
                </div>

                {/* card */}
                <div className="mt-6 w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#1A1D23] to-[#141519] px-6 py-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-carrot/40">
                  <s.icon
                    size={24}
                    strokeWidth={1.75}
                    className="mx-auto text-white/90 transition-colors duration-300 group-hover:text-carrot"
                  />
                  <h4 className="mt-4 font-display text-base font-bold text-white">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-coal-dim">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore Our Premium Brands ── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-visible rounded-[40px] bg-carrot px-10 py-10 lg:py-14"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-[-60px] top-[-70px] flex items-center justify-center">
            <img
              src={sprintWhite}
              alt="Vespa Sprint S 150"
              className="h-[400px] w-auto object-contain drop-shadow-2xl"
            />
          </div>
          <div className="relative flex items-center justify-between gap-6">
            <div className="max-w-xs">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                — Scooter Brands —
              </p>
              <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                Explore Our
                <br />
                Premium Brands
              </h3>
            </div>
            <div className="hidden h-20 w-px bg-white/30 lg:block" />
            <div className="flex-1" />
            <div className="hidden h-20 w-px bg-white/30 lg:block" />
            <Link
              to="/shop/scooters"
              className="shrink-0 rounded-sm bg-night px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105"
              style={{ backgroundColor: "#0E0E12" }}
            >
              View All Brands
            </Link>
          </div>
        </motion.div>
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
          <Reveal className="mb-10">
            <SectionHead
              eyebrow="From the blog"
              title="Scooter & city riding news"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 52 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                className="group relative cursor-pointer overflow-hidden"
                style={{ borderRadius: "80px 80px 20px 20px" }}
              >
                <div className="aspect-[3/4]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6">
                  <div
                    className="shrink-0 rounded-xl bg-white px-3 py-2 text-center"
                    style={{ borderLeft: "3px solid #F95D0E" }}
                  >
                    <span className="block font-display text-2xl font-extrabold leading-none text-carrot">
                      {p.day}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-coal-muted">
                      {p.mon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-carrot">
                      By {p.author}
                    </p>
                    <h4 className="mt-1 font-display text-base font-bold leading-snug text-white">
                      {p.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Reveal ────────────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── StatCard ─────────────────────────────────────────────── */

function CountUp({
  value,
  className = "font-display text-4xl font-extrabold text-carrot",
}: {
  value: string;
  className?: string;
}) {
  const suffix = value.endsWith("+") ? "+" : "";
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v >= 1000
      ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1).replace(".0", "") + "k"
      : Math.round(v).toString(),
  );

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(count, num, { duration: 1.6, ease: "easeOut" });
    return ctrl.stop;
  }, [inView, num, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="text-carrot">{suffix}</span>}
    </span>
  );
}

type StatItem = {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  value: string;
  label: string;
};

function StatReadout({
  stat,
  delay,
  divided,
}: {
  stat: StatItem;
  delay: number;
  divided: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={`group flex flex-col items-center px-4 text-center lg:px-8 ${divided ? "lg:border-l lg:border-white/10" : ""}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <stat.icon size={16} strokeWidth={2} className="text-carrot" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
          {stat.label}
        </span>
      </div>
      <CountUp
        value={stat.value}
        className="font-display text-5xl font-extrabold leading-none text-white lg:text-6xl"
      />
      <span className="mt-4 h-1 w-8 rounded-full bg-carrot transition-all duration-300 group-hover:w-14" />
    </motion.div>
  );
}

/* ── helpers ──────────────────────────────────────────────── */

function SectionHead({
  eyebrow,
  title,
  center = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-2 font-display text-3xl font-extrabold sm:text-4xl ${dark ? "text-white" : "text-coal"}`}
      >
        {title}
      </h2>
    </div>
  );
}

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;
  const t = testimonials[active];
  const go = (dir: number) =>
    setActive((a) => (a + dir + total) % total);

  return (
    <section className="w-full py-24" style={{ backgroundColor: "#0E0E12" }}>
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow">— What our riders say —</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            What Our Customers Say
          </h2>
        </Reveal>

        <div className="relative min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid items-center gap-10 lg:grid-cols-[320px_1fr] lg:gap-16"
            >
              {/* portrait */}
              <div
                className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px]"
                style={{ aspectRatio: "4 / 5" }}
              >
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* content */}
              <div>
                <Quote
                  size={48}
                  className="fill-carrot text-carrot"
                  strokeWidth={0}
                />
                <p className="mt-5 font-display text-xl font-semibold leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
                  {t.text}
                </p>
                <div className="mt-7 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="fill-carrot text-carrot" />
                  ))}
                </div>
                <p className="mt-6 font-display text-lg font-bold text-white">
                  {t.name}
                </p>
                <p className="mt-1 text-sm font-medium text-carrot">{t.tag}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* avatar rail + arrows */}
        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-carrot hover:bg-carrot hover:text-white"
          >
            <ChevronLeft size={17} />
          </button>
          <div className="flex items-center gap-3">
            {testimonials.map((tt, i) => (
              <button
                key={tt.name}
                onClick={() => setActive(i)}
                aria-label={`Show review from ${tt.name}`}
                className={`overflow-hidden rounded-full transition-all duration-300 ${
                  i === active
                    ? "ring-2 ring-carrot ring-offset-2 ring-offset-[#0E0E12]"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <img
                  src={tt.photo}
                  alt={tt.name}
                  className="h-12 w-12 object-cover"
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-carrot hover:bg-carrot hover:text-white"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex min-h-[92vh] items-center justify-center pt-24">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-paper-line border-t-carrot" />
    </div>
  );
}
