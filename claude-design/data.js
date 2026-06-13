// Ayira Mini Mart — store data (pulled via Shopify connector)
window.SHOP = {
  name: "Ayira Mini Mart",
  domain: "ayira-mini-mart-3.myshopify.com",
  location: "Al Khor, Qatar",
  currency: "QAR",
  announcement: "Free delivery in Al Khor on orders over QAR 50",
  announcement_alt: "Same-day delivery, 7 days a week",
  announcement_promo: "Save 15% on your first order — code AYIRA15",
  collections: [
    { handle: "soft-drinks", title: "Soft Drinks", description: "Carbonated soft drinks, sodas and fizzy beverages.", product_count: 10, image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/collections/Poppi_Canada_315955e0-7625-4a8d-8b4d-05277840f843.jpg?v=1779284460", featured: true },
    { handle: "juice", title: "Juice", description: "Fresh juices and fruit drinks.", product_count: 10, image: "", featured: true },
    { handle: "water", title: "Water", description: "Mineral water and hydration drinks.", product_count: 10, image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/collections/ChatGPT_Image_May_18_2026_08_05_21_PM_d0963fe6-8382-478e-9761-2d5b33a25000.png?v=1779284452", featured: false },
    { handle: "chocolates-1", title: "Chocolates", description: "Chocolate bars, boxes and confectionery.", product_count: 10, image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/collections/ChatGPT_Image_May_18_2026_06_43_16_PM_43236252-dfad-48c8-97d7-cfa614399d4d.png?v=1779284445", featured: true },
    { handle: "candy", title: "Candy", description: "Sweets, candies and confectionery.", product_count: 10, image: "", featured: false },
    { handle: "gums", title: "Gums", description: "Chewing gums and mints.", product_count: 10, image: "", featured: false },
    { handle: "ice-cream-1", title: "Ice Cream", description: "Browse our range of ice cream and frozen desserts.", product_count: 10, image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/collections/ChatGPT_Image_May_18_2026_07_48_39_PM_ba0a2caa-5b36-4699-8122-c1eb5a824644.png?v=1779284435", featured: true },
    { handle: "noodles", title: "Noodles", description: "Instant noodles, ramen and quick meals.", product_count: 10, image: "", featured: true },
    { handle: "dairy", title: "Dairy", description: "Milk, yogurt, cheese, butter, cream and laban.", product_count: 0, image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/collections/ChatGPT_Image_May_18_2026_07_53_25_PM.png?v=1779123285", featured: false },
  ],
  products: [
    { handle: "mountain-dew", title: "Mountain Dew", type: "Soft Drinks", price: 2.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/qb3bg2-mountain_20dew_202.25_20l.png?v=1779278045", options: { Size: ["2.25L", "1.25L", "330ml", "150ml"] }, collection: "soft-drinks", sourcing: "PepsiCo · Bottled in Saudi Arabia" },
    { handle: "mirinda-orange", title: "Mirinda Orange", type: "Soft Drinks", price: 2.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/qxl8-5-mirinda_20orange_20bottle_201.25_20litres.png?v=1779278046", options: { Size: ["1.25L", "330ml", "150ml", "2.25L"] }, collection: "soft-drinks" },
    { handle: "coca-cola-original-taste", title: "Coca-Cola Original Taste", type: "Soft Drinks", price: 2.50, compareAt: null, available: true, badges: ["new"], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/jftxxt-coca-cola_20original_20taste_20350_20ml_4490d0b5-6b8a-48d0-bdd0-423ba02b3645.png?v=1779278047", options: { Size: ["350ml", "330ml", "250ml", "2.25L"] }, collection: "soft-drinks" },
    { handle: "pepsi", title: "Pepsi", type: "Soft Drinks", price: 2.50, compareAt: 4.50, available: true, badges: ["sale"], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/ri64et-pepsi_201.25l.png?v=1779278048", options: { Size: ["1.25L", "330ml", "2.25L"] }, collection: "soft-drinks" },
    { handle: "7up", title: "7Up", type: "Soft Drinks", price: 2.00, compareAt: null, available: false, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/rxr64e-refreshing_20lemon_20.png?v=1779278052", options: { Size: ["330ml", "150ml"] }, collection: "soft-drinks" },
    { handle: "sprite-lemon-lime-flavoured", title: "Sprite Lemon Lime", type: "Soft Drinks", price: 3.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/1h5zno-sprite_20lemon_20lime_20flavoured_20350_20ml_2cbc6e5e-ad65-4d19-b362-56eeaed3513a.png?v=1779278061", options: { Size: ["350ml", "2.25L"] }, collection: "soft-drinks" },
    { handle: "barbican-strawberry-flavour", title: "Barbican Strawberry", type: "Soft Drinks", price: 3.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/vv450n-barbican_20strawberry_20flavour_20250_20ml_e6909c9b-2f23-4ca6-88a2-138fcbbdf9b9.jpg?v=1779278058", options: { Size: ["250ml", "330ml"] }, collection: "soft-drinks" },
    { handle: "kdd-cocktail-fruit-drink", title: "KDD Cocktail Fruit Drink", type: "Juice", price: 1.25, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/qy5utg-kdd_20cocktail_20fruit_20drink_20180_20ml_ba507038-a112-42c5-8675-1e8d95f1ad4c.png?v=1779278049", options: { Size: ["250ml", "180ml", "125ml"] }, collection: "juice" },
    { handle: "kdd-mango-nectar", title: "KDD Mango Nectar", type: "Juice", price: 1.25, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/s96wfq-kdd_20mango_20nectar_20250_20ml_77a53279-bdfb-4dbf-8f20-15c193d3e5f0.png?v=1779278053", options: { Size: ["250ml", "125ml"] }, collection: "juice" },
    { handle: "pran-frooto-mango-juice", title: "Pran Frooto Mango Juice", type: "Juice", price: 1.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/kykisu-pran_20frooto_20mango_20juice_20200ml_20_E2_80_93_6ae93bd8-be27-4d67-90a6-a2bf3b2e0d7b.png?v=1779278057", options: { Size: ["200ml", "500ml"] }, collection: "juice" },
    { handle: "airwaves-chewing-gum", title: "Airwaves Chewing Gum", type: "Gums", price: 2.50, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/e7s8fp-airwaves_2046_20pcs_c4af82fc-97e0-4840-bcf7-22fc88d267c2.png?v=1779278051", options: { Size: ["46 pcs", "40 pcs", "14g"] }, collection: "gums" },
    { handle: "galaxy-vanilla-ice-cream", title: "Galaxy Vanilla Ice Cream", type: "Ice Cream", price: 4.50, compareAt: 6.00, available: true, badges: ["sale"], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/pw8vxg-glace_20vanilla_20ice_20cream_20_E2_80_93_2059_20gm_caa97054-01d3-4ee9-ae42-2714c03a5e75.png?v=1779278062", options: { Size: ["59g", "50g"] }, collection: "ice-cream-1" },
    { handle: "snickers-ice-cream", title: "Snickers Ice Cream Bar", type: "Ice Cream", price: 7.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/10i1n1-stickers_20ice_20cream_20_E2_80_93_2070_20gm_f5ec1d4f-836b-443f-88f1-ae3d76e22f7f.png?v=1779278063", options: { Size: ["70g", "73.5g"] }, collection: "ice-cream-1" },
    { handle: "snickers-chocolate-bar", title: "Snickers Chocolate Bar", type: "Chocolates", price: 3.00, compareAt: null, available: true, badges: [], image: "https://cdn.shopify.com/s/files/1/0819/7885/1544/files/e9sy3k-snickers_20chocolate_20bar_2040g_ab64baa4-dab7-42f4-a6d7-d999a32837e8.jpg?v=1779278064", options: { Size: ["40g", "45g"] }, collection: "chocolates-1" },
  ],
  mainMenu: [
    { title: "Home", url: "#" },
    { title: "Beverages", url: "#", children: [
      { title: "Soft Drinks", url: "#" },
      { title: "Juice", url: "#" },
      { title: "Water", url: "#" },
    ]},
    { title: "Snacks & Sweets", url: "#", children: [
      { title: "Chocolates", url: "#" },
      { title: "Candy", url: "#" },
      { title: "Gums", url: "#" },
    ]},
    { title: "Frozen", url: "#", children: [
      { title: "Ice Cream", url: "#" },
    ]},
    { title: "Food", url: "#", children: [
      { title: "Noodles", url: "#" },
    ]},
    { title: "Contact Us", url: "#" },
  ],
  footerMenu: [
    { title: "Search", url: "#" },
    { title: "About Us", url: "#" },
    { title: "Contact Us", url: "#" },
    { title: "FAQ", url: "#" },
    { title: "Shipping & Delivery", url: "#" },
    { title: "Return & Refund Policy", url: "#" },
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
  ],
};

// Price formatter — Shopify default for QAR is "QAR 2.00"
window.fmtPrice = (n) => `QAR ${Number(n).toFixed(2)}`;
