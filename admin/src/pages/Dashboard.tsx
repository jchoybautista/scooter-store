import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, ArrowUpRight, ArrowDownRight, ShoppingCart, Package, Star, MessageSquare } from 'lucide-react'
import { PiCubeBold, PiReceiptBold, PiCurrencyDollarBold, PiHourglassMediumBold } from 'react-icons/pi'
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { geoMercator, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection } from 'geojson'
import { getOrders, type AdminOrder } from '../data/orders'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'

type StatusKey = AdminOrder['status']

const STATUS_HEX: Record<StatusKey, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  ready: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444',
}
const STATUS_COLORS: Record<StatusKey, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const mk = (vals: number[]) => vals.map((v) => ({ v }))
const SPARKS = {
  products: mk([22, 24, 21, 26, 27, 25, 31]),
  orders:   mk([2, 4, 3, 6, 4, 7, 3]),
  revenue:  mk([150, 220, 180, 310, 260, 340, 428]),
  pending:  mk([3, 4, 3, 5, 4, 3, 2]),
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function buildMonthly(orders: AdminOrder[]) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const base = [320, 415, 380, 510, 448, 0][i]
    const real = orders
      .filter((o) => {
        const od = new Date(o.date)
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
      })
      .reduce((s, o) => s + o.subtotal / 1000, 0)
    return { month: MONTHS[d.getMonth()], revenue: Math.round(base + real) }
  })
}

// All nationwide branches with coordinates [lng, lat] and sample order data
// Colors: Metro Manila = carrot, Luzon = blue, Visayas = green, Mindanao = purple
const BRANCH_MARKERS: { name: string; coordinates: [number, number]; color: string; orders: number }[] = [
  // Metro Manila — top 4 appear in sidebar by name; rest roll into "Other Cities"
  { name: 'Makati',              coordinates: [121.0244, 14.5547], color: '#F95D0E', orders: 47 },
  { name: 'BGC',                 coordinates: [121.0509, 14.5490], color: '#F95D0E', orders: 38 },
  { name: 'Pasig',               coordinates: [121.0851, 14.5764], color: '#F95D0E', orders: 24 },
  { name: 'Quezon City',         coordinates: [121.0437, 14.6760], color: '#F95D0E', orders: 16 },
  { name: 'Mandaluyong',         coordinates: [121.0359, 14.5794], color: '#F95D0E', orders: 10 },
  // Luzon
  { name: 'Baguio City',         coordinates: [120.5960, 16.4023], color: '#3B82F6', orders: 12 },
  { name: 'Angeles City',        coordinates: [120.5822, 15.1450], color: '#3B82F6', orders:  9 },
  { name: 'San Fernando',        coordinates: [120.3172, 16.6159], color: '#3B82F6', orders:  7 },
  { name: 'Batangas City',       coordinates: [121.0500, 13.7565], color: '#3B82F6', orders: 11 },
  { name: 'Naga City',           coordinates: [123.7528, 13.6192], color: '#3B82F6', orders:  8 },
  // Visayas
  { name: 'Cebu City',           coordinates: [123.8907, 10.3157], color: '#10B981', orders: 21 },
  { name: 'Mandaue City',        coordinates: [123.9247, 10.3236], color: '#10B981', orders: 14 },
  { name: 'Lapu-Lapu City',      coordinates: [123.9629, 10.3103], color: '#10B981', orders:  9 },
  { name: 'Iloilo City',         coordinates: [122.5621, 10.7202], color: '#10B981', orders: 13 },
  { name: 'Bacolod City',        coordinates: [122.9498, 10.6713], color: '#10B981', orders: 10 },
  { name: 'Tacloban City',       coordinates: [125.0028, 11.2543], color: '#10B981', orders:  7 },
  { name: 'Dumaguete City',      coordinates: [123.3068,  9.3068], color: '#10B981', orders:  6 },
  // Mindanao
  { name: 'Davao City',          coordinates: [125.6128,  7.1907], color: '#8B5CF6', orders: 18 },
  { name: 'Cagayan de Oro',      coordinates: [124.6563,  8.4822], color: '#8B5CF6', orders: 15 },
  { name: 'General Santos City', coordinates: [125.1716,  6.1164], color: '#8B5CF6', orders: 11 },
  { name: 'Iligan City',         coordinates: [124.2452,  8.2280], color: '#8B5CF6', orders:  8 },
  { name: 'Zamboanga City',      coordinates: [122.0739,  6.9214], color: '#8B5CF6', orders:  9 },
  { name: 'Butuan City',         coordinates: [125.5406,  8.9475], color: '#8B5CF6', orders:  7 },
  { name: 'Koronadal City',      coordinates: [124.8468,  6.4984], color: '#8B5CF6', orders:  6 },
]
const BRANCH_TOTAL = BRANCH_MARKERS.reduce((s, b) => s + b.orders, 0)

// Detailed Philippines outline (recognizable archipelago) — fetched once, cached
const PH_GEO_URL = 'https://cdn.jsdelivr.net/gh/faeldon/philippines-json-maps@master/2023/geojson/country/lowres/country.0.001.json'
const MAP_W = 300
const MAP_H = 360

// The source GeoJSON has clockwise-wound rings, which d3-geo (spherical) reads
// as "everything except this region" — making fills cover the whole globe and
// collapsing the real map to a speck. Reversing every ring fixes the winding.
function rewindRings(fc: FeatureCollection): FeatureCollection {
  for (const f of fc.features) {
    const g = f.geometry
    if (g.type === 'Polygon') {
      g.coordinates.forEach((ring) => ring.reverse())
    } else if (g.type === 'MultiPolygon') {
      g.coordinates.forEach((poly) => poly.forEach((ring) => ring.reverse()))
    }
  }
  return fc
}

let phGeoCache: Promise<FeatureCollection> | null = null
const loadPhGeo = () => {
  if (!phGeoCache) phGeoCache = fetch(PH_GEO_URL).then((r) => r.json()).then(rewindRings)
  return phGeoCache
}

function MapDotTooltip({ x, y, name, orders }: { x: number; y: number; name: string; orders: number }) {
  const W = 132
  const H = 44
  const tx = Math.max(4, Math.min(x - W / 2, MAP_W - W - 4))
  const ty = y - H - 10 < 4 ? y + 10 : y - H - 10
  return (
    <g pointerEvents="none">
      <rect x={tx} y={ty} width={W} height={H} rx={7} fill="#0F1117" opacity={0.96} />
      <text x={tx + 10} y={ty + 16} fill="#fff" fontSize={9.5} fontWeight={700}>{name}</text>
      <text x={tx + 10} y={ty + 31} fill="#F9A66E" fontSize={8.5} fontWeight={600}>{orders} orders</text>
    </g>
  )
}

function PhilippinesMap() {
  const [paths, setPaths] = useState<string[]>([])
  const [pins, setPins] = useState<Array<[number, number]>>([])
  const [hoverShape, setHoverShape] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    loadPhGeo()
      .then((fc) => {
        if (!alive) return
        const projection = geoMercator().fitExtent([[14, 14], [MAP_W - 14, MAP_H - 14]], fc)
        const path = geoPath().projection(projection)
        setPaths(fc.features.map((f) => path(f as Feature) ?? '').filter(Boolean))
        setPins(BRANCH_MARKERS.map((b) => projection(b.coordinates) as [number, number]))
      })
      .catch(() => {/* silently ignore network failures */})
    return () => { alive = false }
  }, [])

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
      <rect width={MAP_W} height={MAP_H} fill="white" />
      <g
        onMouseEnter={() => setHoverShape(true)}
        onMouseLeave={() => setHoverShape(false)}
        style={{ cursor: 'pointer' }}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} fill={hoverShape ? '#FFD9C2' : '#CBD5E1'} stroke="#FFFFFF" strokeWidth={0.7} style={{ transition: 'fill .25s ease' }} />
        ))}
      </g>

      {pins.map((pin, i) => {
        const b = BRANCH_MARKERS[i]
        return (
          <g
            key={b.name}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <circle cx={pin[0]} cy={pin[1]} r={3.5} fill={b.color} stroke="#fff" strokeWidth={1.2} opacity={0.9} />
            {/* invisible enlarged hit target */}
            <circle cx={pin[0]} cy={pin[1]} r={9} fill="transparent" />
            {hoveredIdx === i && (
              <MapDotTooltip x={pin[0]} y={pin[1]} name={b.name} orders={b.orders} />
            )}
          </g>
        )
      })}
    </svg>
  )
}

const TRAFFIC_DATA = [
  { source: 'Direct (Web)', visits: 1842, pct: 42, color: '#F95D0E' },
  { source: 'Facebook',     visits: 1227, pct: 28, color: '#3B82F6' },
  { source: 'Google Search',visits: 789,  pct: 18, color: '#10B981' },
  { source: 'Instagram',    visits: 526,  pct: 12, color: '#8B5CF6' },
]

const TOP_CATEGORIES = [
  { name: 'Scooters',    units: 25,  revenue: 1988000 },
  { name: 'Helmets',     units: 134, revenue: 222000 },
  { name: 'Tires',       units: 89,  revenue: 115000 },
  { name: 'Accessories', units: 67,  revenue: 87000 },
  { name: 'Parts',       units: 42,  revenue: 52000 },
]

const BEST_SELLERS = [
  { rank: 1, name: 'Vespa Primavera 150', type: 'Scooter', units: 12, revenue: 2988000 },
  { rank: 2, name: 'AGV K6 Helmet',       type: 'Helmet',  units: 34, revenue: 204000 },
  { rank: 3, name: 'Vespa GTS 300',       type: 'Scooter', units: 8,  revenue: 3576000 },
  { rank: 4, name: 'Pirelli Angel GT',    type: 'Tire',    units: 28, revenue: 112000 },
  { rank: 5, name: 'Lambretta V200',      type: 'Scooter', units: 5,  revenue: 1750000 },
]

const TYPE_COLORS: Record<string, string> = {
  Scooter: 'bg-orange-50 text-carrot',
  Helmet:  'bg-blue-50 text-blue-600',
  Tire:    'bg-purple-50 text-purple-600',
}

const RECENT_ACTIVITY = [
  { Icon: ShoppingCart, text: 'New order placed',       sub: 'Maria Santos · Vespa Primavera', time: '2 min ago',  color: 'bg-blue-500' },
  { Icon: Eye,          text: 'Product page viewed',    sub: 'Vespa GTS 300 · 47 views today', time: '18 min ago', color: 'bg-orange-500' },
  { Icon: Package,      text: 'Ready for pickup',       sub: '#VLT-00121 · BGC Branch',        time: '1 hr ago',   color: 'bg-green-500' },
  { Icon: MessageSquare,text: 'Customer inquiry',       sub: 'Juan dela Cruz · Makati',        time: '2 hr ago',   color: 'bg-purple-500' },
  { Icon: Star,         text: 'New product added',      sub: 'Italjet Dragster 125',           time: '5 hr ago',   color: 'bg-amber-500' },
  { Icon: ShoppingCart, text: 'Order completed',        sub: 'AGV K6 Helmet · Pasig Branch',  time: '6 hr ago',   color: 'bg-teal-500' },
  { Icon: Package,      text: 'Stock updated',          sub: 'Pirelli Angel GT · +20 units',  time: '8 hr ago',   color: 'bg-cyan-500' },
]

// Circular progress for the gradient card
function CircularProgress({ pct, size = 96 }: { pct: number; size?: number }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  const progressRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const el = progressRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circ)
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'
      el.style.strokeDashoffset = String(offset)
    })
  }, [circ, offset])

  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={7} />
      <circle
        ref={progressRef} cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="white" strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="white" fontSize={13} fontWeight="700">{pct}%</text>
      <text x={size / 2} y={size / 2 + 11} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={8} fontWeight="500">TARGET</text>
    </svg>
  )
}

function Sparkline({ data, color, unit }: { data: { v: number }[]; color: string; unit: string }) {
  return (
    <BarChart width={72} height={40} data={data} barSize={7} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
      <Tooltip
        cursor={{ fill: 'rgba(15,17,23,0.05)' }}
        allowEscapeViewBox={{ x: true, y: true }}
        wrapperStyle={{ zIndex: 50 }}
        contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 11, padding: '2px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        labelFormatter={() => ''}
        formatter={(val) => [`${val} ${unit}`, '']}
      />
      <Bar dataKey="v" fill={color} radius={[4, 4, 0, 0]} animationDuration={900} opacity={0.85} activeBar={{ fill: color, opacity: 1 }} />
    </BarChart>
  )
}

function StatCard({
  label, value, icon: Icon, iconBg, iconColor, lineColor, sparkData, sparkUnit, trend, trendUp, viewTo,
}: {
  label: string; value: string | number; icon: React.ElementType; iconBg: string; iconColor: string;
  lineColor: string; sparkData: { v: number }[]; sparkUnit: string; trend: string; trendUp: boolean; viewTo: string
}) {
  const navigate = useNavigate()
  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight
  return (
    <div
      className="bg-white rounded-2xl p-4 border border-paper-line shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(viewTo)}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={26} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-coal-muted font-medium">{label}</div>
        <div className="text-[22px] font-bold text-coal leading-tight mt-0.5">{value}</div>
        <div className={`flex items-center gap-0.5 text-[11px] font-semibold mt-0.5 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          <TrendIcon size={11} />
          {trend}
          <span className="text-coal-dim font-normal ml-1">this month</span>
        </div>
      </div>
      <Sparkline data={sparkData} color={lineColor} unit={sparkUnit} />
    </div>
  )
}

function PesoTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-paper-line rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-coal mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-coal-muted">Revenue:</span>
          <span className="font-semibold text-coal">₱{p.value}k</span>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

export default function Dashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  useEffect(() => { setOrders(getOrders()) }, [])

  const totalRevenue = orders.reduce((s, o) => s + o.subtotal, 0) + 1988100
  const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  const monthlyData = buildMonthly(orders)
  const statusCounts = (['pending', 'processing', 'ready', 'completed', 'cancelled'] as StatusKey[])
    .map((s) => ({ name: s.charAt(0).toUpperCase() + s.slice(1), value: orders.filter((o) => o.status === s).length || (s === 'completed' ? 1 : 0), color: STATUS_HEX[s] }))
    .filter((d) => d.value > 0)
  const totalForDonut = statusCounts.reduce((s, d) => s + d.value, 0)
  const conversionRate = orders.length > 0 ? ((orders.filter(o => o.status === 'completed').length / orders.length) * 100).toFixed(1) : '68.0'

  const STATS = [
    { label: 'Total Products', value: products.length,           icon: PiCubeBold,           iconBg: 'bg-orange-50', iconColor: 'text-carrot',    lineColor: '#F95D0E', sparkData: SPARKS.products, sparkUnit: 'products', trend: '+2',     trendUp: true,  viewTo: '/products' },
    { label: 'Total Orders',   value: orders.length,             icon: PiReceiptBold,         iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',  lineColor: '#3B82F6', sparkData: SPARKS.orders,   sparkUnit: 'orders',   trend: '+12%',   trendUp: true,  viewTo: '/orders' },
    { label: 'Total Revenue',  value: formatPrice(totalRevenue), icon: PiCurrencyDollarBold,  iconBg: 'bg-green-50',  iconColor: 'text-green-500', lineColor: '#10B981', sparkData: SPARKS.revenue,  sparkUnit: '₱k',       trend: '+7.66%', trendUp: true,  viewTo: '/orders' },
    { label: 'Pending Orders', value: pendingCount,              icon: PiHourglassMediumBold, iconBg: 'bg-amber-50',  iconColor: 'text-amber-500', lineColor: '#F59E0B', sparkData: SPARKS.pending,  sparkUnit: 'pending',  trend: '-0.74%', trendUp: false, viewTo: '/orders' },
  ]

  return (
    <div className="space-y-6">

      {/* Welcome bar */}
      <div className="bg-white rounded-2xl border border-paper-line shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-coal leading-tight">
            Welcome back, <span className="text-carrot">Jonathan!</span>
          </h1>
          <p className="text-sm text-coal-muted mt-0.5">Track your sales activity and orders here.</p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-xs text-coal-dim">{today}</div>
          <div className="text-xs font-semibold text-coal mt-0.5">Velocità Admin Dashboard</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Section A: Revenue (2 cols) · Sales by Location (2 cols) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">

        {/* Revenue Analytics — spans 2 columns */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-paper-line shadow-sm p-5 flex flex-col xl:h-[440px]">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h2 className="text-[14px] font-semibold text-coal">Revenue Analytics</h2>
              <p className="text-[11px] text-coal-muted mt-0.5">Monthly (₱k) — last 6 months</p>
            </div>
            <span className="text-[11px] text-green-500 font-semibold bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={11} /> +7.66%
            </span>
          </div>

          {/* Mini KPI row */}
          <div className="grid grid-cols-3 divide-x divide-paper-line border border-paper-line rounded-xl overflow-hidden mb-3 shrink-0">
            <div className="px-3 py-2.5 text-center">
              <div className="text-[13px] font-bold text-coal">{orders.length}</div>
              <div className="text-[10px] text-coal-muted mt-0.5">Orders</div>
            </div>
            <div className="px-3 py-2.5 text-center">
              <div className="text-[13px] font-bold text-coal">{formatPrice(totalRevenue)}</div>
              <div className="text-[10px] text-coal-muted mt-0.5">Revenue</div>
            </div>
            <div className="px-3 py-2.5 text-center">
              <div className="text-[13px] font-bold text-carrot">{conversionRate}%</div>
              <div className="text-[10px] text-coal-muted mt-0.5">Conversion</div>
            </div>
          </div>

          {/* Area chart — grows to fill remaining card height */}
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F95D0E" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#F95D0E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${v}k`} />
                <Tooltip content={<PesoTooltip />} />
                <Area
                  type="monotone" dataKey="revenue" name="Revenue"
                  stroke="#F95D0E" strokeWidth={2.5} fill="url(#grad)"
                  dot={{ r: 3, fill: '#F95D0E', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#F95D0E', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1400} animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue target gradient card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-carrot to-carrot-deep p-4 text-white mt-3 shrink-0">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Monthly Target</p>
                <div className="text-[18px] font-bold mt-0.5">₱3.0M</div>
                <p className="text-[11px] text-white/70 mt-1">You've achieved <span className="text-white font-semibold">68%</span> of goal</p>
              </div>
              <CircularProgress pct={68} size={72} />
            </div>
          </div>
        </div>

        {/* Sales by Location — spans 2 columns: map + branch breakdown side by side */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden flex flex-col xl:h-[440px]">
          <div className="px-5 py-3.5 border-b border-paper-line shrink-0">
            <h2 className="text-[14px] font-semibold text-coal">Sales by Location</h2>
            <p className="text-[11px] text-coal-muted mt-0.5">Nationwide branches — hover the map for details</p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Map — absolutely fills its container so SVG height always resolves */}
            <div className="relative flex-1 min-h-[200px]">
              <div className="absolute inset-0">
                <PhilippinesMap />
              </div>
            </div>

            {/* Branch breakdown — fixed-width sidebar */}
            <div className="shrink-0 w-full sm:w-52 border-t sm:border-t-0 sm:border-l border-paper-line px-5 py-5 flex flex-col justify-center gap-4">
              {(() => {
                const otherOrders = BRANCH_MARKERS.slice(4).reduce((s, b) => s + b.orders, 0)
                const sidebarItems = [
                  ...BRANCH_MARKERS.slice(0, 4),
                  { name: 'Other Cities', coordinates: [0, 0] as [number, number], color: '#CBD5E1', orders: otherOrders },
                ]
                return sidebarItems.map((b) => {
                  const pct = Math.round((b.orders / BRANCH_TOTAL) * 100)
                  return (
                    <div key={b.name} className="group">
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="text-coal font-medium flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                          {b.name}
                        </span>
                        <span className="text-coal-muted font-semibold">{b.orders} <span className="text-coal-dim font-normal">· {pct}%</span></span>
                      </div>
                      <div className="w-full h-2 bg-paper-line rounded-full overflow-hidden" title={`${b.name}: ${b.orders} orders (${pct}%)`}>
                        <div
                          className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                          style={{ width: `${pct}%`, backgroundColor: b.color }}
                        />
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section B: Activity · Best Sellers · Categories · Traffic (equal-height row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-paper-line shrink-0">
            <h2 className="text-[13px] font-semibold text-coal">Recent Activity</h2>
          </div>
          <div className="divide-y divide-paper-line overflow-y-auto max-h-[260px]">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-paper-soft transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                  <item.Icon size={13} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-coal leading-snug">{item.text}</div>
                  <div className="text-[11px] text-coal-dim truncate mt-0.5">{item.sub}</div>
                  <div className="text-[10px] text-coal-dim mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-paper-line flex items-center justify-between shrink-0">
            <h2 className="text-[13px] font-semibold text-coal">Best Sellers</h2>
            <button onClick={() => navigate('/products')} className="text-[11px] text-carrot font-semibold hover:text-carrot-deep">
              View All →
            </button>
          </div>
          <div className="divide-y divide-paper-line overflow-y-auto max-h-[260px]">
            {BEST_SELLERS.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper-soft transition-colors">
                <span className="text-[12px] font-bold text-coal-dim w-4 flex-shrink-0">#{item.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-coal truncate">{item.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? 'bg-paper-soft text-coal-muted'}`}>
                      {item.type}
                    </span>
                    <span className="text-[11px] text-coal-dim">{item.units} units</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-coal flex-shrink-0">{formatPrice(item.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-paper-line flex items-center justify-between shrink-0">
            <h2 className="text-[13px] font-semibold text-coal">Top Categories</h2>
            <button onClick={() => navigate('/products')} className="text-[11px] text-carrot font-semibold hover:text-carrot-deep">
              View All →
            </button>
          </div>
          <div className="divide-y divide-paper-line overflow-y-auto max-h-[260px]">
            {TOP_CATEGORIES.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper-soft transition-colors">
                <span className="text-[12px] font-bold text-coal-dim w-4 flex-shrink-0">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-coal">{cat.name}</div>
                  <div className="text-[10px] text-coal-dim">{cat.units} units sold</div>
                </div>
                <div className="text-[11px] font-bold text-coal text-right flex-shrink-0">
                  {formatPrice(cat.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl border border-paper-line shadow-sm p-5 flex flex-col">
          <div className="shrink-0">
            <h2 className="text-[13px] font-semibold text-coal">Traffic Sources</h2>
            <p className="text-[11px] text-coal-muted mt-0.5">Where visitors come from</p>
          </div>
          <div className="flex flex-col gap-3.5 pt-3">
            {TRAFFIC_DATA.map((t) => (
              <div key={t.source} className="group" title={`${t.source}: ${t.visits.toLocaleString()} visits (${t.pct}%)`}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-coal font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                    {t.source}
                  </span>
                  <span className="text-coal-muted font-semibold">{t.pct}%</span>
                </div>
                <div className="w-full h-2 bg-paper-line rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full group-hover:brightness-110"
                    style={{ width: `${t.pct}%`, backgroundColor: t.color, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </div>
                <div className="text-[11px] text-coal-dim mt-0.5">{t.visits.toLocaleString()} visits</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Section C: Order Status + Recent Orders table ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">

        {/* Order Status donut */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-paper-line shadow-sm p-5 flex flex-col h-full">
          <div className="shrink-0">
            <h2 className="text-[13px] font-semibold text-coal">Order Status</h2>
            <p className="text-[11px] text-coal-muted mt-0.5">Breakdown by status</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0 py-2">
            <div className="relative">
              <PieChart width={150} height={150}>
                <Pie
                  data={statusCounts} cx="50%" cy="50%"
                  innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value"
                  animationBegin={0} animationDuration={1000} animationEasing="ease-out"
                >
                  {statusCounts.map((e) => <Cell key={e.name} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-coal">{totalForDonut}</span>
                <span className="text-[9px] text-coal-muted font-semibold uppercase tracking-wide">Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5 shrink-0">
            {statusCounts.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] text-coal-muted">{s.name}</span>
                </div>
                <span className="text-[12px] font-semibold text-coal">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders table — spans 3 columns */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-paper-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="px-5 py-4 border-b border-paper-line flex items-center justify-between shrink-0">
          <h2 className="text-[14px] font-semibold text-coal">Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="text-[12px] text-carrot font-semibold hover:text-carrot-deep transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-paper-line bg-[#FAFAFA]">
                {['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-coal-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderNumber} className="border-b border-paper-line last:border-0 hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[12px] text-carrot font-semibold">{order.orderNumber}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-coal">{order.name}</div>
                    <div className="text-coal-dim text-[11px]">{order.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-coal-muted">{order.items.reduce((s, i) => s + i.qty, 0)} item(s)</td>
                  <td className="px-5 py-3.5 font-semibold text-coal">{formatPrice(order.subtotal)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3.5 text-coal-muted text-[12px]">
                    {new Date(order.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/orders/${order.orderNumber}`)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-coal-muted hover:text-carrot hover:bg-carrot-wash transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-coal-muted">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>

    </div>
  )
}
