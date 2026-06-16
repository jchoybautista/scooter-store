import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Smartphone,
  Check,
  ShieldCheck,
  Package,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { useCart } from '../../lib/cartContext'
import { useAuth } from '../../lib/authContext'
import { formatPrice } from '../../lib/format'
import { BRANCHES } from '../../lib/branches'

type PaymentMethod = 'card' | 'gcash'

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length >= 3) return `${d.slice(0, 2)} / ${d.slice(2)}`
  if (d.length === 2) return `${d} / `
  return d
}

interface AddressFields {
  street: string
  city: string
  province: string
  zip: string
}

const emptyAddress: AddressFields = { street: '', city: '', province: '', zip: '' }

export default function Checkout() {
  const { items, subtotal, count, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const branchId = (location.state as { branch?: string } | null)?.branch ?? BRANCHES[0].id

  const hasScooter = items.some((i) => i.type === 'scooter')
  const needsShipping = !hasScooter

  // contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // shipping & billing (non-scooter only)
  const [shipping, setShipping] = useState<AddressFields>(emptyAddress)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billing, setBilling] = useState<AddressFields>(emptyAddress)

  // pickup branch (scooter)
  const [branch, setBranch] = useState(branchId)
  const [branchOpen, setBranchOpen] = useState(false)
  const selectedBranch = BRANCHES.find((b) => b.id === branch) ?? BRANCHES[0]

  // payment
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [gcashPhone, setGcashPhone] = useState('')

  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (items.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  if (!isLoggedIn) {
    navigate('/sign-in', { replace: true, state: { redirect: '/checkout', checkoutState: location.state } })
    return null
  }

  function validate() {
    const e: Record<string, string> = {}

    if (!name.trim()) e.name = 'Full name is required'
    if (!email.trim() || !email.includes('@')) e.email = 'Enter a valid email address'
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number'

    if (needsShipping) {
      if (!shipping.street.trim()) e['shipping.street'] = 'Street address is required'
      if (!shipping.city.trim()) e['shipping.city'] = 'City is required'
      if (!shipping.province.trim()) e['shipping.province'] = 'Province is required'
      if (!shipping.zip.trim()) e['shipping.zip'] = 'ZIP code is required'

      if (!billingSameAsShipping) {
        if (!billing.street.trim()) e['billing.street'] = 'Street address is required'
        if (!billing.city.trim()) e['billing.city'] = 'City is required'
        if (!billing.province.trim()) e['billing.province'] = 'Province is required'
        if (!billing.zip.trim()) e['billing.zip'] = 'ZIP code is required'
      }
    }

    if (method === 'card') {
      if (!cardName.trim()) e.cardName = 'Name on card is required'
      if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number'
      if (expiry.replace(/[\s\/]/g, '').length < 4) e.expiry = 'Enter expiry as MM / YY'
      if (cvv.length < 3) e.cvv = 'Enter a valid CVV'
    } else {
      const gd = gcashPhone.replace(/\D/g, '')
      if (gd.length < 10 || gd.length > 11) e.gcashPhone = 'Enter a valid Philippine mobile number'
    }

    if (!agreed) e.agreed = 'You must agree to the Terms and Conditions'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    const orderNumber = `VLT-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const snapshot = { items, subtotal, method, hasScooter, branch: selectedBranch, shipping, needsShipping, name, email, phone, orderNumber }
    clearCart()
    navigate('/order-confirmed', { state: snapshot, replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <h1 className="mb-10 font-display text-4xl font-extrabold text-coal sm:text-5xl">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">

        {/* ── Left: form ── */}
        <div className="space-y-8">

          {/* Contact Information */}
          <FormSection title="Contact Information">
            <Field label="Full name" required error={errors.name}>
              <input
                type="text"
                placeholder="Juan dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls(!!errors.name)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email address" required error={errors.email}>
                <input
                  type="email"
                  placeholder="juan@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls(!!errors.email)}
                />
              </Field>
              <Field label="Phone number" required error={errors.phone}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-coal-dim">+63</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className={inputCls(!!errors.phone) + ' pl-12'}
                  />
                </div>
              </Field>
            </div>
          </FormSection>

          {/* Shipping Address — non-scooter items only */}
          {needsShipping && (
            <>
              <FormSection title="Shipping Address">
                <AddressForm
                  values={shipping}
                  onChange={(f, v) => setShipping((s) => ({ ...s, [f]: v }))}
                  errors={errors}
                  prefix="shipping"
                />
              </FormSection>

              {/* Billing Address */}
              <FormSection title="Billing Address">
                {/* Same as shipping checkbox */}
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={billingSameAsShipping}
                    onChange={() => setBillingSameAsShipping((v) => !v)}
                  />
                  <span className="text-sm font-semibold text-coal">Same as shipping address</span>
                </label>

                {!billingSameAsShipping && (
                  <div className="mt-4 space-y-4">
                    <AddressForm
                      values={billing}
                      onChange={(f, v) => setBilling((b) => ({ ...b, [f]: v }))}
                      errors={errors}
                      prefix="billing"
                    />
                  </div>
                )}
              </FormSection>
            </>
          )}

          {/* Pickup branch — scooter items */}
          {hasScooter && (
            <FormSection title="Pickup Branch">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBranchOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-left text-sm font-semibold text-coal transition-colors hover:border-coal-dim focus:border-carrot focus:outline-none focus:ring-2 focus:ring-carrot/20"
                >
                  <span>{selectedBranch.name}</span>
                  <ChevronDown size={15} className={`text-coal-dim transition-transform ${branchOpen ? 'rotate-180' : ''}`} />
                </button>
                {branchOpen && (
                  <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-paper-line bg-paper shadow-lift">
                    {[...BRANCHES].sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => { setBranch(b.id); setBranchOpen(false) }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-paper-soft"
                      >
                        <span className={`font-semibold ${branch === b.id ? 'text-carrot' : 'text-coal'}`}>{b.name}</span>
                        {branch === b.id && <Check size={13} className="text-carrot" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-coal-muted">
                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-coal-dim" />
                {selectedBranch.address}
              </div>
            </FormSection>
          )}

          {/* Payment */}
          <FormSection title="Payment Method">
            <div className="flex gap-3">
              <ModeTab active={method === 'card'} icon={<CreditCard size={18} />} label="Credit / Debit Card" onClick={() => setMethod('card')} />
              <ModeTab active={method === 'gcash'} icon={<Smartphone size={18} />} label="GCash" onClick={() => setMethod('gcash')} />
            </div>

            <div className="mt-5">
              {method === 'card' ? (
                <div className="space-y-4">
                  <Field label="Name on card" required error={errors.cardName}>
                    <input
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={inputCls(!!errors.cardName)}
                    />
                  </Field>
                  <Field label="Card number" required error={errors.cardNumber}>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className={inputCls(!!errors.cardNumber) + ' pr-12'}
                      />
                      <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-coal-dim" />
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry date" required error={errors.expiry}>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className={inputCls(!!errors.expiry)}
                      />
                    </Field>
                    <Field label="CVV" required error={errors.cvv}>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className={inputCls(!!errors.cvv)}
                      />
                    </Field>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#007DFF]/[0.08] px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007DFF]">
                      <Smartphone size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-coal">GCash</p>
                      <p className="text-xs text-coal-muted">Pay via your GCash wallet</p>
                    </div>
                  </div>
                  <Field label="GCash mobile number" required error={errors.gcashPhone}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-coal-dim">+63</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9XX XXX XXXX"
                        value={gcashPhone}
                        onChange={(e) => setGcashPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className={inputCls(!!errors.gcashPhone) + ' pl-12'}
                      />
                    </div>
                  </Field>
                  <p className="text-xs leading-relaxed text-coal-muted">
                    A payment request will be sent to your GCash app for approval.
                  </p>
                </div>
              )}
            </div>
          </FormSection>

          {/* Terms & Conditions */}
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox checked={agreed} onChange={() => setAgreed((v) => !v)} />
            <span className="text-sm text-coal-muted">
              I have read and agree to the{' '}
              <span className="font-semibold text-coal underline underline-offset-2">Terms and Conditions</span>.
            </span>
          </label>
        </div>

        {/* ── Right: order summary ── */}
        <div className="h-fit lg:sticky lg:top-28">
          <div className="rounded-xl2 border border-paper-line bg-paper p-6">
            <h2 className="mb-5 font-display text-xl font-extrabold text-coal">Review your cart</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-paper-soft">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package size={20} className="text-coal-dim" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-coal">{item.name}</p>
                    <p className="text-xs text-coal-muted">{item.qty}x</p>
                  </div>
                  <span className="text-sm font-bold text-coal">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-paper-line" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-coal-muted">Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-coal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coal-muted">{needsShipping ? 'Shipping' : 'Pickup'}</span>
                <span className="font-semibold text-coal-dim">{needsShipping ? 'Calculated at checkout' : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coal-muted">Taxes & fees</span>
                <span className="font-semibold text-coal-dim">Included</span>
              </div>
            </div>

            <div className="my-4 border-t border-paper-line" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-coal">Total</span>
              <span className="font-display text-2xl font-extrabold text-coal">{formatPrice(subtotal)}</span>
            </div>

            <button
              onClick={submit}
              className="mt-5 w-full rounded-pill bg-carrot py-4 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
            >
              {method === 'gcash' ? 'Pay with GCash' : 'Pay Now'}
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-sm font-semibold text-coal-muted transition-colors hover:text-carrot"
            >
              ← Back to cart
            </Link>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-paper-soft px-4 py-3">
              <ShieldCheck size={20} className="mt-0.5 flex-shrink-0 text-coal-dim" />
              <div>
                <p className="text-xs font-bold text-coal">Secure Checkout – SSL Encrypted</p>
                <p className="mt-0.5 text-xs leading-relaxed text-coal-muted">
                  Your financial and personal details are secure during every transaction.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Address fields sub-form ── */
function AddressForm({
  values,
  onChange,
  errors,
  prefix,
}: {
  values: AddressFields
  onChange: (field: keyof AddressFields, value: string) => void
  errors: Record<string, string>
  prefix: string
}) {
  return (
    <div className="space-y-4">
      <Field label="Street address" required error={errors[`${prefix}.street`]}>
        <input
          type="text"
          placeholder="123 Rizal St., Brgy. Example"
          value={values.street}
          onChange={(e) => onChange('street', e.target.value)}
          className={inputCls(!!errors[`${prefix}.street`])}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" required error={errors[`${prefix}.city`]}>
          <input
            type="text"
            placeholder="Makati"
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
            className={inputCls(!!errors[`${prefix}.city`])}
          />
        </Field>
        <Field label="Province" required error={errors[`${prefix}.province`]}>
          <input
            type="text"
            placeholder="Metro Manila"
            value={values.province}
            onChange={(e) => onChange('province', e.target.value)}
            className={inputCls(!!errors[`${prefix}.province`])}
          />
        </Field>
        <Field label="ZIP code" required error={errors[`${prefix}.zip`]}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1200"
            value={values.zip}
            onChange={(e) => onChange('zip', e.target.value.replace(/\D/g, '').slice(0, 4))}
            className={inputCls(!!errors[`${prefix}.zip`])}
          />
        </Field>
      </div>
    </div>
  )
}

/* ── Reusable checkbox ── */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors ${
        checked ? 'border-carrot bg-carrot' : 'border-paper-line'
      }`}
    >
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
    </div>
  )
}

/* ── Section wrapper ── */
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-extrabold text-coal">{title}</h2>
      <div className="rounded-xl2 border border-paper-line bg-paper p-6 space-y-4">
        {children}
      </div>
    </div>
  )
}

/* ── Payment method tab ── */
function ModeTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
        active
          ? 'border-carrot bg-carrot-wash text-carrot'
          : 'border-paper-line bg-paper text-coal-muted hover:border-coal-dim hover:text-coal'
      }`}
    >
      <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-carrot' : 'border-coal-dim'}`}>
        {active && <span className="h-2 w-2 rounded-full bg-carrot" />}
      </span>
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

/* ── Field wrapper ── */
function Field({ label, required, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-coal">
        {label}{required && <span className="ml-0.5 text-carrot">*</span>}
      </label>
      {children}
    </div>
  )
}

function inputCls(_hasError: boolean) {
  return `w-full rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm font-semibold text-coal placeholder:font-normal placeholder:text-coal-dim focus:border-carrot focus:outline-none focus:ring-2 focus:ring-carrot/20 transition-colors`
}

