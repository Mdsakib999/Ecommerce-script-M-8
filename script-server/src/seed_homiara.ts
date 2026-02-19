import dotenv from "dotenv";
import mongoose from "mongoose";
import Banner from "./models/Banner";
import Product from "./models/Product";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/homiara";

const products = [
  // Wall Decor
  {
    name: "Abstract Golden Sun Wall Art",
    slug: "abstract-golden-sun-wall-art",
    description: "A stunning piece of abstract wall art featuring golden accents that catch the light, perfect for any modern living room.",
    sku: "WD-001",
    price: 120,
    category: "Wall Decor",
    images: [{ url: "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/wd001" }],
    countInStock: 15,
    rating: 4.8,
    numReviews: 12,
    featured: true,
  },
  {
    name: "Minimalist Botanical Prints (Set of 3)",
    slug: "minimalist-botanical-prints-set-of-3",
    description: "Elegant botanical prints in minimalist black frames, bringing a touch of nature to your workspace or bedroom.",
    sku: "WD-002",
    price: 85,
    category: "Wall Decor",
    images: [{ url: "https://images.pexels.com/photos/4503730/pexels-photo-4503730.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/wd002" }],
    countInStock: 25,
    rating: 4.5,
    numReviews: 8,
  },
  {
    name: "Handcrafted Macrame Wall Hanging",
    slug: "handcrafted-macrame-wall-hanging",
    description: "Intricately knotted boho-style macrame wall hanging made from 100% natural cotton cord.",
    sku: "WD-003",
    price: 45,
    category: "Wall Decor",
    images: [{ url: "https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/wd003" }],
    countInStock: 20,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: "Sunburst Mirror with Gold Frame",
    slug: "sunburst-mirror-gold-frame",
    description: "A statement sunburst mirror that adds light and a touch of luxury to any entryway or master suite.",
    sku: "WD-004",
    price: 135,
    category: "Wall Decor",
    images: [{ url: "https://images.pexels.com/photos/1528975/pexels-photo-1528975.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/wd004" }],
    countInStock: 8,
    rating: 4.9,
    numReviews: 22,
  },

  // Lighting
  {
    name: "Modern Brass Pendant Light",
    slug: "modern-brass-pendant-light",
    description: "A sleek and stylish brass pendant light that provides warm, atmospheric lighting for your dining area.",
    sku: "LT-001",
    price: 150,
    category: "Lighting",
    images: [{ url: "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/lt001" }],
    countInStock: 10,
    rating: 4.9,
    numReviews: 20,
    featured: true,
  },
  {
    name: "Sculptural Ceramic Table Lamp",
    slug: "sculptural-ceramic-table-lamp",
    description: "Handcrafted ceramic table lamp with a unique sculptural base and a linen shade for a soft glow.",
    sku: "LT-002",
    price: 210,
    category: "Lighting",
    images: [{ url: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/lt002" }],
    countInStock: 5,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: "Industrial Tripod Floor Lamp",
    slug: "industrial-tripod-floor-lamp",
    description: "A tall, matte black industrial floor lamp with a rotating head, perfect for reading nooks.",
    sku: "LT-003",
    price: 175,
    category: "Lighting",
    images: [{ url: "https://images.pexels.com/photos/1125130/pexels-photo-1125130.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/lt003" }],
    countInStock: 12,
    rating: 4.6,
    numReviews: 11,
  },
  {
    name: "Crystal Ball String Lights",
    slug: "crystal-ball-string-lights",
    description: "Add a magical touch to your bedroom or patio with these warm white crystal ball LED string lights.",
    sku: "LT-004",
    price: 25,
    category: "Lighting",
    images: [{ url: "https://images.pexels.com/photos/745242/pexels-photo-745242.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/lt004" }],
    countInStock: 40,
    rating: 4.4,
    numReviews: 35,
  },

  // Furniture
  {
    name: "Mid-Century Modern Velvet Armchair",
    slug: "mid-century-modern-velvet-armchair",
    description: "Luxurious velvet armchair with tapered wooden legs, offering both comfort and iconic mid-century style.",
    sku: "FN-001",
    price: 450,
    category: "Furniture",
    images: [{ url: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/fn001" }],
    countInStock: 3,
    rating: 4.8,
    numReviews: 18,
    featured: true,
  },
  {
    name: "Minimalist Oak Nesting Tables",
    slug: "minimalist-oak-nesting-tables",
    description: "Versatile set of two oak nesting tables with clean lines, perfect for small living spaces.",
    sku: "FN-002",
    price: 280,
    category: "Furniture",
    images: [{ url: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/fn002" }],
    countInStock: 6,
    rating: 4.6,
    numReviews: 7,
  },
  {
    name: "Rattan Accent Bookshelf",
    slug: "rattan-accent-bookshelf",
    description: "A beautiful rattan and wood bookshelf that brings a natural, airy feel to your home organization.",
    sku: "FN-003",
    price: 320,
    category: "Furniture",
    images: [{ url: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/fn003" }],
    countInStock: 4,
    rating: 4.5,
    numReviews: 9,
  },
  {
    name: "Marble Top Coffee Table",
    slug: "marble-top-coffee-table",
    description: "An elegant coffee table with a genuine white marble top and a sleek geometric gold-finished frame.",
    sku: "FN-004",
    price: 550,
    category: "Furniture",
    images: [{ url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/fn004" }],
    countInStock: 2,
    rating: 5.0,
    numReviews: 5,
    featured: true,
  },

  // Vases & Accents
  {
    name: "Artisan Speckled Ceramic Vase",
    slug: "artisan-speckled-ceramic-vase",
    description: "A beautiful hand-thrown ceramic vase with a unique speckled glaze, ideal for fresh blooms or dried botanicals.",
    sku: "VA-001",
    price: 45,
    category: "Vases & Accents",
    images: [{ url: "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/va001" }],
    countInStock: 30,
    rating: 4.6,
    numReviews: 10,
  },
  {
    name: "Geometric Gold Mantel Clock",
    slug: "geometric-gold-mantel-clock",
    description: "Sophisticated geometric clock with a brushed gold finish, adding a timeless touch to your mantelpiece.",
    sku: "VA-002",
    price: 65,
    category: "Vases & Accents",
    images: [{ url: "https://images.pexels.com/photos/210528/pexels-photo-210528.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/va002" }],
    countInStock: 12,
    rating: 4.4,
    numReviews: 5,
  },
  {
    name: "Hand-Painted Terracotta Jug",
    slug: "hand-painted-terracotta-jug",
    description: "Rustic terracotta jug with delicate hand-painted ethnic patterns, perfect as a stand-alone decor piece.",
    sku: "VA-003",
    price: 38,
    category: "Vases & Accents",
    images: [{ url: "https://images.pexels.com/photos/4207567/pexels-photo-4207567.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/va003" }],
    countInStock: 18,
    rating: 4.7,
    numReviews: 14,
  },
  {
    name: "Decorative Brass Candle Holder Set",
    slug: "decorative-brass-candle-holder-set",
    description: "Set of three vintage-inspired brass candle holders of varying heights for a dynamic table setting.",
    sku: "VA-004",
    price: 55,
    category: "Vases & Accents",
    images: [{ url: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/va004" }],
    countInStock: 22,
    rating: 4.5,
    numReviews: 8,
  },

  // Textiles
  {
    name: "Hand-Woven Textured Throw Pillow",
    slug: "hand-woven-textured-throw-pillow",
    description: "Cozy and stylish throw pillow with a rich hand-woven texture, perfect for adding warmth to your sofa.",
    sku: "TX-001",
    price: 35,
    category: "Textiles",
    images: [{ url: "https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/tx001" }],
    countInStock: 50,
    rating: 4.7,
    numReviews: 25,
  },
  {
    name: "Soft Linen Blend Weighted Blanket",
    slug: "soft-linen-blend-weighted-blanket",
    description: "Premium linen blend weighted blanket designed for comfort and relaxation, in a neutral grey tone.",
    sku: "TX-002",
    price: 180,
    category: "Textiles",
    images: [{ url: "https://images.pexels.com/photos/7195837/pexels-photo-7195837.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/tx002" }],
    countInStock: 8,
    rating: 4.9,
    numReviews: 30,
    featured: true,
  },
  {
    name: "Faded Vintage Turkish Rug",
    slug: "faded-vintage-turkish-rug",
    description: "A large, beautifully faded Turkish rug with traditional motifs, bringing timeless character to any room.",
    sku: "TX-003",
    price: 850,
    category: "Textiles",
    images: [{ url: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/tx003" }],
    countInStock: 1,
    rating: 4.9,
    numReviews: 4,
  },
  {
    name: "Velvet Blackout Curtains (Pair)",
    slug: "velvet-blackout-curtains-pair",
    description: "Rich emerald green velvet curtains that offer both elegance and excellent light blocking capabilities.",
    sku: "TX-004",
    price: 95,
    category: "Textiles",
    images: [{ url: "https://images.pexels.com/photos/631411/pexels-photo-631411.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/tx004" }],
    countInStock: 15,
    rating: 4.6,
    numReviews: 12,
  },

  // Kitchen & Dining
  {
    name: "Ceramic Matte Dinnerware Set",
    slug: "ceramic-matte-dinnerware-set",
    description: "A 16-piece ceramic dinnerware set with a modern matte finish, durable enough for daily use.",
    sku: "KD-001",
    price: 110,
    category: "Kitchen & Dining",
    images: [{ url: "https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/kd001" }],
    countInStock: 10,
    rating: 4.8,
    numReviews: 19,
  },
  {
    name: "Acacia Wood Serving Board",
    slug: "acacia-wood-serving-board",
    description: "Solid acacia wood serving board with a natural live edge, perfect for charcuterie and entertaining.",
    sku: "KD-002",
    price: 48,
    category: "Kitchen & Dining",
    images: [{ url: "https://images.pexels.com/photos/4033324/pexels-photo-4033324.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/kd002" }],
    countInStock: 20,
    rating: 4.7,
    numReviews: 14,
  },
  {
    name: "Hammered Copper Mug Set",
    slug: "hammered-copper-mug-set",
    description: "Set of four authentic hammered copper mugs, perfect for keeping your favorite drinks chilled.",
    sku: "KD-003",
    price: 55,
    category: "Kitchen & Dining",
    images: [{ url: "https://images.pexels.com/photos/4198139/pexels-photo-4198139.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/kd003" }],
    countInStock: 15,
    rating: 4.5,
    numReviews: 7,
  },

  // Office Decor
  {
    name: "Leather Tabletop Desk Mat",
    slug: "leather-tabletop-desk-mat",
    description: "Premium vegan leather desk mat that protects your workspace and adds an executive feel.",
    sku: "OD-001",
    price: 42,
    category: "Office Decor",
    images: [{ url: "https://images.pexels.com/photos/4458519/pexels-photo-4458519.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/od001" }],
    countInStock: 30,
    rating: 4.8,
    numReviews: 10,
  },
  {
    name: "Brushed Brass Pen Pot",
    slug: "brushed-brass-pen-pot",
    description: "Elevate your desk organization with this minimalist brushed brass cylinder pen holder.",
    sku: "OD-002",
    price: 25,
    category: "Office Decor",
    images: [{ url: "https://images.pexels.com/photos/4458522/pexels-photo-4458522.jpeg?auto=compress&cs=tinysrgb&w=800", public_id: "seed/od002" }],
    countInStock: 25,
    rating: 4.6,
    numReviews: 6,
  }
];

const banners = [
  {
    header: "Elevate Your Living Space",
    subHeader: "Exclusive Handcrafted Decor for Your Home",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920"
  },
  {
    header: "Timeless Design Arrivals",
    subHeader: "Discover Artisan Craftsmanship for Every Room",
    image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=1920"
  },
  {
    header: "The Minimalist Collection",
    subHeader: "Serene Accents for the Modern Sanctuary",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    await Banner.deleteMany({});
    console.log("Cleared existing products and banners.");

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products.`);

    await Banner.insertMany(banners);
    console.log(`Successfully seeded ${banners.length} banners.`);

    console.log("Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedDB();
