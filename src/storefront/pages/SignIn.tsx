import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Phone, Star, Zap } from 'lucide-react'
import Logo from '../../components/Logo'
import { useAuth } from '../../lib/authContext'
import { registerCustomer } from '../../lib/customers'

type Tab = 'signin' | 'signup'

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { redirect?: string; checkoutState?: unknown } | null
  const from = state?.redirect ?? '/'
  const checkoutState = state?.checkoutState

  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function doLogin() {
    setLoading(true)
    setTimeout(() => {
      login()
      navigate(from, { replace: true, state: checkoutState })
    }, 700)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (tab === 'signup' && fullName.trim()) {
      registerCustomer(fullName.trim(), email.trim(), phone.trim())
    }
    doLogin()
  }

  function handleSkip() {
    login()
    navigate(from, { replace: true, state: checkoutState })
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between bg-[#0F1117] p-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-carrot/10 pointer-events-none" />
        <div className="absolute bottom-20 -left-10 w-60 h-60 rounded-full bg-carrot/[0.06] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-white/[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-white font-bold text-[32px] leading-snug mb-3">
              Ride in<br />Italian style.
            </h2>
            <p className="text-white/50 text-[13px] leading-relaxed">
              Sign in to track your orders, save your favourite scooters, and enjoy a faster checkout every time.
            </p>
          </div>

          {/* Scooter image */}
          <div className="relative rounded-2xl overflow-hidden h-44 bg-white/[0.03] border border-white/[0.06]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
              alt="Premium scooter"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-[#0F1117]/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-carrot text-[10px] font-bold uppercase tracking-widest mb-1">Featured</div>
              <div className="text-white font-bold text-[15px] leading-tight">Vespa GTS 300 Super</div>
              <div className="text-white/50 text-[12px]">Starting at ₱398,000</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-center gap-0.5 mb-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className="fill-carrot text-carrot" />
              ))}
            </div>
            <p className="text-white/70 text-[13px] leading-relaxed italic mb-3">
              "Outstanding service and a brilliant selection. I walked in not knowing which scooter to get, and walked out with exactly the right one."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-carrot flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                MV
              </div>
              <div>
                <div className="text-white text-[12px] font-semibold">Marco Villanueva</div>
                <div className="text-white/35 text-[10px]">Verified customer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/20 text-[11px]">
          © 2026 Velocità. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link to="/"><Logo /></Link>
          </div>

          <h1 className="text-[26px] font-bold text-coal mb-1">
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-coal-muted text-[13px] mb-6">
            {tab === 'signin' ? 'Sign in to your Velocità account' : 'Join Velocità and ride in style'}
          </p>

          {/* Tabs */}
          <div className="flex bg-paper-soft rounded-xl p-1 mb-6 border border-paper-line">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                  tab === t ? 'bg-white shadow-sm text-coal' : 'text-coal-muted hover:text-coal'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 rounded-xl border border-paper-line bg-paper-soft text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">
                    Phone <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coal-dim pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 917 000 0000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-paper-line bg-paper-soft text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coal-dim pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-paper-line bg-paper-soft text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-coal-dim uppercase tracking-widest">
                  Password
                </label>
                {tab === 'signin' && (
                  <button type="button" className="text-[12px] text-carrot hover:text-carrot-deep font-medium transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coal-dim pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-paper-line bg-paper-soft text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-coal-dim hover:text-coal transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <p className="text-[11px] text-coal-dim leading-relaxed">
                By creating an account you agree to our{' '}
                <button type="button" className="text-carrot hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-carrot hover:underline">Privacy Policy</button>.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-carrot text-white font-bold text-[14px] hover:bg-carrot-deep transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-paper-line" />
            <span className="text-[11px] text-coal-dim font-medium">or</span>
            <div className="flex-1 border-t border-paper-line" />
          </div>

          <button
            onClick={handleSkip}
            className="w-full py-3.5 rounded-xl bg-[#0F1117] text-white font-bold text-[14px] hover:bg-[#1A1D23] transition-colors flex items-center justify-center gap-2.5 shadow-sm"
          >
            <Zap size={15} className="text-carrot fill-carrot flex-shrink-0" />
            Skip Sign In for Demo Purpose
          </button>

          <p className="text-center text-[11px] text-coal-dim mt-4 leading-relaxed">
            Demo store — any credentials will work.{' '}
            <Link to="/" className="text-carrot hover:underline">Browse as guest →</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
