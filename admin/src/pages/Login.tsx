import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, LayoutDashboard, ClipboardList, Package, Users, Zap } from 'lucide-react'
import { adminLogin } from '../lib/adminAuth'

const FEATURES = [
  { icon: LayoutDashboard, text: 'Real-time sales dashboard & analytics' },
  { icon: ClipboardList, text: 'Order management & status tracking' },
  { icon: Package, text: 'Full product catalog control' },
  { icon: Users, text: 'User & permissions management' },
]

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      adminLogin()
      navigate('/dashboard', { replace: true })
    }, 800)
  }

  function handleSkip() {
    adminLogin()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between bg-[#0F1117] p-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-carrot/10 pointer-events-none" />
        <div className="absolute bottom-24 -right-10 w-64 h-64 rounded-full bg-carrot/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-carrot to-carrot-deep flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-black text-xl leading-none">V</span>
          </div>
          <div>
            <div className="text-white font-bold text-[17px] leading-tight tracking-tight">Velocità</div>
            <div className="text-white/30 text-[9px] uppercase tracking-[0.15em] font-semibold">Admin Panel</div>
          </div>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-white font-bold text-[30px] leading-snug mb-2">
              Manage your store<br />from anywhere.
            </h2>
            <p className="text-white/50 text-[13px] leading-relaxed">
              Real-time orders, products, and analytics at your fingertips.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-carrot" />
                </div>
                <span className="text-white/60 text-[13px]">{text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[['31+', 'Products'], ['₱2M+', 'Revenue'], ['100%', 'Uptime']].map(([val, label]) => (
              <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center">
                <div className="text-carrot font-bold text-[18px] leading-tight">{val}</div>
                <div className="text-white/35 text-[10px] mt-0.5 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/20 text-[11px]">
          © 2026 Velocità. Built with Claude Code.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FA] px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-carrot to-carrot-deep flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-lg leading-none">V</span>
            </div>
            <div className="text-coal font-bold text-[16px]">Velocità Admin</div>
          </div>

          <h1 className="text-[26px] font-bold text-coal mb-1">Welcome back</h1>
          <p className="text-coal-muted text-[13px] mb-8">Sign in to access your admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-coal-dim uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coal-dim pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="admin@velocita.ph"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-paper-line bg-white text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-coal-dim uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-[12px] text-carrot hover:text-carrot-deep font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coal-dim pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-paper-line bg-white text-[13px] text-coal outline-none focus:border-carrot focus:ring-2 focus:ring-carrot/10 transition-all"
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

            {error && <p className="text-red-500 text-[12px]">{error}</p>}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-carrot" />
                <span className="text-[12px] text-coal-muted">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-carrot text-white font-bold text-[14px] hover:bg-carrot-deep transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
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

          <p className="text-center text-[11px] text-coal-dim mt-4">
            Demo mode — any email + any password will work
          </p>
        </div>
      </div>

    </div>
  )
}
