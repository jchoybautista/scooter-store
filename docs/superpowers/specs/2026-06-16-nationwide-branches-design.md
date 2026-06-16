# Nationwide Branch Expansion — Design Spec

**Date:** 2026-06-16  
**Status:** Approved

## Overview

Expand Velocità's pickup locations from 5 Metro Manila branches to 24 branches nationwide (Luzon, Visayas, Mindanao). Reflects in the storefront pickup dropdown and the admin dashboard Sales by Location map + sidebar.

---

## 1. Branch Data (`src/lib/branches.ts`)

Extend the existing `BRANCHES` array from 5 to 24 entries. No schema change — same shape: `id`, `name`, `address`, `hours`.

### Existing Metro Manila (keep as-is)
| id | name |
|---|---|
| pasig | Pasig Branch |
| makati | Makati Branch |
| bgc | BGC Branch |
| qc | Quezon City Branch |
| mandaluyong | Mandaluyong Branch |

### New — Luzon (5)
| id | name | address |
|---|---|---|
| baguio | Baguio City Branch | Session Rd, Baguio City, Benguet |
| angeles | Angeles City Branch | MacArthur Hwy, Balibago, Angeles City, Pampanga |
| san-fernando-la-union | San Fernando Branch | Quezon Ave, San Fernando City, La Union |
| batangas | Batangas City Branch | P. Burgos St, Batangas City |
| naga | Naga City Branch | Elias Angeles St, Naga City, Camarines Sur |

### New — Visayas (7)
| id | name | address |
|---|---|---|
| cebu | Cebu City Branch | Colon St, Downtown Cebu City |
| mandaue | Mandaue City Branch | A.C. Cortes Ave, Mandaue City, Cebu |
| lapu-lapu | Lapu-Lapu City Branch | M.L. Quezon National Hwy, Lapu-Lapu City, Cebu |
| iloilo | Iloilo City Branch | Iznart St, Iloilo City |
| bacolod | Bacolod City Branch | Lacson St, Bacolod City, Negros Occidental |
| tacloban | Tacloban City Branch | Justice Romualdez St, Tacloban City, Leyte |
| dumaguete | Dumaguete City Branch | Perdices St, Dumaguete City, Negros Oriental |

### New — Mindanao (7)
| id | name | address |
|---|---|---|
| davao | Davao City Branch | JP Laurel Ave, Davao City |
| cdo | Cagayan de Oro Branch | Corrales Ave, Cagayan de Oro City |
| gensan | General Santos City Branch | National Hwy, General Santos City |
| iligan | Iligan City Branch | Quezon Ave, Iligan City, Lanao del Norte |
| zamboanga | Zamboanga City Branch | Governor Lim Ave, Zamboanga City |
| butuan | Butuan City Branch | J.C. Aquino Ave, Butuan City, Agusan del Norte |
| koronadal | Koronadal City Branch | Alunan Ave, Koronadal City, South Cotabato |

**All hours:** `Mon–Sat · 9am–6pm` (matching existing pattern).

---

## 2. Storefront Pickup Dropdown (`BranchSelect.tsx`)

- Display all 24 branches sorted **alphabetically by name** as a flat list.
- No region grouping.
- Component structure and styling unchanged — just more entries.
- Used in: Cart page, Checkout page, ProductDetail page (scooter only).

---

## 3. Admin Dashboard — Map (`Dashboard.tsx`)

### `BRANCH_MARKERS` array

Replace the current 5-entry array with all 24 cities. Each entry: `name`, `coordinates: [lng, lat]`, `color`, `orders` (sample data), `pct` (of total).

**Coordinates:**

| City | lng | lat | Sample orders |
|---|---|---|---|
| Makati | 121.0244 | 14.5547 | 47 |
| BGC | 121.0509 | 14.5490 | 38 |
| Pasig | 121.0851 | 14.5764 | 24 |
| Quezon City | 121.0437 | 14.6760 | 16 |
| Mandaluyong | 121.0359 | 14.5794 | 10 |
| Baguio City | 120.5960 | 16.4023 | 12 |
| Angeles City | 120.5822 | 15.1450 | 9 |
| San Fernando | 120.3172 | 16.6159 | 7 |
| Batangas City | 121.0500 | 13.7565 | 11 |
| Naga City | 123.7528 | 13.6192 | 8 |
| Cebu City | 123.8907 | 10.3157 | 21 |
| Mandaue City | 123.9247 | 10.3236 | 14 |
| Lapu-Lapu City | 123.9629 | 10.3103 | 9 |
| Iloilo City | 122.5621 | 10.7202 | 13 |
| Bacolod City | 122.9498 | 10.6713 | 10 |
| Tacloban City | 125.0028 | 11.2543 | 7 |
| Dumaguete City | 123.3068 | 9.3068 | 6 |
| Davao City | 125.6128 | 7.1907 | 18 |
| Cagayan de Oro | 124.6563 | 8.4822 | 15 |
| General Santos | 125.1716 | 6.1164 | 11 |
| Iligan City | 124.2452 | 8.2280 | 8 |
| Zamboanga City | 122.0739 | 6.9214 | 9 |
| Butuan City | 125.5406 | 8.9475 | 7 |
| Koronadal City | 124.8468 | 6.4984 | 6 |

**Total orders (all branches):** 336

### Map rendering

- Each marker renders as a **small circle dot** on the Philippines SVG map (projected via `geoMercator`).
- All dots are static — no pulsing animation. Having 5 Metro Manila dots pulse in a tiny cluster would look noisy.
- Each dot is hoverable: a small tooltip shows `{city} · {orders} orders`.
- Dot color: use a consistent color scheme — Metro Manila in `#F95D0E` (carrot), Luzon in `#3B82F6` (blue), Visayas in `#10B981` (green), Mindanao in `#8B5CF6` (purple). This adds visual regional distinction on the map without requiring a legend.

### MapTooltip

- Remove the existing hardcoded "Metro Manila" cluster tooltip.
- Replace with a generic per-dot tooltip: `{name} · {orders} orders`.
- Same dark card style as before.

---

## 4. Admin Dashboard — Sidebar (Sales by Location)

The sidebar always renders exactly **5 rows**:

| Row | Label | Orders | % |
|---|---|---|---|
| 1 | Makati | 47 | computed from total |
| 2 | BGC | 38 | computed |
| 3 | Pasig | 24 | computed |
| 4 | Quezon City | 16 | computed |
| 5 | **Other Cities** | 211 (336 - 47 - 38 - 24 - 16) | computed |

- "Other Cities" uses a neutral color: `#CBD5E1` (slate-300).
- Progress bar widths are computed from `BRANCH_TOTAL` (sum of all 24 branches).
- The subtitle updates to: `"Nationwide branches — hover the map for details"`.
- `BRANCH_TOTAL` is recalculated as the sum of all 24 marker `orders` values.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/branches.ts` | Add 19 new branches |
| `src/storefront/components/BranchSelect.tsx` | Sort alphabetically |
| `admin/src/pages/Dashboard.tsx` | Replace `BRANCH_MARKERS`, update map rendering, update sidebar to top-4 + Other Cities, update subtitle |

No new files. No schema changes to cart/orders data.

---

## Out of Scope

- No real order data for new cities — all new branch orders are sample/static numbers.
- No region grouping in the storefront dropdown.
- No new admin pages or routes.
- No change to checkout flow logic.
