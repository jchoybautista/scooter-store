-- Velocità — seed data (mirrors src/data/seed.ts)
-- Run after schema.sql. Safe to re-run: uses upserts on primary key.

insert into brands (id, name, slug, country, accent, description) values
  ('b-vespa','Vespa','vespa','Italy','#4FB286','The icon of Italian mobility since 1946 — timeless lines, effortless ride, unmistakable character.'),
  ('b-lambretta','Lambretta','lambretta','Italy','#E63946','Milanese style and mod-culture heritage, reborn with modern engineering and sharp tailoring.'),
  ('b-italjet','Italjet','italjet','Italy','#F4A300','Bologna''s boldest — exposed trellis frames and front-suspension design that rides like nothing else.'),
  ('b-honda','Honda','honda','Japan','#457B9D','Legendary reliability meets retro charm — refined engineering for the modern city commuter.')
on conflict (id) do update set
  name = excluded.name, slug = excluded.slug, country = excluded.country,
  accent = excluded.accent, description = excluded.description;

insert into categories (id, name, slug, type) values
  ('c-scooter','Scooters','scooters','scooter'),
  ('c-part','Parts','parts','part'),
  ('c-accessory','Accessories','accessories','accessory'),
  ('c-warranty','Warranties','warranties','warranty')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, type = excluded.type;

insert into warranty_plans (id, name, duration_months, price, coverage) values
  ('w-1y','Velocità Care — 1 Year',12,199,'Engine, transmission & electrical defects. Roadside assistance included.'),
  ('w-2y','Velocità Care+ — 2 Years',24,349,'Everything in Care, plus wear components and annual service credit.'),
  ('w-3y','Velocità Prestige — 3 Years',36,499,'Full bumper-to-bumper coverage, priority service & loaner scooter.')
on conflict (id) do update set
  name = excluded.name, duration_months = excluded.duration_months,
  price = excluded.price, coverage = excluded.coverage;

insert into products (id, name, slug, brand_id, category_id, type, price, sale_price, description, specs, images, stock, featured, status, created_at) values
  ('p-vespa-gts300','Vespa GTS 300 Super','vespa-gts-300-super','b-vespa','c-scooter','scooter',7899,null,'The flagship of the Vespa range. A 300cc HPE engine, full LED lighting and a hand-welded steel body deliver the most powerful, refined Vespa ever built.','{"Engine":"278cc HPE","Power":"23.5 hp","Top speed":"128 km/h","Weight":"158 kg","Brakes":"ABS disc"}','{/images/scooters/vespa-gts300.jpg}',6,true,'active',now() - interval '4 days'),
  ('p-vespa-primavera','Vespa Primavera 150','vespa-primavera-150','b-vespa','c-scooter','scooter',5499,4999,'Light, agile and endlessly charming. The Primavera 150 pairs a peppy i-get engine with the timeless silhouette that made Vespa a legend.','{"Engine":"155cc i-get","Power":"13 hp","Top speed":"95 km/h","Weight":"117 kg","Brakes":"ABS front disc"}','{/images/scooters/vespa-primavera.jpg}',12,true,'active',now() - interval '9 days'),
  ('p-vespa-sprint50','Vespa Sprint 50','vespa-sprint-50','b-vespa','c-scooter','scooter',4299,null,'Sporty attitude in a compact package. Square headlight, racing stance and a frugal 50cc engine perfect for the city.','{"Engine":"49cc i-get","Power":"3.5 hp","Top speed":"45 km/h","Weight":"110 kg","Brakes":"Front disc"}','{/images/scooters/vespa-sprint50.jpg}',18,false,'active',now() - interval '20 days'),
  ('p-lambretta-v200','Lambretta V200 Special','lambretta-v200-special','b-lambretta','c-scooter','scooter',5199,null,'Tailored in Milan. The V200 Special blends mod-era proportions with a smooth 169cc engine and bespoke colour-matched panels.','{"Engine":"169cc","Power":"12.4 hp","Top speed":"105 km/h","Weight":"130 kg","Brakes":"CBS disc"}','{/images/scooters/lambretta-v200.jpg}',8,true,'active',now() - interval '6 days'),
  ('p-lambretta-g350','Lambretta G350','lambretta-g350','b-lambretta','c-scooter','scooter',6499,null,'The grand tourer of the range. A torquey 330cc engine and sculpted bodywork for confident long-distance cruising.','{"Engine":"330cc","Power":"28.6 hp","Top speed":"137 km/h","Weight":"151 kg","Brakes":"ABS dual disc"}','{/images/scooters/lambretta-g350.jpg}',5,false,'active',now() - interval '15 days'),
  ('p-italjet-dragster','Italjet Dragster 200','italjet-dragster-200','b-italjet','c-scooter','scooter',7299,null,'A two-wheeled supercar. The exposed trellis frame and patented front suspension make the Dragster the sharpest-handling scooter on the road.','{"Engine":"181cc","Power":"20.5 hp","Top speed":"125 km/h","Weight":"125 kg","Brakes":"Radial ABS"}','{/images/scooters/italjet-dragster.jpg}',4,true,'active',now() - interval '2 days'),
  ('p-italjet-scooop','Italjet Scooop 125','italjet-scooop-125','b-italjet','c-scooter','scooter',4799,4399,'Retro-futurist commuter with playful curves and a punchy 125cc heart. Distinctive, practical and pure fun.','{"Engine":"125cc","Power":"11 hp","Top speed":"90 km/h","Weight":"119 kg","Brakes":"CBS disc"}','{/images/scooters/italjet-scooop.jpg}',10,false,'active',now() - interval '11 days'),
  ('p-honda-giorno','Honda Giorno+','honda-giorno-plus','b-honda','c-scooter','scooter',3499,null,'Retro pastel charm meets Honda dependability. The Giorno+ is the friendliest way to glide through the city in style.','{"Engine":"124cc eSP","Power":"8.8 hp","Top speed":"85 km/h","Weight":"95 kg","Brakes":"CBS front disc"}','{/images/scooters/honda-giorno.jpg}',22,true,'active',now() - interval '7 days'),
  ('p-honda-forza350','Honda Forza 350','honda-forza-350','b-honda','c-scooter','scooter',6199,null,'The maxi-scooter benchmark. Electric screen, Smart Key and a refined 330cc engine for effortless touring and commuting alike.','{"Engine":"330cc eSP+","Power":"28.8 hp","Top speed":"137 km/h","Weight":"184 kg","Brakes":"Dual ABS disc"}','{/images/scooters/honda-forza350.jpg}',9,false,'active',now() - interval '18 days'),
  ('p-part-exhaust','Akra Sport Exhaust — Vespa','akra-sport-exhaust-vespa','b-vespa','c-part','part',389,null,'Hand-finished stainless performance exhaust. Adds top-end power and a deeper, sportier note. Bolt-on fit for GTS/GTV.','{"Material":"Stainless steel","Fitment":"Vespa GTS/GTV 300","Gain":"+1.8 hp"}','{/images/parts/exhaust.jpg}',30,false,'active',now() - interval '25 days'),
  ('p-part-caliper','Brembo Brake Caliper Kit','brembo-brake-caliper-kit','b-lambretta','c-part','part',245,null,'Upgrade your stopping power with a 4-piston Brembo caliper and braided line kit. Precision feel, fade-free performance.','{"Pistons":"4","Fitment":"Lambretta V-series","Includes":"Caliper + braided line"}','{}',24,false,'active',now() - interval '28 days'),
  ('p-part-airfilter','Racing Air Filter — Italjet','racing-air-filter-italjet','b-italjet','c-part','part',129,99,'High-flow washable cotton filter. Improves throttle response and is good for the life of the scooter.','{"Type":"Washable cotton","Fitment":"Italjet Dragster","Reusable":"Yes"}','{}',40,false,'active',now() - interval '30 days'),
  ('p-acc-topcase','Leather Top Case — 32L','leather-top-case-32l','b-vespa','c-accessory','accessory',299,null,'Hand-stitched full-grain leather top case with a quick-release mount. Holds a full-face helmet with room to spare.','{"Capacity":"32 L","Material":"Full-grain leather","Mount":"Quick-release"}','{}',16,false,'active',now() - interval '12 days'),
  ('p-acc-helmet','Vintage Bubble Helmet','vintage-bubble-helmet','b-honda','c-accessory','accessory',189,159,'Retro bubble-visor helmet with modern ECE safety certification. Timeless looks, contemporary protection.','{"Safety":"ECE 22.06","Visor":"Bubble (tinted)","Weight":"1.1 kg"}','{/images/accessories/helmet.jpg}',35,false,'active',now() - interval '14 days'),
  ('p-acc-grips','Heated Handlebar Grips','heated-handlebar-grips','b-honda','c-accessory','accessory',89,null,'Five-level heated grips for year-round riding comfort. Universal fit with a discreet inline controller.','{"Levels":"5","Fit":"Universal 22mm","Power":"12V"}','{/images/accessories/grips.jpg}',50,false,'active',now() - interval '21 days'),
  ('p-acc-tires','Whitewall Tire Set','whitewall-tire-set','b-lambretta','c-accessory','accessory',219,null,'Classic whitewall tires that finish any retro build. Premium compound for confident grip in the wet and dry.','{"Size":"110/70-12","Set":"Front + rear","Style":"Whitewall"}','{}',20,false,'active',now() - interval '23 days'),
  ('p-war-care','Velocità Care — 1 Year','velocita-care-1-year','b-vespa','c-warranty','warranty',199,null,'Twelve months of peace of mind. Covers engine, transmission and electrical defects, with 24/7 roadside assistance.','{"Term":"12 months","Roadside":"Included","Transferable":"Yes"}','{}',999,false,'active',now() - interval '40 days'),
  ('p-war-prestige','Velocità Prestige — 3 Year','velocita-prestige-3-year','b-italjet','c-warranty','warranty',499,null,'Our most complete cover: three years bumper-to-bumper, priority servicing and a loaner scooter when yours is in the shop.','{"Term":"36 months","Servicing":"Priority","Loaner":"Included"}','{}',999,false,'active',now() - interval '42 days')
on conflict (id) do update set
  name = excluded.name, slug = excluded.slug, brand_id = excluded.brand_id,
  category_id = excluded.category_id, type = excluded.type, price = excluded.price,
  sale_price = excluded.sale_price, description = excluded.description, specs = excluded.specs,
  stock = excluded.stock, featured = excluded.featured, status = excluded.status;
