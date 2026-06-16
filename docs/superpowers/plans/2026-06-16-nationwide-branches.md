# Nationwide Branch Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Velocità from 5 Metro Manila branches to 24 nationwide branches, reflected in the storefront pickup dropdown and the admin dashboard map + sidebar.

**Architecture:** Branch data lives in `src/lib/branches.ts` (storefront source of truth). The admin dashboard maintains its own `BRANCH_MARKERS` array (coordinates + sample orders) independent of the storefront file. Storefront dropdowns sort alphabetically at render time. Admin map renders one static dot per city; sidebar always shows the top-4 cities by name plus an "Other Cities" aggregate row.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, d3-geo (admin map projection)

---

## File Map

| File | Change |
|---|---|
| `src/lib/branches.ts` | Add 19 new branches (Luzon / Visayas / Mindanao) |
| `src/storefront/components/BranchSelect.tsx` | Sort list alphabetically at render |
| `src/storefront/pages/Checkout.tsx` | Sort inline branch list alphabetically at render |
| `admin/src/pages/Dashboard.tsx` | Replace BRANCH_MARKERS, refactor PhilippinesMap to multi-dot, update sidebar |

---

## Task 1: Expand `src/lib/branches.ts` with 19 new branches

**Files:**
- Modify: `src/lib/branches.ts`

- [ ] **Step 1: Replace the file contents**

```ts
export const BRANCHES = [
  // Metro Manila (existing)
  { id: 'pasig',        name: 'Pasig Branch',             address: 'Pioneer St, Kapitolyo, Pasig City',                        hours: 'Mon–Sat · 9am–6pm' },
  { id: 'makati',       name: 'Makati Branch',            address: 'Chino Roces Ave, Pio del Pilar, Makati City',              hours: 'Mon–Sat · 9am–6pm' },
  { id: 'bgc',          name: 'BGC Branch',               address: '5th Ave, Bonifacio Global City, Taguig',                   hours: 'Mon–Sun · 10am–7pm' },
  { id: 'qc',           name: 'Quezon City Branch',       address: 'Timog Ave, South Triangle, Quezon City',                   hours: 'Mon–Sat · 9am–6pm' },
  { id: 'mandaluyong',  name: 'Mandaluyong Branch',       address: 'Shaw Blvd, Wack-Wack, Mandaluyong City',                   hours: 'Mon–Sat · 9am–6pm' },
  // Luzon
  { id: 'baguio',       name: 'Baguio City Branch',       address: 'Session Rd, Baguio City, Benguet',                        hours: 'Mon–Sat · 9am–6pm' },
  { id: 'angeles',      name: 'Angeles City Branch',      address: 'MacArthur Hwy, Balibago, Angeles City, Pampanga',         hours: 'Mon–Sat · 9am–6pm' },
  { id: 'san-fernando', name: 'San Fernando Branch',      address: 'Quezon Ave, San Fernando City, La Union',                 hours: 'Mon–Sat · 9am–6pm' },
  { id: 'batangas',     name: 'Batangas City Branch',     address: 'P. Burgos St, Batangas City',                             hours: 'Mon–Sat · 9am–6pm' },
  { id: 'naga',         name: 'Naga City Branch',         address: 'Elias Angeles St, Naga City, Camarines Sur',              hours: 'Mon–Sat · 9am–6pm' },
  // Visayas
  { id: 'cebu',         name: 'Cebu City Branch',         address: 'Colon St, Downtown Cebu City',                            hours: 'Mon–Sat · 9am–6pm' },
  { id: 'mandaue',      name: 'Mandaue City Branch',      address: 'A.C. Cortes Ave, Mandaue City, Cebu',                     hours: 'Mon–Sat · 9am–6pm' },
  { id: 'lapu-lapu',    name: 'Lapu-Lapu City Branch',    address: 'M.L. Quezon National Hwy, Lapu-Lapu City, Cebu',         hours: 'Mon–Sat · 9am–6pm' },
  { id: 'iloilo',       name: 'Iloilo City Branch',       address: 'Iznart St, Iloilo City',                                  hours: 'Mon–Sat · 9am–6pm' },
  { id: 'bacolod',      name: 'Bacolod City Branch',      address: 'Lacson St, Bacolod City, Negros Occidental',              hours: 'Mon–Sat · 9am–6pm' },
  { id: 'tacloban',     name: 'Tacloban City Branch',     address: 'Justice Romualdez St, Tacloban City, Leyte',              hours: 'Mon–Sat · 9am–6pm' },
  { id: 'dumaguete',    name: 'Dumaguete City Branch',    address: 'Perdices St, Dumaguete City, Negros Oriental',            hours: 'Mon–Sat · 9am–6pm' },
  // Mindanao
  { id: 'davao',        name: 'Davao City Branch',        address: 'JP Laurel Ave, Davao City',                               hours: 'Mon–Sat · 9am–6pm' },
  { id: 'cdo',          name: 'Cagayan de Oro Branch',    address: 'Corrales Ave, Cagayan de Oro City',                       hours: 'Mon–Sat · 9am–6pm' },
  { id: 'gensan',       name: 'General Santos City Branch', address: 'National Hwy, General Santos City',                    hours: 'Mon–Sat · 9am–6pm' },
  { id: 'iligan',       name: 'Iligan City Branch',       address: 'Quezon Ave, Iligan City, Lanao del Norte',                hours: 'Mon–Sat · 9am–6pm' },
  { id: 'zamboanga',    name: 'Zamboanga City Branch',    address: 'Governor Lim Ave, Zamboanga City',                        hours: 'Mon–Sat · 9am–6pm' },
  { id: 'butuan',       name: 'Butuan City Branch',       address: 'J.C. Aquino Ave, Butuan City, Agusan del Norte',         hours: 'Mon–Sat · 9am–6pm' },
  { id: 'koronadal',    name: 'Koronadal City Branch',    address: 'Alunan Ave, Koronadal City, South Cotabato',              hours: 'Mon–Sat · 9am–6pm' },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/branches.ts
git commit -m "feat: expand branches to 24 nationwide locations"
```

---

## Task 2: Sort branch dropdowns alphabetically in storefront

**Files:**
- Modify: `src/storefront/components/BranchSelect.tsx:44`
- Modify: `src/storefront/pages/Checkout.tsx:226`

- [ ] **Step 1: Sort in `BranchSelect.tsx`**

In [BranchSelect.tsx](src/storefront/components/BranchSelect.tsx), find the dropdown list render at line 44:
```tsx
{BRANCHES.map((b) => (
```
Replace with:
```tsx
{[...BRANCHES].sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
```

- [ ] **Step 2: Sort in `Checkout.tsx`**

In [Checkout.tsx](src/storefront/pages/Checkout.tsx), find the inline branch list at line 226:
```tsx
{BRANCHES.map((b) => (
```
Replace with:
```tsx
{[...BRANCHES].sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/storefront/components/BranchSelect.tsx src/storefront/pages/Checkout.tsx
git commit -m "feat: sort pickup branch dropdown alphabetically"
```

---

## Task 3: Replace `BRANCH_MARKERS` in admin Dashboard with all 24 cities

**Files:**
- Modify: `admin/src/pages/Dashboard.tsx:57-64`

- [ ] **Step 1: Replace the `BRANCH_MARKERS` constant and `BRANCH_TOTAL`**

In [Dashboard.tsx](admin/src/pages/Dashboard.tsx), find and replace from line 57 (`// Metro Manila branches...`) through the `BRANCH_TOTAL` line:

```tsx
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
```

Also delete the now-unused `METRO_MANILA` constant (line 70: `const METRO_MANILA: [number, number] = [121.0, 14.6]`).

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store/admin
npx tsc --noEmit
```
Expected: errors only if `METRO_MANILA` or old `pct` references remain — fix those before continuing.

- [ ] **Step 3: Commit**

```bash
git add admin/src/pages/Dashboard.tsx
git commit -m "feat(admin): replace BRANCH_MARKERS with 24 nationwide cities"
```

---

## Task 4: Refactor `PhilippinesMap` to render one dot per city

**Files:**
- Modify: `admin/src/pages/Dashboard.tsx` — `MapTooltip` function + `PhilippinesMap` function

- [ ] **Step 1: Replace `MapTooltip` with `MapDotTooltip`**

Find the `function MapTooltip(...)` block (lines 93–110) and replace entirely with:

```tsx
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
```

- [ ] **Step 2: Replace the `PhilippinesMap` component**

Find the `function PhilippinesMap()` block (lines 112–160) and replace entirely with:

```tsx
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store/admin
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add admin/src/pages/Dashboard.tsx
git commit -m "feat(admin): multi-dot Philippines map — one dot per city"
```

---

## Task 5: Update admin sidebar — top 4 cities + "Other Cities"

**Files:**
- Modify: `admin/src/pages/Dashboard.tsx` — Sales by Location card header and sidebar

- [ ] **Step 1: Update the card subtitle**

Find the subtitle in the "Sales by Location" card header (line ~425):
```tsx
<p className="text-[11px] text-coal-muted mt-0.5">Orders by Metro Manila branch — hover the map for details</p>
```
Replace with:
```tsx
<p className="text-[11px] text-coal-muted mt-0.5">Nationwide branches — hover the map for details</p>
```

- [ ] **Step 2: Replace sidebar rendering**

Find the sidebar `{BRANCH_MARKERS.map((b) => (` block (lines ~438–456) and replace the entire map call with:

```tsx
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store/admin
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add admin/src/pages/Dashboard.tsx
git commit -m "feat(admin): sidebar shows top-4 cities + Other Cities aggregate"
```

---

## Task 6: Smoke-test both apps

- [ ] **Step 1: Run storefront dev server and verify dropdown**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store
npm run dev
```

Open `http://localhost:5173`, add a scooter to cart, go to Cart page. Open the pickup branch dropdown and confirm:
- All 24 branches are listed
- They appear in alphabetical order (Angeles City first, Zamboanga City last)
- Address and hours show correctly for whichever branch is selected

- [ ] **Step 2: Verify Checkout branch dropdown**

Go to Checkout. Confirm the branch dropdown also shows all 24 branches in alphabetical order.

- [ ] **Step 3: Run admin dev server and verify map + sidebar**

```bash
cd /Users/jonathanbautista/Documents/Work/AI/scooter-store/admin
npm run dev
```

Open the admin dashboard. Confirm:
- The Philippines map loads with ~24 visible dots spread across Luzon, Visayas, and Mindanao
- Hovering each dot shows a tooltip with the city name and order count
- The sidebar shows exactly 5 rows: Makati, BGC, Pasig, Quezon City, Other Cities
- "Other Cities" shows 211 orders
- Progress bars are proportional to total (336 orders)
- Subtitle reads "Nationwide branches — hover the map for details"

- [ ] **Step 4: Final commit (if any cleanup needed)**

```bash
git add -p   # stage any leftover fixes
git commit -m "fix: smoke-test cleanup"
```
