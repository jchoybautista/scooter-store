import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronDown } from 'lucide-react'
import { getProductBySlug, getProducts, getBrands } from '../../data/store'
import { useAsync } from '../../lib/useAsync'
import { formatPrice, effectivePrice } from '../../lib/format'
import type { Brand, Product } from '../../types'
import ScooterArt from '../../components/ScooterArt'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedEngine, setSelectedEngine] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    setActiveImg(0)
    setSelectedColor(0)
    setSelectedEngine(0)
    setOpenFaq(0)
  }, [slug])

  const { data, loading } = useAsync<[Product | null, Product[], Brand[]]>(
    () => {
      if (!slug) return Promise.resolve([null, [], []] as [Product | null, Product[], Brand[]])
      return Promise.all([getProductBySlug(slug), getProducts(), getBrands()])
    },
    [slug],
  )

  if (loading || !data) return <DetailSkeleton />
  const [product, all, brands] = data

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center">
        <h1 className="font-display text-3xl font-extrabold text-coal">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block font-semibold text-carrot">← Back to shop</Link>
      </div>
    )
  }

  const brand = brands.find((b) => b.id === product.brandId)
  const accent = brand?.accent ?? '#F95D0E'
  const onSale = product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.price

  const galleryImages = Array.from(new Set([
    ...product.images,
    ...(product.heroImage ? [product.heroImage] : []),
  ]))

  const related = all
    .filter((p) => p.id !== product.id && p.brandId === product.brandId)
    .slice(0, 3)

  const recommended = product.type === 'scooter'
    ? all
        .filter((p) => (p.type === 'accessory' || p.type === 'part') && p.images.length > 0)
        .slice(0, 4)
    : []

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-coal-muted transition-colors hover:text-carrot"
      >
        <ArrowLeft size={16} /> Back to shop
      </Link>

      {/* TOP: 60/40 grid */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[3fr_2fr]">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl2 border border-paper-line bg-paper p-3 shadow-soft"
        >
          <div className="overflow-hidden rounded-2xl bg-paper-soft">
            <div className="flex aspect-square items-center justify-center p-4">
              {galleryImages.length > 0 ? (
                <img
                  key={activeImg}
                  src={galleryImages[activeImg]}
                  alt={product.name}
                  className="h-full max-h-[440px] w-auto object-contain drop-shadow-xl"
                />
              ) : (
                <ScooterArt product={product} accent={accent} className="h-full w-full" />
              )}
            </div>
          </div>
          {galleryImages.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-paper-soft transition-all ${
                    activeImg === i ? 'border-carrot shadow-glow' : 'border-paper-line hover:border-coal-dim'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span
              className="rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wide"
              style={{ background: `${accent}1F`, color: accent }}
            >
              {brand?.name}{brand?.country ? ` · ${brand.country}` : ''}
            </span>
            {product.featured && (
              <span className="rounded-pill bg-night px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-coal sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-coal">
              {formatPrice(effectivePrice(product))}
            </span>
            {onSale && (
              <span className="text-lg text-coal-dim line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-coal-muted">{product.description}</p>

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coal-dim">
                Color: <span className="text-coal">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(i)}
                    className={`h-7 w-7 rounded-full transition-all ${
                      selectedColor === i
                        ? 'ring-2 ring-carrot ring-offset-2'
                        : 'hover:ring-2 hover:ring-coal-dim hover:ring-offset-1'
                    }`}
                    style={{ background: c.hex, border: c.hex === '#f5f0e8' ? '1px solid #e0ddd6' : undefined }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Engine selector */}
          {product.engineVariants && product.engineVariants.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coal-dim">Engine</p>
              <div className="flex flex-wrap gap-2">
                {product.engineVariants.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setSelectedEngine(i)}
                    className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      selectedEngine === i
                        ? 'border-carrot bg-carrot/5 text-carrot'
                        : 'border-paper-line bg-paper text-coal-muted hover:border-coal-dim'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1.5 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-carrot'}`}>
              <Check size={16} /> {product.stock > 0 ? 'In stock' : 'Sold out'}
            </span>
            {product.stock > 0 && product.stock <= 6 && (
              <span className="text-coal-dim">· only {product.stock} remaining</span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-carrot px-7 py-4 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
            >
              <ShoppingBag size={18} /> Add to cart
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-pill border border-paper-line bg-paper px-7 py-4 font-bold text-coal transition-colors hover:border-coal"
            >
              Keep browsing
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-paper-line pt-6">
            {[
              { icon: Truck, label: 'Free delivery' },
              { icon: ShieldCheck, label: 'Warranty ready' },
              { icon: RotateCcw, label: '14-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={20} className="text-carrot" />
                <span className="text-xs text-coal-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPECS + CONTACT: 60/40 grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Technical Specifications */}
        <div className="rounded-xl2 border border-paper-line bg-paper p-7 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">Technical Specifications</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-paper-line bg-paper-soft p-4">
                <div className="text-xs uppercase tracking-wider text-coal-dim">{k}</div>
                <div className="mt-1 font-display text-lg font-bold text-coal">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquire with Velocità */}
        <div className="rounded-xl2 border border-paper-line bg-paper p-7 shadow-soft">
          <h2 className="mb-1 font-display text-xl font-extrabold text-coal">Inquire with Velocità</h2>
          <p className="mb-5 text-xs uppercase tracking-widest text-coal-dim">Our team replies within 24 hours</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const name = (form.elements.namedItem('name') as HTMLInputElement).value
              const email = (form.elements.namedItem('email') as HTMLInputElement).value
              const subject = (form.elements.namedItem('subject') as HTMLInputElement).value
              const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
              window.location.href = `mailto:hello@velocita.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`
            }}
            className="flex flex-col gap-3"
          >
            <input
              name="name"
              required
              placeholder="Your name *"
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address *"
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <input
              name="subject"
              placeholder="Subject"
              defaultValue={product.name}
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Your message…"
              className="resize-none rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <button
              type="submit"
              className="rounded-pill bg-night px-6 py-3 font-bold text-white transition-colors hover:bg-coal"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>

      {/* Full description */}
      {product.longDescription && (
        <div className="mt-8 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">
            About This {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
          </h2>
          <div className="space-y-4">
            {product.longDescription.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed text-coal-muted">{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="mt-6 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">Features</h2>
          <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
            {product.features.map((f) => (
              <div key={f} className="flex items-center gap-3 border-b border-paper-line py-3 last:border-0">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-carrot/10 text-carrot">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-coal">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ accordion */}
      <div className="mt-6 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
        <h2 className="mb-5 font-display text-xl font-extrabold text-coal">General Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-paper-line"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-coal transition-colors hover:bg-paper-soft"
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-coal-dim transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-paper-line bg-paper-soft px-5 py-4">
                  <p className="text-sm leading-relaxed text-coal-muted">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complete Your Ride */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-extrabold text-coal">Complete Your Ride</h2>
            <Link
              to="/shop"
              className="text-sm font-semibold text-carrot transition-colors hover:text-carrot-deep"
            >
              See all accessories →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p) => {
              const b = brands.find((br) => br.id === p.brandId)
              return <ProductCard key={p.id} product={p} brand={b} />
            })}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-extrabold text-coal">
            More from {brand?.name}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} brand={brand} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

const FAQS = [
  {
    q: 'How do I choose the right scooter for my needs?',
    a: "Our team is happy to help. Consider your daily commute distance, city vs highway riding, and whether you carry a passenger. As a guide: 50cc suits short urban trips; 125–155cc handles mixed traffic; 278–330cc is ideal for longer commutes or touring. Use the contact form above and we'll advise you personally.",
  },
  {
    q: 'Is this product available for a test ride or in-store viewing?',
    a: 'Yes — we offer test rides at our showroom by appointment. Send us a message via the form above and our team will schedule a session at your convenience. Test rides are free with no obligation to purchase.',
  },
  {
    q: 'What warranty does this come with?',
    a: "Every new scooter from Velocità includes the manufacturer's standard warranty. We also offer extended Velocità Care plans (1, 2 and 3-year options) covering engine, transmission, electrical faults and roadside assistance. Browse warranty options in our shop.",
  },
  {
    q: 'Can I trade in my current scooter or motorcycle?',
    a: "Absolutely. We accept trade-ins on all brands and models, subject to condition assessment. Bring your current ride to our showroom or send us photos and details via the form — we'll provide a valuation within 48 hours.",
  },
  {
    q: 'Do you offer financing options?',
    a: 'Yes — flexible financing is available on all scooters over $2,000. We work with trusted lending partners to offer low-interest plans from 12 to 60 months. Ask us about current rates when you get in touch.',
  },
]

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="aspect-square animate-pulse rounded-xl2 bg-paper-soft" />
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-paper-soft" />
          <div className="h-8 w-32 animate-pulse rounded-2xl bg-paper-soft" />
          <div className="h-24 animate-pulse rounded-2xl bg-paper-soft" />
        </div>
      </div>
    </div>
  )
}
