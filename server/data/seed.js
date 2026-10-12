const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const clothesProducts = [
  {
    name: 'Men Slim Fit Pure Cotton Casual Shirt',
    brand: 'Roadster',
    category: 'Clothes',
    price: 899,
    oldPrice: 1999,
    rating: 4.3,
    reviewCount: 1420,
    colors: ['Navy Blue', 'Olive Green', 'White', 'Maroon'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: {
      fabric: 'Pure Cotton',
      gender: 'Men',
      fit: 'Slim Fit',
      collar: 'Spread Collar',
      sleeve: 'Long Sleeves',
      pattern: 'Solid'
    },
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 899, url: '#' },
      { name: 'Myntra Mart', price: 949, url: 'https://www.myntra.com' },
      { name: 'Ajio Trends', price: 999, url: 'https://www.ajio.com' }
    ],
    description: 'Crisp, breathable 100% combed cotton casual shirt engineered for everyday versatile comfort and sharp styling.',
    popularity: 92
  },
  {
    name: 'Women Floral Print A-Line Midi Dress',
    brand: 'ZaraStyle',
    category: 'Clothes',
    price: 1499,
    oldPrice: 2799,
    rating: 4.5,
    reviewCount: 980,
    colors: ['Pastel Pink', 'Sky Blue', 'Mint Green'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: {
      fabric: 'Georgette Rayon',
      gender: 'Women',
      fit: 'A-Line Flared',
      neck: 'V-Neck',
      length: 'Midi',
      pattern: 'Floral Print'
    },
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1499, url: '#' },
      { name: 'Nykaa Fashion', price: 1549, url: 'https://www.nykaafashion.com' },
      { name: 'Tata CliQ Luxury', price: 1699, url: 'https://www.tatacliq.com' }
    ],
    description: 'An ethereal printed midi dress crafted from ultra-lightweight drape georgette with a cinched waistline.',
    popularity: 88
  },
  {
    name: 'Unisex Heavyweight Oversized Graphic Hoodie',
    brand: 'UrbanCraft',
    category: 'Clothes',
    price: 1899,
    oldPrice: 3499,
    rating: 4.6,
    reviewCount: 2310,
    colors: ['Charcoal Black', 'Heather Grey', 'Beige', 'Sage Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: {
      fabric: 'French Terry Cotton Fleece 380 GSM',
      gender: 'Unisex',
      fit: 'Oversized Boxy',
      hood: 'Double-Layered Hood',
      pockets: 'Kangaroo Pocket'
    },
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1899, url: '#' },
      { name: 'Bewakoof Club', price: 1999, url: 'https://www.bewakoof.com' },
      { name: 'Urban Outfitters', price: 2199, url: '#' }
    ],
    description: 'Premium heavyweight cotton fleece hoodie featuring drop shoulders, reinforced ribbed trims and plush inner lining.',
    popularity: 96
  },
  {
    name: 'Men Tapered Stretch Denim Jeans',
    brand: 'LeviCraft',
    category: 'Clothes',
    price: 2499,
    oldPrice: 4299,
    rating: 4.4,
    reviewCount: 3100,
    colors: ['Dark Indigo', 'Faded Stone Wash', 'Jet Black'],
    sizes: ['30', '32', '34', '36', '38'],
    features: {
      fabric: '98% Cotton 2% Elastane',
      gender: 'Men',
      fit: 'Slim Tapered',
      rise: 'Mid Rise',
      stretch: 'Active Stretch 4-Way'
    },
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 2499, url: '#' },
      { name: 'Shoppers Hub', price: 2599, url: '#' },
      { name: 'Lifestyle Mart', price: 2799, url: '#' }
    ],
    description: 'Iconic stretch denim jeans with whiskers and gentle hand-scraping for that lived-in appeal and day-long flexible movement.',
    popularity: 91
  },
  {
    name: 'Women High-Waist Seamless Active Leggings',
    brand: 'FlexFit',
    category: 'Clothes',
    price: 1199,
    oldPrice: 2299,
    rating: 4.7,
    reviewCount: 1650,
    colors: ['Burgundy', 'Midnight Blue', 'Jet Black', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: {
      fabric: '75% Nylon 25% Spandex',
      gender: 'Women',
      fit: 'Compression High-Waist',
      stretch: 'Squat-Proof 4-Way Stretch',
      pockets: 'Dual Side Phone Pockets'
    },
    images: [
      'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1199, url: '#' },
      { name: 'Decathlon Online', price: 1249, url: 'https://www.decathlon.in' },
      { name: 'CultSport Store', price: 1399, url: '#' }
    ],
    description: 'Buttery soft seamless performance leggings engineered with sweat-wicking dry-touch fibers and wide tummy-tuck waistband.',
    popularity: 94
  },
  {
    name: 'Men Lightweight Waterproof Bomber Jacket',
    brand: 'Wanderer',
    category: 'Clothes',
    price: 2999,
    oldPrice: 5999,
    rating: 4.5,
    reviewCount: 840,
    colors: ['Military Green', 'Carbon Black', 'Khaki'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    features: {
      fabric: 'Ripstop Polyester DWR Coated',
      gender: 'Men',
      fit: 'Regular Fit',
      waterproof: 'Light Rain Resistant',
      lining: 'Breathable Mesh'
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 2999, url: '#' },
      { name: 'Woodland Store', price: 3199, url: '#' }
    ],
    description: 'Weatherproof bomber jacket with sleek metallic hardware, zippered side pockets, and wind-cheating ribbed cuffs.',
    popularity: 87
  },
  {
    name: 'Women Pure Linen Casual Button-Down Shirt',
    brand: 'FabLinen',
    category: 'Clothes',
    price: 1799,
    oldPrice: 3199,
    rating: 4.6,
    reviewCount: 710,
    colors: ['Off-White', 'Blush Coral', 'Sky Blue', 'Sand Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: {
      fabric: '100% French Flax Linen',
      gender: 'Women',
      fit: 'Relaxed Breezy Fit',
      collar: 'Mandarin Collar',
      sleeve: 'Roll-Up 3/4 Sleeves'
    },
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1799, url: '#' },
      { name: 'Westside Fashion', price: 1899, url: '#' }
    ],
    description: 'Refined pure linen blouse woven from European flax yarns for unmatched cooling aeration on hot sunny afternoons.',
    popularity: 89
  },
  {
    name: 'Men Solid Crew-Neck Cotton T-Shirt Pack of 3',
    brand: 'BasicHub',
    category: 'Clothes',
    price: 799,
    oldPrice: 1599,
    rating: 4.2,
    reviewCount: 4200,
    colors: ['Black-White-Grey Combo', 'Navy-Olive-Burgundy Combo'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: {
      fabric: '100% Bio-Washed Combed Cotton',
      gender: 'Men',
      fit: 'Regular Fit',
      neck: 'Ribbed Crew Neck',
      count: 'Pack of 3'
    },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 799, url: '#' },
      { name: 'Amazon Prime', price: 849, url: 'https://www.amazon.in' }
    ],
    description: 'Essential triple-pack tees treated with anti-pilling bio-wash enzyme that maintains pristine softness wash after wash.',
    popularity: 95
  },
  {
    name: 'Women Formal Tailored Straight Trouser',
    brand: 'OfficeChic',
    category: 'Clothes',
    price: 1599,
    oldPrice: 2899,
    rating: 4.4,
    reviewCount: 520,
    colors: ['Charcoal Grey', 'Coffee Brown', 'Deep Navy'],
    sizes: ['28', '30', '32', '34'],
    features: {
      fabric: 'Polyester Viscose Stretch',
      gender: 'Women',
      fit: 'Straight Leg Ankle Length',
      waist: 'Mid-Rise Elasticated Back',
      wrinkleResistant: 'High'
    },
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1599, url: '#' },
      { name: 'Marks & Apparel', price: 1749, url: '#' }
    ],
    description: 'Crisply pressed work trousers that transition effortlessly from high-stakes boardrooms to evening dinner dates.',
    popularity: 84
  },
  {
    name: 'Men Breathable Running Track Pants',
    brand: 'Sportex',
    category: 'Clothes',
    price: 999,
    oldPrice: 1999,
    rating: 4.3,
    reviewCount: 1190,
    colors: ['Dark Grey', 'Black with Reflective Stripes', 'Navy'],
    sizes: ['M', 'L', 'XL'],
    features: {
      fabric: 'Quick-Dry Micro Polyester',
      gender: 'Men',
      fit: 'Athletic Tapered Jogger',
      pockets: 'Zippered Pockets',
      elastic: 'Drawstring Waistband'
    },
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 999, url: '#' },
      { name: 'Decathlon Sport', price: 1049, url: 'https://www.decathlon.in' }
    ],
    description: 'Ultra-flexible jogger sweatpants with moisture management mesh ventilation zones behind knee joints.',
    popularity: 89
  }
];

const electronicProducts = [
  {
    name: 'PixelPrime Pro 5G (8GB RAM, 128GB Storage)',
    brand: 'PixelTech',
    category: 'Mobiles & Electronics Appliances',
    price: 24999,
    oldPrice: 32999,
    rating: 4.6,
    reviewCount: 5410,
    colors: ['Phantom Black', 'Glacier Blue', 'Sunset Orange'],
    sizes: ['8GB+128GB', '12GB+256GB'],
    features: {
      ram: '8 GB',
      storage: '128 GB',
      battery: '5000 mAh',
      camera: '64MP + 8MP + 2MP Triple Camera with OIS',
      display: '6.67 inch 120Hz FHD+ AMOLED HDR10+',
      is5G: 'yes',
      warranty: '1 Year Manufacturer Warranty',
      processor: 'Dimensity 8200 Octa-Core',
      charging: '67W Turbo Charge'
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 24999, url: '#' },
      { name: 'Flipkart Electronics', price: 25499, url: 'https://www.flipkart.com' },
      { name: 'Croma Digital', price: 25999, url: 'https://www.croma.com' },
      { name: 'Reliance Digital', price: 26499, url: 'https://www.reliancedigital.in' }
    ],
    description: 'Next-gen flagship killer featuring 120Hz vivid AMOLED screen, ultra-fast 67W charging and camera stabilization for cinema videos.',
    popularity: 98
  },
  {
    name: 'UltraLite Slim 5G Smartphone (6GB RAM, 128GB)',
    brand: 'NeoVolt',
    category: 'Mobiles & Electronics Appliances',
    price: 14999,
    oldPrice: 19999,
    rating: 4.4,
    reviewCount: 3820,
    colors: ['Starlight Silver', 'Aurora Green'],
    sizes: ['6GB+128GB'],
    features: {
      ram: '6 GB',
      storage: '128 GB',
      battery: '5000 mAh',
      camera: '50MP AI Dual Camera',
      display: '6.56 inch 90Hz HD+ IPS LCD',
      is5G: 'yes',
      warranty: '1 Year Warranty',
      processor: 'Snapdragon 4 Gen 2',
      charging: '33W Fast Charge'
    },
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 14999, url: '#' },
      { name: 'Amazon Prime', price: 15299, url: 'https://www.amazon.in' },
      { name: 'Vijay Sales', price: 15499, url: 'https://www.vijaysales.com' }
    ],
    description: 'Affordable 5G beast packing massive battery life, clean bloatware-free OS, and crisp 50MP night photography.',
    popularity: 93
  },
  {
    name: 'Apex Max Flagship 5G (12GB RAM, 256GB Storage)',
    brand: 'Apex',
    category: 'Mobiles & Electronics Appliances',
    price: 48999,
    oldPrice: 59999,
    rating: 4.8,
    reviewCount: 2900,
    colors: ['Titanium Grey', 'Forest Emerald', 'Deep Onyx'],
    sizes: ['12GB+256GB', '16GB+512GB'],
    features: {
      ram: '12 GB',
      storage: '256 GB',
      battery: '5400 mAh',
      camera: '108MP Periscope Telephoto + 50MP UltraWide',
      display: '6.82 inch 2K LTPO AMOLED 144Hz 4500 nits',
      is5G: 'yes',
      warranty: '2 Years Comprehensive Warranty',
      processor: 'Snapdragon 8 Gen 3',
      charging: '100W SuperVOOC & 50W Wireless'
    },
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 48999, url: '#' },
      { name: 'Official Brand Store', price: 49999, url: '#' },
      { name: 'Croma Retail', price: 50999, url: 'https://www.croma.com' }
    ],
    description: 'Uncompromising powerhouse with LTPO curved quad-HD glass, top-of-the-line zoom optics and water resistance IP68 rating.',
    popularity: 97
  },
  {
    name: 'SoundWave ANC Wireless Bluetooth Headphones',
    brand: 'SonicAura',
    category: 'Mobiles & Electronics Appliances',
    price: 4499,
    oldPrice: 8999,
    rating: 4.5,
    reviewCount: 4120,
    colors: ['Matte Black', 'Silver Cloud', 'Midnight Navy'],
    sizes: ['One Size (Adjustable)'],
    features: {
      battery: '60 Hours Playtime',
      charging: 'Type-C Quick Charge (10min = 5hr)',
      driver: '40mm Dynamic Neodymium Drivers',
      anc: '40dB Hybrid Active Noise Cancellation',
      warranty: '1 Year Brand Warranty',
      bluetooth: 'Bluetooth 5.3 with Multipoint Pairing'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 4499, url: '#' },
      { name: 'Headphone Zone', price: 4799, url: 'https://www.headphonezone.in' },
      { name: 'Amazon India', price: 4999, url: 'https://www.amazon.in' }
    ],
    description: 'Audiophile-tuned over-ear wireless headphones with studio clarity, punchy sub-bass and plush memory foam earcups.',
    popularity: 91
  },
  {
    name: 'SmartVision 43 Inch 4K Ultra HD Smart LED TV',
    brand: 'VisionTech',
    category: 'Mobiles & Electronics Appliances',
    price: 21999,
    oldPrice: 34999,
    rating: 4.4,
    reviewCount: 1870,
    colors: ['Bezel-less Black'],
    sizes: ['43 Inch', '50 Inch', '55 Inch'],
    features: {
      display: '43 Inch 4K UHD 3840x2160 Dolby Vision',
      energyRating: '4 Star BEE Efficiency',
      audio: '30W Dolby Atmos Speakers',
      os: 'Google TV with Voice Assistant',
      warranty: '2 Years Comprehensive Warranty',
      ram: '2 GB',
      storage: '16 GB',
      capacity: '43 Inch Panel'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 21999, url: '#' },
      { name: 'Flipkart Supermart', price: 22499, url: '#' },
      { name: 'Reliance Digital', price: 22999, url: '#' }
    ],
    description: 'Immersive cinema screen with micro-dimming zones, frameless metallic finish, dual-band Wi-Fi and built-in Chromecast.',
    popularity: 90
  },
  {
    name: 'FrostFlow 260L 3-Star Inverter Double Door Refrigerator',
    brand: 'CoolCraft',
    category: 'Mobiles & Electronics Appliances',
    price: 23499,
    oldPrice: 31999,
    rating: 4.5,
    reviewCount: 960,
    colors: ['Steel Grey Finish', 'Floral Burgundy'],
    sizes: ['260 Litres'],
    features: {
      capacity: '260 Litres',
      energyRating: '3 Star Inverter Compressor',
      warranty: '10 Years on Compressor, 1 Year Product',
      cooling: 'Multi Air Flow 360 Degree Frost Free',
      shelves: 'Toughened Glass Spill-Proof Shelves'
    },
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 23499, url: '#' },
      { name: 'Croma Home', price: 23999, url: '#' },
      { name: 'Girias Appliances', price: 24499, url: '#' }
    ],
    description: 'Smart inverter compressor adjusts speed according to cooling demand, ensuring ultra-silent operation and lower electricity bills.',
    popularity: 88
  },
  {
    name: 'SwiftWash 7.5kg Fully-Automatic Front Load Washing Machine',
    brand: 'AquaPure',
    category: 'Mobiles & Electronics Appliances',
    price: 27999,
    oldPrice: 38999,
    rating: 4.6,
    reviewCount: 1120,
    colors: ['Silver Chrome', 'Titanium Grey'],
    sizes: ['7.5 kg'],
    features: {
      capacity: '7.5 kg Wash Capacity',
      energyRating: '5 Star BEE Highest Energy Saving',
      warranty: '4 Years Machine Warranty, 10 Years Motor',
      motor: 'Direct Drive Inverter 1400 RPM',
      heater: 'Inbuilt Steam Hygiene Hot Water Wash'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 27999, url: '#' },
      { name: 'Tata CliQ', price: 28499, url: '#' },
      { name: 'Amazon India', price: 28999, url: '#' }
    ],
    description: 'Steam allergy protection washes away 99.9% of bacteria and allergens while safeguarding delicate fabrics with 6-motion drum rotations.',
    popularity: 89
  },
  {
    name: 'AeroBreeze 1.5 Ton 5-Star Split Dual-Inverter AC',
    brand: 'AirSense',
    category: 'Mobiles & Electronics Appliances',
    price: 36999,
    oldPrice: 52999,
    rating: 4.7,
    reviewCount: 1450,
    colors: ['Pure White with Hidden Display'],
    sizes: ['1.5 Ton'],
    features: {
      capacity: '1.5 Ton Cooling Capacity',
      energyRating: '5 Star Copper Condenser ISEER 5.2',
      warranty: '10 Years Compressor, 5 Years PCB, 1 Year Unit',
      refrigerant: 'R32 Eco-Friendly Gas',
      filter: 'PM 2.5 Anti-Bacterial Micro Filter',
      smart: 'Wi-Fi Enabled Smart Mobile App Control'
    },
    images: [
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 36999, url: '#' },
      { name: 'Croma Retail', price: 37499, url: '#' },
      { name: 'Flipkart AC Mega Sale', price: 37999, url: '#' }
    ],
    description: 'Cools aggressively even at 54 degree ambient temperatures with dual inverter compressor and 100% inner grooved copper tubes.',
    popularity: 92
  },
  {
    name: 'PulseTrack Pro Smartwatch with AMOLED Display & Calling',
    brand: 'Chronos',
    category: 'Mobiles & Electronics Appliances',
    price: 2999,
    oldPrice: 6999,
    rating: 4.3,
    reviewCount: 3200,
    colors: ['Pitch Black', 'Slate Grey', 'Rose Gold'],
    sizes: ['Standard 46mm'],
    features: {
      display: '1.43 inch AMOLED 466x466 Always-On',
      battery: 'Up to 7 Days Battery Life (300 mAh)',
      calling: 'Bluetooth Calling with Clear Mic & Speaker',
      waterproof: 'IP68 Water & Dust Resistant',
      warranty: '1 Year Replacement Warranty',
      sensors: 'SpO2, 24/7 Heart Rate, Sleep Quality, Stress'
    },
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 2999, url: '#' },
      { name: 'Boat / Noise Hub', price: 3199, url: '#' },
      { name: 'Amazon Prime', price: 3299, url: '#' }
    ],
    description: 'Sleek metal zinc-alloy dial housing vivid high-brightness AMOLED screen with Bluetooth calls and 120+ sports modes.',
    popularity: 93
  },
  {
    name: 'TabCore 11-inch Wi-Fi Tablet (6GB RAM, 128GB)',
    brand: 'PixelTech',
    category: 'Mobiles & Electronics Appliances',
    price: 18999,
    oldPrice: 26999,
    rating: 4.5,
    reviewCount: 1670,
    colors: ['Space Grey', 'Mint Green'],
    sizes: ['6GB+128GB'],
    features: {
      ram: '6 GB',
      storage: '128 GB MicroSD Expandable to 1TB',
      battery: '8000 mAh All-Day Power',
      display: '11 inch 2K WUXGA+ 90Hz Display',
      camera: '8MP Front + 13MP Rear Auto-Focus',
      audio: 'Quad Speakers with Dolby Atmos',
      warranty: '1 Year Warranty'
    },
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 18999, url: '#' },
      { name: 'Flipkart Electronics', price: 19499, url: '#' }
    ],
    description: 'Perfect for student study sessions, video streams and light digital sketching with quad audio surround and long battery stamina.',
    popularity: 90
  }
];

const sportsProducts = [
  {
    name: 'ProStance English Willow Cricket Bat Full Size',
    brand: 'WillowKing',
    category: 'Sports & Toys',
    price: 4999,
    oldPrice: 8999,
    rating: 4.6,
    reviewCount: 640,
    colors: ['Natural Grain with Blue Grip', 'Natural with Red Grip'],
    sizes: ['Short Handle (SH)', 'Size 6'],
    features: {
      material: 'Grade 2 Handcrafted English Willow',
      ageGroup: '14+ Years / Adults',
      weight: '1180 - 1220 grams',
      handle: 'Singapore Cane 3-Piece Handle',
      sweetSpot: 'Mid to Low Big Swell'
    },
    images: [
      'https://images.unsplash.com/photo-1531415074868-036b1c5dd535?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 4999, url: '#' },
      { name: 'CricketStore Online', price: 5299, url: '#' },
      { name: 'Decathlon Sport', price: 5499, url: '#' }
    ],
    description: 'Balanced pickup with massive 40mm thick edges and curved bow design for explosive strokeplay on turf pitches.',
    popularity: 90
  },
  {
    name: 'MatchPro Official Size 5 Thermal Bonded Football',
    brand: 'StrikeForce',
    category: 'Sports & Toys',
    price: 1299,
    oldPrice: 2499,
    rating: 4.5,
    reviewCount: 1830,
    colors: ['White-Neon Orange-Blue', 'Volt Yellow-Black'],
    sizes: ['Size 5 (Official Adult Match)'],
    features: {
      material: 'Thermally Bonded PU Leather Seamless',
      ageGroup: '12+ Years & Adults',
      weight: '430 grams',
      bladder: 'Butyl Bladder for Air Retention',
      certification: 'FIFA Standard Dimensions'
    },
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1299, url: '#' },
      { name: 'Amazon Sports', price: 1399, url: '#' }
    ],
    description: 'Zero water absorption thermal bonding technology creates a perfectly spherical flight trajectory under any weather condition.',
    popularity: 94
  },
  {
    name: 'AeroSmash Carbon Fiber High Tension Badminton Racket',
    brand: 'YonCraft',
    category: 'Sports & Toys',
    price: 2499,
    oldPrice: 4499,
    rating: 4.7,
    reviewCount: 2150,
    colors: ['Matte Black with Gold Accents', 'Metallic Blue'],
    sizes: ['4U (G4 Grip)'],
    features: {
      material: 'High Modulus Ultra-Light Graphite',
      ageGroup: 'All Age Groups (Intermediate/Pro)',
      weight: '82 grams (Super Light)',
      tension: 'Supports up to 30 lbs string tension',
      balance: 'Head-Heavy for Power Smashes'
    },
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 2499, url: '#' },
      { name: 'Sunrise Badminton', price: 2699, url: '#' }
    ],
    description: 'Engineered aerodynamic isometric frame reduces air resistance by 18%, giving lightning-quick counter smashes.',
    popularity: 96
  },
  {
    name: 'EcoGrip 6mm Extra Thick TPE Non-Slip Yoga Mat',
    brand: 'ZenFit',
    category: 'Sports & Toys',
    price: 899,
    oldPrice: 1799,
    rating: 4.4,
    reviewCount: 3100,
    colors: ['Dual Color Teal & Grey', 'Purple & Pink', 'Forest Green'],
    sizes: ['72 x 24 inches'],
    features: {
      material: 'Eco-Friendly High Density TPE (Tear-Resistant)',
      ageGroup: 'All Ages',
      weight: '900 grams',
      thickness: '6mm High Cushioning',
      features: 'Alignment Lines & Carrying Strap Included'
    },
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 899, url: '#' },
      { name: 'Decathlon Online', price: 999, url: '#' }
    ],
    description: 'Double-sided textured grip protects knees and elbows during vigorous asanas, Pilates or home cardio sessions.',
    popularity: 92
  },
  {
    name: 'BuildMaster 500-Piece Creative Architecture Building Bricks',
    brand: 'BlockCraft',
    category: 'Sports & Toys',
    price: 1499,
    oldPrice: 2499,
    rating: 4.8,
    reviewCount: 940,
    colors: ['Multi-Colour Vibrant Assortment'],
    sizes: ['500 Piece Set with Storage Box'],
    features: {
      material: 'BPA-Free Non-Toxic ABS Plastic',
      ageGroup: '5 - 14 Years',
      weight: '1200 grams',
      type: 'STEM Educational Construction Toy',
      safety: 'Smooth Rounded Bur-Free Edges'
    },
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1499, url: '#' },
      { name: 'Hamleys Toy Mart', price: 1699, url: '#' }
    ],
    description: 'Stimulates 3D spatial thinking, architectural creativity, and fine motor skills with snap-fit interlocking blocks.',
    popularity: 95
  },
  {
    name: 'HyperSpeed 1:16 4WD High Speed Off-Road RC Monster Truck',
    brand: 'TurboDrift',
    category: 'Sports & Toys',
    price: 2799,
    oldPrice: 4999,
    rating: 4.5,
    reviewCount: 1220,
    colors: ['Fiery Red with Decals', 'Electric Blue'],
    sizes: ['1:16 Scale Model'],
    features: {
      material: 'Alloy Chassis & Shock Absorbers',
      ageGroup: '8+ Years & Hobbyists',
      weight: '1350 grams',
      speed: 'Up to 36 km/h Top Speed',
      battery: 'Rechargeable 7.4V Li-Po (25 mins runtime)'
    },
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 2799, url: '#' },
      { name: 'Amazon Prime', price: 2999, url: '#' }
    ],
    description: 'Conquer dirt, grass, and gravel with oil-filled metal shocks, independent suspensions, and 2.4GHz proportional radio controller.',
    popularity: 91
  },
  {
    name: 'CastIron 20kg Adjustable Dumbbells & Barbell Set',
    brand: 'IronForge',
    category: 'Sports & Toys',
    price: 3499,
    oldPrice: 6499,
    rating: 4.6,
    reviewCount: 2200,
    colors: ['Black Rubber Coated with Chrome Handles'],
    sizes: ['20 kg Total Weight Set'],
    features: {
      material: 'Heavy Cast Iron with Durable PVC Anti-Scratch Coat',
      ageGroup: '16+ Years / Adults',
      weight: '20 kg Total (Plate combo: 2kg x 4, 1.5kg x 4, 1.25kg x 4)',
      connector: 'Barbell Foam Extension Rod Included',
      collars: 'Spinlock Safety Collars'
    },
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 3499, url: '#' },
      { name: 'FitnessWorld', price: 3799, url: '#' }
    ],
    description: 'Transform home workouts from compact dumbbells to full chest and squat barbells in seconds with padded connecting rod.',
    popularity: 93
  },
  {
    name: 'GrandMaster Solid Wood Folding Tournament Chess Set',
    brand: 'RoyalGame',
    category: 'Sports & Toys',
    price: 1199,
    oldPrice: 2199,
    rating: 4.7,
    reviewCount: 780,
    colors: ['Natural Teak & Rosewood Finish'],
    sizes: ['14 x 14 Inch Board'],
    features: {
      material: '100% Solid Natural Sheesham & Boxwood',
      ageGroup: '6+ Years to Adults',
      weight: '950 grams',
      pieces: 'Hand-Carved Felt-Bottom Pieces with Magnetic Board',
      storage: 'Individual Velvet Piece Slots Inside Fold'
    },
    images: [
      'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1199, url: '#' },
      { name: 'CraftVilla', price: 1349, url: '#' }
    ],
    description: 'Magnetic pieces stay anchored securely whether playing on commuter trains, beach trips, or quiet weekend home tables.',
    popularity: 88
  },
  {
    name: 'OrbitGlide Kids 3-Wheel Lean-to-Steer Kick Scooter',
    brand: 'LittleRiders',
    category: 'Sports & Toys',
    price: 1999,
    oldPrice: 3499,
    rating: 4.5,
    reviewCount: 890,
    colors: ['Neon Pink', 'Ocean Cyan', 'Fire Red'],
    sizes: ['Adjustable Handlebar Height (3 Levels)'],
    features: {
      material: 'Reinforced Aluminium Alloy & Sturdy Nylon Base',
      ageGroup: '3 - 8 Years',
      weight: '2.5 kg (Supports up to 50 kg rider)',
      wheels: 'PU Flashing LED Light-up Wheels (No batteries needed)',
      brake: 'Wide Rear Foot Fender Brake'
    },
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 1999, url: '#' },
      { name: 'FirstCry Superstore', price: 2199, url: '#' }
    ],
    description: 'Promotes core balance and steering coordination with kinetic powered LED glowing wheels and slip-resistant wide footboard.',
    popularity: 89
  },
  {
    name: 'ProGrip Anti-Slip Latex Palm Goalkeeper Gloves',
    brand: 'StrikeForce',
    category: 'Sports & Toys',
    price: 999,
    oldPrice: 1899,
    rating: 4.3,
    reviewCount: 460,
    colors: ['Fluorescent Green & Black', 'Neon Orange'],
    sizes: ['Size 7', 'Size 8', 'Size 9'],
    features: {
      material: '4mm German Foam Contact Latex',
      ageGroup: '10+ Years / Adults',
      weight: '280 grams',
      protection: 'Removable Finger Spine Saves',
      wrist: 'Double Wrap Elastic Strap'
    },
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 999, url: '#' },
      { name: 'Decathlon Sport', price: 1099, url: '#' }
    ],
    description: 'Professional grade wet and dry grip foam absorbs fierce shot impacts and protects keeper fingers against hyperextensions.',
    popularity: 87
  }
];

const beautyProducts = [
  {
    name: 'HydraGlow 10% Vitamin C Radiance Face Serum',
    brand: 'GlowScience',
    category: 'Beauty Products',
    price: 649,
    oldPrice: 999,
    rating: 4.6,
    reviewCount: 3890,
    colors: ['Amber Glass Bottle'],
    sizes: ['30 ml', '50 ml'],
    features: {
      skinType: 'All Skin Types (Ideal for Dull & Uneven Tone)',
      ingredients: '10% Ethyl Ascorbic Acid, Ferulic Acid, Hyaluronic Acid',
      quantity: '30 ml',
      benefit: 'Brightens Pigmentation, Fights Free Radicals',
      crueltyFree: 'Yes, 100% Vegan & Paraben-Free'
    },
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 649, url: '#' },
      { name: 'Nykaa Beauty', price: 699, url: 'https://www.nykaa.com' },
      { name: 'Purplle Store', price: 729, url: 'https://www.purplle.com' }
    ],
    description: 'Stabilized pure vitamin C derivative rapidly absorbs deep into epidermal layers without sticky residue, boosting natural glow in 14 days.',
    popularity: 97
  },
  {
    name: 'UltraMatte Oil-Free Gel Sunscreen SPF 50 PA++++',
    brand: 'DermaShield',
    category: 'Beauty Products',
    price: 499,
    oldPrice: 799,
    rating: 4.7,
    reviewCount: 4850,
    colors: ['Translucent Gel Formulation'],
    sizes: ['50 g', '100 g'],
    features: {
      skinType: 'Oily, Combination & Acne-Prone Skin',
      ingredients: 'Zinc Oxide, Titanium Dioxide, Niacinamide, Cica Extract',
      quantity: '50 g',
      spf: 'SPF 50 PA++++ Broad Spectrum UVA/UVB',
      finish: 'Zero White Cast, Ultra Light Invisible Matte'
    },
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 499, url: '#' },
      { name: 'Nykaa Cosmetics', price: 549, url: '#' },
      { name: 'Amazon Beauty', price: 599, url: '#' }
    ],
    description: 'Lightweight silicone-gel hybrid sun shield that prevents photo-aging, calms redness, and controls excess sebum all day.',
    popularity: 98
  },
  {
    name: 'Ceramide Barrier Repair Intensive Moisture Cream',
    brand: 'SkinBarrier',
    category: 'Beauty Products',
    price: 799,
    oldPrice: 1299,
    rating: 4.8,
    reviewCount: 2100,
    colors: ['Rich White Velvety Cream'],
    sizes: ['100 ml'],
    features: {
      skinType: 'Dry, Sensitive & Compromised Skin Barrier',
      ingredients: '5 Essential Ceramides (1, 2, 3, 6-II), Oat Lipids, Cholesterol',
      quantity: '100 ml',
      benefit: '72hr Deep Moisture Lock, Reduces Flaking',
      fragranceFree: 'Yes, Hypoallergenic Formula'
    },
    images: [
      'https://images.unsplash.com/photo-1608248597359-009187ecadfe?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 799, url: '#' },
      { name: 'Tira Beauty', price: 849, url: '#' }
    ],
    description: 'Golden ratio 3:1:1 skin lipid replica strengthens stressed skin walls, relieves irritation from harsh weather, and seals moisture.',
    popularity: 94
  },
  {
    name: 'Salicylic Acid 2% Gentle Foaming Clarifying Cleanser',
    brand: 'DermaShield',
    category: 'Beauty Products',
    price: 399,
    oldPrice: 599,
    rating: 4.4,
    reviewCount: 3410,
    colors: ['Clear Gel Wash'],
    sizes: ['150 ml'],
    features: {
      skinType: 'Oily & Acne-Prone Skin with Blackheads',
      ingredients: '2% Encapsulated BHA Salicylic Acid, Tea Tree Oil, Aloe Vera',
      quantity: '150 ml',
      benefit: 'Clears Clogged Pores & Reduces Blackheads',
      phLevel: 'pH Balanced 5.5'
    },
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b5de73176b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 399, url: '#' },
      { name: 'Nykaa Supermart', price: 429, url: '#' }
    ],
    description: 'Dissolves deep pore debris and stubborn micro-comedones without stripping away delicate natural skin oils.',
    popularity: 91
  },
  {
    name: 'Rosemary & Biotin Scalp Revitalizing Hair Growth Oil',
    brand: 'BotanicaRoots',
    category: 'Beauty Products',
    price: 449,
    oldPrice: 799,
    rating: 4.5,
    reviewCount: 5200,
    colors: ['Golden Botanical Oil with Dropper'],
    sizes: ['100 ml', '200 ml'],
    features: {
      skinType: 'All Scalp Types & Thinning Hair',
      ingredients: 'Organic Rosemary Extract, Biotin, Castor Oil, Bhringraj',
      quantity: '100 ml',
      benefit: 'Boosts Follicle Circulation & Hair Density',
      mineralOilFree: 'Yes, 100% Cold-Pressed Pure Seed Base'
    },
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 449, url: '#' },
      { name: 'Amazon Prime', price: 499, url: '#' }
    ],
    description: 'Ancient Ayurvedic wisdom meets modern scalp trichology: stimulates micro-circulation to nourish roots and curtail breakage.',
    popularity: 95
  },
  {
    name: 'Velvet Matte Liquid Lip Color Long-Wear 16HR',
    brand: 'LuxeShade',
    category: 'Beauty Products',
    price: 599,
    oldPrice: 999,
    rating: 4.5,
    reviewCount: 1780,
    colors: ['Ruby Red', 'Nude Truffle', 'Mauve Kiss', 'Spiced Berry'],
    sizes: ['5 ml'],
    features: {
      skinType: 'All Lip Profiles',
      ingredients: 'Vitamin E, Shea Butter, Hyaluronic Microspheres',
      quantity: '5 ml',
      finish: 'Transfer-Proof Non-Drying Matte',
      duration: 'Up to 16 Hours Stay'
    },
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 599, url: '#' },
      { name: 'Nykaa Cosmetics', price: 649, url: '#' },
      { name: 'Sephora India', price: 699, url: '#' }
    ],
    description: 'Weightless liquid lipstick that paints rich pigmented color in a single swipe without cracking or feathering.',
    popularity: 93
  },
  {
    name: 'Advanced Retinol 0.3% Night Youth Treatment Serum',
    brand: 'GlowScience',
    category: 'Beauty Products',
    price: 899,
    oldPrice: 1499,
    rating: 4.7,
    reviewCount: 1620,
    colors: ['Milky Dropper Suspension'],
    sizes: ['30 ml'],
    features: {
      skinType: 'Mature, Normal & Combination Skin',
      ingredients: '0.3% Micro-Encapsulated Retinol, Bakuchiol, Peptides',
      quantity: '30 ml',
      benefit: 'Reduces Fine Lines, Accelerates Cellular Turnover',
      crueltyFree: 'Yes, Dermatologically Tested'
    },
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 899, url: '#' },
      { name: 'Purplle Elite', price: 949, url: '#' }
    ],
    description: 'Time-released encapsulation guarantees maximum anti-aging efficacy overnight with virtually zero redness or peeling irritation.',
    popularity: 90
  },
  {
    name: 'Exfoliating AHA BHA Peeling Solution 30ml',
    brand: 'DermaShield',
    category: 'Beauty Products',
    price: 699,
    oldPrice: 1099,
    rating: 4.6,
    reviewCount: 2980,
    colors: ['Deep Crimson Red Fluid'],
    sizes: ['30 ml'],
    features: {
      skinType: 'Tolerant, Oily & Congested Skin (Not for Ultra-Sensitive)',
      ingredients: '25% AHA (Glycolic + Lactic), 2% BHA, Tasmanian Pepperberry',
      quantity: '30 ml',
      benefit: '10-Minute Weekly Chemical Peel for Glass Skin Texture',
      usage: 'Once Weekly 10-Minute Wash-Off'
    },
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 699, url: '#' },
      { name: 'Nykaa Beauty', price: 749, url: '#' }
    ],
    description: 'High-potency exfoliating solution sweeps away dull superficial dead cells to uncover radiant, silky-smooth baby skin.',
    popularity: 92
  },
  {
    name: 'Argan & Keratin Deep Conditioning Hair Mask',
    brand: 'BotanicaRoots',
    category: 'Beauty Products',
    price: 549,
    oldPrice: 899,
    rating: 4.5,
    reviewCount: 1450,
    colors: ['Rich Creamy Butter'],
    sizes: ['200 g'],
    features: {
      skinType: 'Dry, Frizzy, Chemically Treated & Heat Damaged Hair',
      ingredients: 'Moroccan Argan Oil, Hydrolyzed Keratin, Shea Butter',
      quantity: '200 g',
      benefit: 'Tames Frizz, Restores Elasticity and Diamond Shine',
      sulfateFree: 'Yes, Color-Safe Formula'
    },
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 549, url: '#' },
      { name: 'Amazon India', price: 599, url: '#' }
    ],
    description: 'Transform parched, brittle strands into salon-glossy tresses with restorative micro-proteins and essential fatty acids.',
    popularity: 88
  },
  {
    name: 'Gentle Micellar Cleansing Water All-in-1',
    brand: 'SkinBarrier',
    category: 'Beauty Products',
    price: 349,
    oldPrice: 549,
    rating: 4.5,
    reviewCount: 2280,
    colors: ['Crystal Clear Water Bottle'],
    sizes: ['400 ml Mega Bottle'],
    features: {
      skinType: 'All Skin Types including Sensitive Eyes & Lips',
      ingredients: 'Micelles, Glycerin, Centella Asiatica Water',
      quantity: '400 ml',
      benefit: 'Lifts Waterproof Makeup & Dust with No Rubbing',
      rinseFree: 'Yes, No Rinse Required'
    },
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b5de73176b?auto=format&fit=crop&w=800&q=80'
    ],
    stores: [
      { name: 'CompareKart Direct', price: 349, url: '#' },
      { name: 'Nykaa Supermart', price: 379, url: '#' }
    ],
    description: 'Magnetic cleansing micelles trap and lift away stubborn makeup, grime and urban pollutants gently in a single cotton pad wipe.',
    popularity: 89
  }
];

const allProducts = [
  ...clothesProducts,
  ...electronicProducts,
  ...sportsProducts,
  ...beautyProducts
];

// Add a varied catalog without repeating the hand-written starter products.
const generatedCatalog = [
  {
    category: 'Mobiles & Electronics Appliances',
    brands: ['Samsung', 'Xiaomi', 'OnePlus', 'boAt', 'Sony', 'HP', 'Whirlpool', 'Philips'],
    products: ['5G Smartphone', 'Wireless Earbuds', 'Smart TV', 'Laptop', 'Bluetooth Speaker', 'Air Fryer', 'Smartwatch', 'Mixer Grinder', 'Power Bank', 'Air Purifier'],
    features: ['5G', 'Noise cancellation', 'Full HD display', 'Fast charging', 'Energy efficient', 'Long battery life']
  },
  {
    category: 'Sports & Toys',
    brands: ['Nivia', 'Cosco', 'Yonex', 'Vector X', 'Lego', 'Funskool', 'Boldfit', 'Strauss'],
    products: ['Football', 'Cricket Bat', 'Badminton Racket', 'Yoga Mat', 'Dumbbell Set', 'Kids Building Blocks', 'Basketball', 'Cycling Helmet', 'Skipping Rope', 'Table Tennis Set'],
    features: ['Durable build', 'All skill levels', 'Lightweight', 'Indoor and outdoor use', 'Age 8+', 'Non-slip grip']
  },
  {
    category: 'Beauty Products',
    brands: ['Lakme', 'Mamaearth', 'Minimalist', 'Maybelline', 'Plum', 'Biotique', 'Cetaphil', 'Nykaa'],
    products: ['Hydrating Face Moisturizer', 'Vitamin C Serum', 'Sunscreen SPF 50', 'Matte Lipstick', 'Gentle Face Cleanser', 'Hair Repair Shampoo', 'Kajal Pencil', 'Body Lotion', 'Clay Face Mask', 'Nail Polish Set'],
    features: ['Dermatologically tested', 'Suitable for daily use', 'Paraben free', 'Long lasting', 'Suitable for all skin types', 'Cruelty free']
  }
];

const additionalProducts = Array.from({ length: 200 }, (_, index) => {
  const group = generatedCatalog[index % generatedCatalog.length];
  const model = Math.floor(index / generatedCatalog.length) + 1;
  const productName = group.products[Math.floor(index / generatedCatalog.length) % group.products.length];
  const brand = group.brands[(index * 3) % group.brands.length];
  const price = group.category === 'Mobiles & Electronics Appliances'
    ? 799 + ((index * 947) % 74901)
    : group.category === 'Sports & Toys'
      ? 199 + ((index * 137) % 11801)
      : 99 + ((index * 83) % 3901);
  const rating = Number((3.5 + ((index * 7) % 16) / 10).toFixed(1));
  const oldPrice = Math.round(price * (1.12 + (index % 5) * 0.04));

  return {
    name: `${brand} ${productName} ${String(model).padStart(2, '0')}`,
    brand,
    category: group.category,
    price,
    oldPrice,
    rating,
    reviewCount: 35 + ((index * 53) % 4200),
    colors: ['Black', 'Blue', 'White'],
    features: { highlight: group.features[index % group.features.length], model: `CK-${String(index + 1).padStart(3, '0')}` },
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    stores: [
      { name: 'CompareKart Direct', price, url: '#' },
      { name: 'Value Store', price: Math.round(price * 1.04), url: '#' }
    ],
    description: `${brand} ${productName} with ${group.features[index % group.features.length].toLowerCase()} for dependable everyday use.`,
    popularity: 40 + ((index * 11) % 60)
  };
});

allProducts.push(...additionalProducts);

const seedData = async () => {
  try {
    await connectDB();

    const existingNames = new Set((await Product.find({}, 'name').lean()).map(product => product.name));
    const productsToAdd = allProducts.filter(product => !existingNames.has(product.name));
    console.log(`[Seed] Adding ${productsToAdd.length} missing catalog products without deleting existing data...`);
    const createdProducts = productsToAdd.length ? await Product.insertMany(productsToAdd) : [];
    console.log(`[Seed] Successfully added ${createdProducts.length} products!`);

    // Create a ready-to-use demo user
    console.log('[Seed] Creating demo user account...');
    let demoUser = await User.findOne({ email: 'demo@comparekart.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Priyanka Sharma',
        email: 'demo@comparekart.com',
        password: 'password123',
        wishlist: [createdProducts[0]?._id, createdProducts[10]?._id].filter(Boolean)
      });
    }

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`📦 Products added in this run: ${createdProducts.length}`);
    console.log('   - Existing starter catalog: 40 products');
    console.log('   - Added products: 200 across Mobiles & Electronics Appliances, Sports & Toys, and Beauty Products');
    console.log('👤 Demo User Credentials:');
    console.log(`   Email:    ${demoUser.email}`);
    console.log('   Password: password123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

const autoSeedDatabase = async () => {
  const existingNames = new Set((await Product.find({}, 'name').lean()).map(product => product.name));
  const productsToAdd = allProducts.filter(product => !existingNames.has(product.name));
  if (productsToAdd.length) {
    console.log(`[Auto-Seed] Adding ${productsToAdd.length} missing catalog products...`);
    await Product.insertMany(productsToAdd);
  }

  const existingDemoUser = await User.findOne({ email: 'demo@comparekart.com' });
  if (!existingDemoUser) {
    const wishlistProducts = await Product.find().limit(2).select('_id').lean();
    await User.create({
      name: 'Priyanka Sharma',
      email: 'demo@comparekart.com',
      password: 'password123',
      wishlist: wishlistProducts.map(product => product._id)
    });
  }
  console.log('[Auto-Seed] Catalog and demo account are ready.');
};

if (require.main === module) {
  seedData();
}

module.exports = { allProducts, autoSeedDatabase };
