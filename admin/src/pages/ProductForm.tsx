import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, ChevronRight, Save, X, Upload } from 'lucide-react'
import {
  getFullProductById,
  upsertFullProduct,
  BRANDS,
  CATEGORY_MAP,
  type FullProduct,
} from '../data/fullProducts'
import SelectField from '../components/SelectField'

const SECTIONS = [
  { id: 'images', label: 'Images' },
  { id: 'basic', label: 'Basic Info' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'description', label: 'Description' },
  { id: 'specs', label: 'Specs' },
  { id: 'features', label: 'Features' },
  { id: 'colors', label: 'Colors' },
  { id: 'variants', label: 'Engine Variants' },
]

type ProductType = FullProduct['type']

interface SpecRow { key: string; value: string }
interface ColorRow { name: string; hex: string; images: string[] }

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-carrot/40 ${checked ? 'bg-carrot' : 'bg-[#D1D5DB]'}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 self-center ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
      />
    </button>
  )
}

function SectionCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-white rounded-2xl border border-paper-line shadow-sm p-5 scroll-mt-20">
      <h3 className="text-[14px] font-bold text-coal mb-4 pb-3 border-b border-paper-line">{title}</h3>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-paper-line bg-paper-soft px-3.5 py-2.5 text-[13px] text-coal outline-none focus:border-carrot transition-colors'
const labelClass = 'block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5'

async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string
        const base64 = dataUrl.split(',')[1]
        const res = await fetch('/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: base64 }),
        })
        if (!res.ok) throw new Error(res.statusText)
        const json = await res.json() as { path: string }
        resolve(json.path)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function ImageUploader({
  value,
  onChange,
  onRemove,
  compact = false,
}: {
  value: string
  onChange: (path: string) => void
  onRemove?: () => void
  compact?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [broken, setBroken] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    setBroken(false)
    try {
      const path = await uploadFile(file)
      onChange(path)
    } catch {
      // upload failed — user can retry
    } finally {
      setUploading(false)
    }
  }

  const hasImage = Boolean(value) && !broken
  const handleRemove = onRemove ?? (() => onChange(''))
  const height = compact ? 'h-20' : 'h-28'

  return (
    <div className={`relative ${height} rounded-xl overflow-hidden border border-paper-line`}>
      {hasImage ? (
        <>
          <img
            src={value}
            alt=""
            className="w-full h-full object-contain p-2 bg-paper-soft"
            onError={() => setBroken(true)}
          />
          <div className="absolute top-1 right-1 flex gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-coal hover:text-carrot shadow-sm transition-colors"
              title="Replace image"
            >
              <Upload size={10} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-coal hover:text-red-500 shadow-sm transition-colors"
              title="Remove image"
            >
              <X size={10} />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full h-full border-2 border-dashed border-paper-line bg-paper-soft hover:bg-carrot-wash hover:border-carrot/40 transition-colors flex flex-col items-center justify-center gap-1 text-coal-dim hover:text-carrot disabled:opacity-60"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-carrot border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={compact ? 14 : 18} />
              <span className={`font-semibold ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                {compact ? 'Upload' : 'Click to upload'}
              </span>
            </>
          )}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [brandId, setBrandId] = useState(BRANDS[0].id)
  const [type, setType] = useState<ProductType>('scooter')
  const [status, setStatus] = useState<'active' | 'draft'>('active')
  const [featured, setFeatured] = useState(false)
  const [stock, setStock] = useState(0)
  const [price, setPrice] = useState(0)
  const [onSale, setOnSale] = useState(false)
  const [salePrice, setSalePrice] = useState<number>(0)
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: '', value: '' }])
  const [features, setFeatures] = useState<string[]>([''])
  const [colors, setColors] = useState<ColorRow[]>([{ name: '', hex: '#000000', images: [] }])
  const [engineVariants, setEngineVariants] = useState<string[]>([''])
  const [images, setImages] = useState<string[]>([''])
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      const p = getFullProductById(id)
      if (p) {
        setName(p.name)
        setSlug(p.slug)
        setSlugManual(true)
        setBrandId(p.brandId)
        setType(p.type)
        setStatus(p.status)
        setFeatured(p.featured)
        setStock(p.stock)
        setPrice(p.price)
        setOnSale(p.salePrice !== null)
        setSalePrice(p.salePrice ?? 0)
        setDescription(p.description)
        setLongDescription(p.longDescription ?? '')
        setSpecs(
          Object.entries(p.specs).map(([key, value]) => ({ key, value }))
        )
        if (p.specs && Object.keys(p.specs).length === 0) setSpecs([{ key: '', value: '' }])
        setFeatures(p.features && p.features.length > 0 ? p.features : [''])
        setColors(
          p.colors && p.colors.length > 0
            ? p.colors.map((c) => ({ name: c.name, hex: c.hex, images: c.images ?? [] }))
            : [{ name: '', hex: '#000000', images: [] }]
        )
        setEngineVariants(p.engineVariants && p.engineVariants.length > 0 ? p.engineVariants : [''])
        setImages(p.images.length > 0 ? p.images : [''])
        setHeroImage(p.heroImage ?? '')
      }
    }
  }, [id, isEdit])

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }, [name, slugManual])

  function scrollTo(sectionId: string) {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const specsObj: Record<string, string> = {}
    specs.forEach(({ key, value }) => {
      if (key.trim()) specsObj[key.trim()] = value.trim()
    })

    const colorsArr = colors
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: c.name,
        hex: c.hex,
        images: c.images.filter(Boolean),
      }))

    const product: FullProduct = {
      id: isEdit && id ? id : `p-${Date.now()}`,
      name,
      slug,
      brandId,
      categoryId: CATEGORY_MAP[type],
      type,
      price,
      salePrice: onSale ? salePrice : null,
      description,
      specs: specsObj,
      images: images.filter(Boolean),
      heroImage: heroImage || undefined,
      stock,
      featured,
      status,
      createdAt: isEdit && id ? (getFullProductById(id)?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
      colors: colorsArr.length > 0 ? colorsArr : undefined,
      engineVariants: engineVariants.filter(Boolean).length > 0 ? engineVariants.filter(Boolean) : undefined,
      longDescription: longDescription || undefined,
      features: features.filter(Boolean).length > 0 ? features.filter(Boolean) : undefined,
    }

    upsertFullProduct(product)
    navigate('/products')
  }

  return (
    <div className="flex gap-6 relative">
      {/* ── Left nav ─────────────────────────────── */}
      <aside className="w-[180px] flex-shrink-0">
        <div className="sticky top-[76px] bg-white rounded-2xl border border-paper-line shadow-sm p-2 space-y-0.5">
          <p className="text-[10px] font-bold text-coal-dim uppercase tracking-widest px-3 pt-2 pb-1">Sections</p>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-medium text-coal-muted hover:text-coal hover:bg-paper-soft transition-colors"
            >
              {s.label}
              <ChevronRight size={11} className="text-coal-dim" />
            </button>
          ))}
        </div>
      </aside>

      {/* ── Form ─────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl space-y-5 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold text-coal">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-[13px] text-coal-muted mt-0.5">{isEdit ? 'Update product details' : 'Create a new product listing'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-paper-line bg-white text-[13px] font-semibold text-coal-muted hover:text-coal transition-colors shadow-sm"
            >
              <X size={14} /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors shadow-sm"
            >
              <Save size={14} /> {isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>

        {/* 1. Images */}
        <SectionCard id="images" title="Images">
          <div
            ref={(el) => { sectionRefs.current['images'] = el }}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>Product Images</label>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <ImageUploader
                    key={i}
                    value={img}
                    onChange={(path) => { const next = [...images]; next[i] = path; setImages(next) }}
                    onRemove={images.length > 1 ? () => setImages(images.filter((_, j) => j !== i)) : undefined}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setImages([...images, ''])}
                  className="h-28 rounded-xl border-2 border-dashed border-paper-line bg-paper-soft hover:border-coal-dim hover:bg-white transition-colors flex flex-col items-center justify-center gap-1 text-coal-muted hover:text-coal"
                >
                  <Plus size={18} />
                  <span className="text-[11px] font-semibold">Add slot</span>
                </button>
              </div>
              <p className="text-[11px] text-coal-dim mt-2">First image is used as the product thumbnail.</p>
            </div>

            <div className="pt-2 border-t border-paper-line">
              <label className={labelClass}>
                Hero Image{' '}
                <span className="normal-case text-[10px] font-normal text-coal-dim ml-1">optional</span>
              </label>
              <ImageUploader value={heroImage} onChange={setHeroImage} />
              <p className="text-[11px] text-coal-dim mt-2">Used on the homepage hero slider. Leave blank if not applicable.</p>
            </div>
          </div>
        </SectionCard>

        {/* 2. Basic Info */}
        <SectionCard id="basic" title="Basic Info">

          <div
            ref={(el) => { sectionRefs.current['basic'] = el }}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vespa GTS 300 Super"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={slug}
                onChange={(e) => { setSlugManual(true); setSlug(e.target.value) }}
                placeholder="auto-generated-from-name"
                className={inputClass + ' font-mono text-[12px]'}
              />
              <p className="text-[11px] text-coal-dim mt-1">Auto-generated from name. Edit to override.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Brand</label>
                <SelectField
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className={inputClass}
                >
                  {BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </SelectField>
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <SelectField
                  value={type}
                  onChange={(e) => setType(e.target.value as ProductType)}
                  className={inputClass}
                >
                  <option value="scooter">Scooter</option>
                  <option value="part">Part</option>
                  <option value="accessory">Accessory</option>
                </SelectField>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-xl border border-paper-line bg-paper-soft px-4 py-3">
                <div>
                  <div className="text-[13px] font-semibold text-coal">Active</div>
                  <div className="text-[11px] text-coal-muted mt-0.5">Show on storefront</div>
                </div>
                <Toggle checked={status === 'active'} onChange={(v) => setStatus(v ? 'active' : 'draft')} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-paper-line bg-paper-soft px-4 py-3">
                <div>
                  <div className="text-[13px] font-semibold text-coal">Featured</div>
                  <div className="text-[11px] text-coal-muted mt-0.5">Highlight on homepage</div>
                </div>
                <Toggle checked={featured} onChange={setFeatured} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* 2. Pricing */}
        <SectionCard id="pricing" title="Pricing">
          <div
            ref={(el) => { sectionRefs.current['pricing'] = el }}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>Price (₱) *</label>
              <input
                required
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-paper-line bg-paper-soft px-4 py-3">
              <div>
                <div className="text-[13px] font-semibold text-coal">On Sale</div>
                <div className="text-[11px] text-coal-muted mt-0.5">Show a discounted price</div>
              </div>
              <Toggle checked={onSale} onChange={setOnSale} />
            </div>
            {onSale && (
              <div>
                <label className={labelClass}>Sale Price (₱)</label>
                <input
                  type="number"
                  min={0}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </SectionCard>

        {/* 3. Description */}
        <SectionCard id="description" title="Description">
          <div
            ref={(el) => { sectionRefs.current['description'] = el }}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>Short Description</label>
              <textarea
                rows={3}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief product summary shown in listings..."
                className={inputClass + ' resize-none'}
              />
              <p className="text-[11px] text-coal-dim mt-1">{description.length}/300 characters</p>
            </div>
            <div>
              <label className={labelClass}>Long Description</label>
              <textarea
                rows={8}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder={"Paragraphs separated by a blank line (\\n\\n)..."}
                className={inputClass + ' resize-y'}
              />
              <p className="text-[11px] text-coal-dim mt-1">{longDescription.length} characters</p>
            </div>
          </div>
        </SectionCard>

        {/* 4. Specs */}
        <SectionCard id="specs" title="Specs">
          <div
            ref={(el) => { sectionRefs.current['specs'] = el }}
            className="space-y-2"
          >
            {specs.map((row, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={row.key}
                  onChange={(e) => {
                    const next = [...specs]; next[i] = { ...next[i], key: e.target.value }; setSpecs(next)
                  }}
                  placeholder="Key (e.g. Engine)"
                  className={inputClass + ' flex-1'}
                />
                <input
                  value={row.value}
                  onChange={(e) => {
                    const next = [...specs]; next[i] = { ...next[i], value: e.target.value }; setSpecs(next)
                  }}
                  placeholder="Value (e.g. 278cc HPE)"
                  className={inputClass + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecs([...specs, { key: '', value: '' }])}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-paper-line text-[12px] font-semibold text-coal-muted hover:text-coal hover:border-coal-dim transition-colors mt-2"
            >
              <Plus size={13} /> Add Spec
            </button>
          </div>
        </SectionCard>

        {/* 5. Features */}
        <SectionCard id="features" title="Features">
          <div
            ref={(el) => { sectionRefs.current['features'] = el }}
            className="space-y-2"
          >
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={feat}
                  onChange={(e) => {
                    const next = [...features]; next[i] = e.target.value; setFeatures(next)
                  }}
                  placeholder="e.g. ABS Dual-Channel Braking"
                  className={inputClass + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFeatures([...features, ''])}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-paper-line text-[12px] font-semibold text-coal-muted hover:text-coal hover:border-coal-dim transition-colors mt-2"
            >
              <Plus size={13} /> Add Feature
            </button>
          </div>
        </SectionCard>

        {/* 6. Colors */}
        <SectionCard id="colors" title="Colors">
          <div
            ref={(el) => { sectionRefs.current['colors'] = el }}
            className="space-y-3"
          >
            {colors.map((color, i) => (
              <div key={i} className="rounded-xl border border-paper-line bg-paper-soft p-3 space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    value={color.name}
                    onChange={(e) => {
                      const next = [...colors]; next[i] = { ...next[i], name: e.target.value }; setColors(next)
                    }}
                    placeholder="Color name (e.g. Rosso Passione)"
                    className={inputClass + ' flex-1 bg-white'}
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-lg border border-paper-line flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => {
                        const next = [...colors]; next[i] = { ...next[i], hex: e.target.value }; setColors(next)
                      }}
                      className="w-9 h-9 rounded-lg border border-paper-line cursor-pointer p-0.5 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setColors(colors.filter((_, j) => j !== i))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-coal-dim uppercase tracking-widest mb-2">
                    Color Images
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {color.images.map((img, j) => (
                      <div key={j} className="w-20">
                        <ImageUploader
                          value={img}
                          compact
                          onChange={(path) => {
                            const next = [...colors]
                            const imgs = [...next[i].images]
                            imgs[j] = path
                            next[i] = { ...next[i], images: imgs }
                            setColors(next)
                          }}
                          onRemove={() => {
                            const next = [...colors]
                            next[i] = { ...next[i], images: next[i].images.filter((_, k) => k !== j) }
                            setColors(next)
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...colors]
                        next[i] = { ...next[i], images: [...next[i].images, ''] }
                        setColors(next)
                      }}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-paper-line bg-white hover:border-coal-dim transition-colors flex flex-col items-center justify-center gap-1 text-coal-muted hover:text-coal"
                    >
                      <Plus size={14} />
                      <span className="text-[10px] font-semibold">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setColors([...colors, { name: '', hex: '#000000', images: [] }])}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-paper-line text-[12px] font-semibold text-coal-muted hover:text-coal hover:border-coal-dim transition-colors"
            >
              <Plus size={13} /> Add Color
            </button>
          </div>
        </SectionCard>

        {/* 7. Engine Variants (scooters only) */}
        {type === 'scooter' && (
          <SectionCard id="variants" title="Engine Variants">
            <div
              ref={(el) => { sectionRefs.current['variants'] = el }}
              className="space-y-2"
            >
              {engineVariants.map((variant, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={variant}
                    onChange={(e) => {
                      const next = [...engineVariants]; next[i] = e.target.value; setEngineVariants(next)
                    }}
                    placeholder="e.g. 125cc"
                    className={inputClass + ' flex-1'}
                  />
                  <button
                    type="button"
                    onClick={() => setEngineVariants(engineVariants.filter((_, j) => j !== i))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEngineVariants([...engineVariants, ''])}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-paper-line text-[12px] font-semibold text-coal-muted hover:text-coal hover:border-coal-dim transition-colors mt-2"
              >
                <Plus size={13} /> Add Variant
              </button>
            </div>
          </SectionCard>
        )}

        {/* Bottom save button */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-5 py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:bg-paper-soft transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors"
          >
            <Save size={14} /> {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
