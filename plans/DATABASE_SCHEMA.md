// TCG Vault - Database Schema (Prisma)
// Optimized for Trading Card Game E-Commerce Platform

// ============================================
// ENUMS
// ============================================

enum UserRole {
  ADMIN
  CUSTOMER
}

enum ProductType {
  SINGLE_CARD      // Individual cards (most common)
  BOOSTER_PACK      // Single booster packs
  BOOSTER_BOX       // Sealed boxes (typically 24-36 packs)
  PRECON_DECK       // Pre-constructed decks
  ACCESSORY         // Card sleeves, binders, etc.
  BUNDLE            // Special bundles
}

enum CardCondition {
  MINT           // M - Perfect condition
  NEAR_MINT      // NM - Almost perfect
  LIGHTLY_PLAYED // LP - Minor wear
  MODERATELY_PLAYED // MP - Visible wear
  HEAVILY_PLAYED // HP - Significant wear
  DAMAGED        // D - Damaged/poor
}

enum FoilStatus {
  NON_FOIL
  FOIL
  HOLO_FOIL
  REVERSE_HOLO
}

enum CardRarity {
  COMMON
  UNCOMMON
  RARE
  SUPER_RARE
  ULTRA_RARE
  SECRET_RARE
  PROMOTIONAL
  PRERELEASE
}

enum CardEdition {
  FIRST_EDITION
  UNLIMITED
  REVISED
  POST_REVISION
}

enum CardLanguage {
  ENGLISH
  JAPANESE
  CHINESE
  KOREAN
  SPANISH
  FRENCH
  GERMAN
  PORTUGUESE
  MULTILINGUAL
}

enum OrderStatus {
  PENDING_PAYMENT
  PAYMENT_CONFIRMED
  PROCESSING
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  APPLE_PAY
  GOOGLE_PAY
  BANK_TRANSFER
  CASH_ON_DELIVERY
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum ShippingMethod {
  STANDARD
  EXPRESS
  OVERNIGHT
  INTERNATIONAL
}

enum StockHoldStatus {
  ACTIVE
  RELEASED
  CONVERTED
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String    @map("password_hash")
  firstName         String?   @map("first_name")
  lastName          String?   @map("last_name")
  phone             String?
  role              UserRole  @default(CUSTOMER)
  isEmailVerified   Boolean   @default(false) @map("is_email_verified")
  isActive          Boolean   @default(true) @map("is_active")
  
  // Profile
  avatarUrl         String?   @map("avatar_url")
  dateOfBirth       DateTime? @map("date_of_birth")
  
  // Loyalty & Gamification
  loyaltyPoints     Int       @default(0) @map("loyalty_points")
  totalSpent        Decimal   @default(0) @map("total_spent") @db.Decimal(12, 2)
  
  // Timestamps
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  lastLoginAt       DateTime? @map("last_login_at")
  
  // Relationships
  addresses         UserAddress[]
  orders            Order[]
  wishlists         Wishlist[]
  priceAlerts       PriceAlert[]
  cart              Cart?
  reviews           Review[]
  
  @@map("users")
}

model UserAddress {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  name            String    // e.g., "Home", "Work"
  
  // Address Fields
  streetLine1     String    @map("street_line_1")
  streetLine2     String?   @map("street_line_2")
  city            String
  state           String?
  postalCode      String    @map("postal_code")
  country         String    @default("US")
  
  // Contact
  recipientName   String    @map("recipient_name")
  phone           String?
  
  // Shipping
  isDefault       Boolean   @default(false) @map("is_default")
  isShipping      Boolean   @default(true) @map("is_shipping")
  isBilling       Boolean   @default(true) @map("is_billing")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_addresses")
}

// ============================================
// TCG GAMES & SETS
// ============================================

model TCGGame {
  id              String    @id @default(cuid())
  name            String    // e.g., "Yu-Gi-Oh!", "Pokémon TCG"
  code            String    @unique // e.g., "YGO", "POKEMON", "MTG"
  
  // Display
  slug            String    @unique
  description     String?
  logoUrl         String?   @map("logo_url")
  bannerUrl       String?   @map("banner_url")
  
  // Metadata
  isActive        Boolean   @default(true) @map("is_active")
  sortOrder       Int       @default(0) @map("sort_order")
  
  // Statistics
  totalProducts   Int       @default(0) @map("total_products")
  totalCards      Int       @default(0) @map("total_cards")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  sets            TCGLegacySet[]
  products        Product[]
  
  @@map("tcg_games")
}

model TCGLegacySet {
  id              String    @id @default(cuid())
  gameId          String    @map("game_id")
  
  // Set Information
  name            String    // e.g., "Legend of Blue Eyes White Dragon"
  code            String    // e.g., "LOB"
  setNumber       String?   @map("set_number") // For games that use set numbers
  releaseDate     DateTime? @map("release_date")
  
  // Product Counts
  totalCards      Int       @default(0) @map("total_cards")
  totalCommons    Int       @default(0) @map("total_commons")
  totalUncommons  Int       @default(0) @map("total_uncommons")
  totalRares      Int       @default(0) @map("total_rares")
  
  // Display
  logoUrl         String?   @map("logo_url")
  symbolUrl       String?   @map("symbol_url")
  
  // Metadata
  isActive        Boolean   @default(true) @map("is_active")
  isCurrent       Boolean   @default(false) @map("is_current")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  game            TCGGame   @relation(fields: [gameId], references: [id], onDelete: Cascade)
  products        Product[]
  
  @@unique([gameId, code])
  @@map("tcg_legacy_sets")
}

// ============================================
// PRODUCT & VARIANTS (Core TCG Schema)
// ============================================

model Product {
  id              String    @id @default(cuid())
  
  // Product Type (Single Card, Booster Pack, Box, etc.)
  type            ProductType
  
  // Game & Set (for cards)
  gameId          String?   @map("game_id")
  setId           String?   @map("set_id")
  
  // Basic Info
  name            String
  slug            String    @unique
  
  // Card-specific fields (for SINGLE_CARD type)
  cardNumber      String?   @map("card_number") // Collector number in set
  collectorNumber String?   @map("collector_number") // Alternative name
  
  // Card Type & Attributes
  cardType        String?   @map("card_type") // Monster, Spell, Trap, Creature, etc.
  attribute       String?   // Fire, Water, Earth, Wind, etc.
  archetype       String?   // e.g., "Blue-Eyes", "Exodia"
  
  // Rarity
  rarity          CardRarity?
  
  // Physical Description
  // Note: Condition, Language, Foil are handled in ProductVariant for inventory tracking
  
  // Pricing (base price - final price calculated from variants)
  basePrice       Decimal   @default(0) @map("base_price") @db.Decimal(10, 2)
  marketPrice     Decimal?  @map("market_price") @db.Decimal(10, 2) // TCGPlayer/CardMarket avg
  
  // Stock Management
  trackInventory  Boolean   @default(true) @map("track_inventory")
  lowStockThreshold Int     @default(5) @map("low_stock_threshold")
  
  // Display
  description     String?   @db.Text
  mainImageUrl    String?   @map("main_image_url")
  isFeatured      Boolean   @default(false) @map("is_featured")
  isActive        Boolean   @default(true) @map("is_active")
  
  // SEO
  metaTitle       String?   @map("meta_title")
  metaDescription String?   @map("meta_description")
  
  // Stats
  viewCount       Int       @default(0) @map("view_count")
  soldCount       Int       @default(0) @map("sold_count")
  averageRating   Decimal?  @map("average_rating") @db.Decimal(3, 2)
  reviewCount     Int       @default(0) @map("review_count")
  
  // Timestamps
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  game            TCGGame?  @relation(fields: [gameId], references: [id])
  set             TCGLegacySet? @relation(fields: [setId], references: [id])
  variants        ProductVariant[]
  orderItems      OrderItem[]
  wishlistItems   WishlistItem[]
  priceAlerts     PriceAlert[]
  reviews         Review[]
  images          ProductImage[]
  tags            ProductTag[]
  
  @@index([gameId, isActive])
  @@index([type, isActive])
  @@index([slug])
  @@map("products")
}

// ProductVariant - The actual sellable unit
// Each variant represents a unique combination of:
// - Condition (Mint, Near Mint, etc.)
// - Language (English, Japanese, etc.)
// - Foil Status (Non-Foil, Foil, Holo, etc.)
// - Edition (1st Edition, Unlimited, etc.)
model ProductVariant {
  id              String    @id @default(cuid())
  productId       String    @map("product_id")
  
  // Variant-specific attributes
  condition       CardCondition
  language        CardLanguage
  foilStatus      FoilStatus           @default(NON_FOIL)
  edition         CardEdition?       
  
  // SKU Generation (auto-generated, unique)
  sku             String    @unique
  
  // Pricing (can differ from base price)
  price           Decimal   @db.Decimal(10, 2)
  compareAtPrice  Decimal?  @map("compare_at_price") @db.Decimal(10, 2) // For sales
  
  // Inventory
  quantity        Int       @default(0)
  reservedQty     Int       @default(0) @map("reserved_qty") // Held in carts
  incomingQty     Int       @default(0) @map("incoming_qty") // On reorder
  availableQty    Int       @default(0) @map("available_qty") // quantity - reservedQty
  
  // Stock tracking
  lastStockUpdate DateTime? @map("last_stock_update")
  
  // Barcode
  barcode         String?   @unique
  upc             String?   @unique
  
  // Display
  isActive        Boolean   @default(true) @map("is_active")
  sortOrder       Int       @default(0) @map("sort_order")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  // Relationships
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems      OrderItem[]
  cartItems       CartItem[]
  stockHolds      StockHold[]
  
  // Indexes for performance
  @@index([productId, isActive, quantity])
  @@index([sku])
  @@unique([productId, condition, language, foilStatus, edition])
  @@map("product_variants")
}

model ProductImage {
  id              String    @id @default(cuid())
  productId       String    @map("product_id")
  
  url             String
  altText         String?   @map("alt_text")
  isPrimary       Boolean   @default(false) @map("is_primary")
  sortOrder       Int       @default(0) @map("sort_order")
  
  // CDN/Optimization
  width           Int?
  height          Int?
  fileSize        Int?      @map("file_size")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_images")
}

model ProductTag {
  id              String    @id @default(cuid())
  productId       String    @map("product_id")
  tagId           String    @map("tag_id")
  
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag             Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@unique([productId, tagId])
  @@map("product_tags")
}

model Tag {
  id              String    @id @default(cuid())
  name            String    @unique
  slug            String    @unique
  type            String?   // e.g., "attribute", "archetype", "set"
  
  products        ProductTag[]
  
  @@map("tags")
}

// ============================================
// CART & WISHLIST
// ============================================

model Cart {
  id              String    @id @default(cuid())
  userId          String    @unique @map("user_id")
  sessionId       String?   @map("session_id") // For guest carts
  
  // Totals
  itemCount       Int       @default(0) @map("item_count")
  subtotal        Decimal   @default(0) @map("subtotal") @db.Decimal(12, 2)
  
  // Expiry
  expiresAt       DateTime? @map("expires_at")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           CartItem[]
  
  @@map("carts")
}

model CartItem {
  id              String    @id @default(cuid())
  cartId          String    @map("cart_id")
  variantId       String    @map("variant_id")
  
  quantity        Int       @default(1)
  unitPrice       Decimal   @map("unit_price") @db.Decimal(10, 2) // Price at add time
  
  // Stock hold
  stockHoldId     String?   @map("stock_hold_id")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  cart            Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant         ProductVariant @relation(fields: [variantId], references: [id])
  stockHold       StockHold? @relation(fields: [stockHoldId], references: [id])
  
  @@unique([cartId, variantId])
  @@map("cart_items")
}

// Stock Hold - Prevents overselling during checkout
model StockHold {
  id              String    @id @default(cuid())
  variantId        String    @map("variant_id")
  cartItemId      String?   @map("cart_item_id")
  orderId         String?   @map("order_id")
  
  quantity        Int
  status          StockHoldStatus @default(ACTIVE)
  
  expiresAt       DateTime  @map("expires_at") // Auto-release after X minutes
  
  createdAt       DateTime  @default(now()) @map("created_at")
  releasedAt      DateTime? @map("released_at")
  
  variant         ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  cartItem        CartItem? @relation(fields: [cartItemId], references: [id], onDelete: SetNull)
  order           Order?    @relation(fields: [orderId], references: [id], onDelete: SetNull)
  
  @@index([variantId, status])
  @@map("stock_holds")
}

model Wishlist {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  name            String    @default("My Wishlist") // Multiple wishlists support
  isPublic        Boolean   @default(false) @map("is_public")
  shareToken      String?   @map("share_token") @unique
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           WishlistItem[]
  
  @@map("wishlists")
}

model WishlistItem {
  id              String    @id @default(cuid())
  wishlistId      String    @map("wishlist_id")
  productId       String    @map("product_id")
  variantId       String?   @map("variant_id") // Specific variant
  
  note            String?   // Personal note
  priority        Int       @default(0)
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  wishlist        Wishlist  @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant         ProductVariant? @relation(fields: [variantId], references: [id])
  
  @@unique([wishlistId, productId, variantId])
  @@map("wishlist_items")
}

model PriceAlert {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  productId       String    @map("product_id")
  variantId       String?   @map("variant_id")
  
  targetPrice     Decimal   @map("target_price") @db.Decimal(10, 2)
  isActive        Boolean   @default(true) @map("is_active")
  
  // Notification
  lastNotifiedAt  DateTime? @map("last_notified_at")
  notifyOnAbove   Boolean   @default(false) @map("notify_on_above") // Notify when above target (for selling)
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant         ProductVariant? @relation(fields: [variantId], references: [id])
  
  @@unique([userId, productId, variantId, isActive])
  @@map("price_alerts")
}

// ============================================
// ORDERS
// ============================================

model Order {
  id              String    @id @default(cuid())
  orderNumber     String    @unique @map("order_number") // Human-readable: TCG-2024-00001
  
  userId          String    @map("user_id")
  
  // Status
  status          OrderStatus @default(PENDING_PAYMENT)
  
  // Totals
  subtotal        Decimal   @db.Decimal(12, 2)
  discountAmount  Decimal   @default(0) @map("discount_amount") @db.Decimal(10, 2)
  shippingCost    Decimal   @default(0) @map("shipping_cost") @db.Decimal(10, 2)
  taxAmount       Decimal   @default(0) @map("tax_amount") @db.Decimal(10, 2)
  total           Decimal   @db.Decimal(12, 2)
  
  // Currency
  currency        String    @default("USD")
  
  // Shipping
  shippingMethod  ShippingMethod? @map("shipping_method")
  shippingAddress Json?    @map("shipping_address") // Denormalized for history
  billingAddress  Json?    @map("billing_address")
  
  trackingNumber  String?   @map("tracking_number")
  carrier         String?
  
  // Customer Info (for guest orders)
  customerEmail   String?   @map("customer_email")
  customerName    String?   @map("customer_name")
  
  // Notes
  customerNote    String?   @map("customer_note") @db.Text
  internalNote    String?   @map("internal_note") @db.Text
  
  // Timestamps
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  confirmedAt     DateTime? @map("confirmed_at")
  shippedAt       DateTime? @map("shipped_at")
  deliveredAt     DateTime? @map("delivered_at")
  cancelledAt     DateTime? @map("cancelled_at")
  
  // Relationships
  user            User      @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payment         PaymentTransaction?
  shipments       Shipment[]
  
  @@index([userId, status])
  @@index([orderNumber])
  @@index([status, createdAt])
  @@map("orders")
}

model OrderItem {
  id              String    @id @default(cuid())
  orderId         String    @map("order_id")
  productId       String    @map("product_id")
  variantId       String    @map("variant_id")
  
  // Product Info (denormalized for historical accuracy)
  productName     String    @map("product_name")
  variantSku      String    @map("variant_sku")
  
  // Details
  quantity        Int
  unitPrice       Decimal   @map("unit_price") @db.Decimal(10, 2)
  totalPrice      Decimal   @map("total_price") @db.Decimal(12, 2)
  
  // Card-specific (denormalized)
  condition       CardCondition
  language        CardLanguage
  foilStatus      FoilStatus @map("foil_status")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product   @relation(fields: [productId], references: [id])
  variant         ProductVariant @relation(fields: [variantId], references: [id])
  
  @@index([orderId])
  @@map("order_items")
}

model Shipment {
  id              String    @id @default(cuid())
  orderId         String    @map("order_id")
  
  carrier         String
  service         String?   // e.g., "UPS Ground", "FedEx 2-Day"
  trackingNumber  String?   @map("tracking_number")
  trackingUrl     String?   @map("tracking_url")
  
  status          String    @default("pending") // pending, label_created, in_transit, delivered
  shippedAt       DateTime? @map("shipped_at")
  estimatedDelivery DateTime? @map("estimated_delivery")
  deliveredAt     DateTime? @map("delivered_at")
  
  weight          Decimal?  @db.Decimal(8, 2) // in lbs/kg
  dimensions      String?   // LxWxH
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@map("shipments")
}

// ============================================
// PAYMENTS
// ============================================

model PaymentTransaction {
  id              String    @id @default(cuid())
  orderId         String    @unique @map("order_id")
  
  // Payment Provider
  provider        String    // e.g., "stripe", "paypal"
  providerId      String?   @map("provider_id") // Payment intent/transaction ID
  
  method          PaymentMethod @map("payment_method")
  status          PaymentStatus @default(PENDING)
  
  // Amounts
  amount          Decimal   @db.Decimal(12, 2)
  currency        String    @default("USD")
  refundedAmount  Decimal   @default(0) @map("refunded_amount") @db.Decimal(12, 2)
  
  // Card Details (last 4 only, for display)
  cardLast4       String?   @map("card_last_4")
  cardBrand       String?   @map("card_brand")
  
  // Billing
  billingAddress  Json?     @map("billing_address")
  
  // Timestamps
  authorizedAt    DateTime? @map("authorized_at")
  capturedAt      DateTime? @map("captured_at")
  failedAt        DateTime? @map("failed_at")
  refundedAt      DateTime? @map("refunded_at")
  
  // Error
  failureReason   String?   @map("failure_reason")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  order           Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([providerId])
  @@map("payment_transactions")
}

// ============================================
// REVIEWS
// ============================================

model Review {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  productId       String    @map("product_id")
  
  rating          Int // 1-5
  title           String?
  content         String?   @db.Text
  
  // Verified Purchase
  isVerifiedPurchase Boolean @default(false) @map("is_verified_purchase")
  orderId         String?   @map("order_id")
  
  // Media
  images          Json?     // Array of image URLs
  
  // Moderation
  isApproved      Boolean   @default(true) @map("is_approved")
  isFeatured      Boolean   @default(false) @map("is_featured")
  
  // Helpfulness
  helpfulCount    Int       @default(0) @map("helpful_count")
  notHelpfulCount Int       @default(0) @map("not_helpful_count")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@index([productId, isApproved, createdAt])
  @@map("reviews")
}

// ============================================
// COUPONS & PROMOTIONS
// ============================================

model Coupon {
  id              String    @id @default(cuid())
  code            String    @unique @map("coupon_code")
  
  type            String    // "percentage", "fixed", "free_shipping"
  value           Decimal   @db.Decimal(10, 2)
  
  // Conditions
  minOrderAmount  Decimal?  @map("min_order_amount") @db.Decimal(10, 2)
  maxUses         Int?      @map("max_uses")
  usedCount       Int       @default(0) @map("used_count")
  
  // Per-user limits
  maxUsesPerUser  Int?      @map("max_uses_per_user")
  
  // Validity
  startsAt        DateTime? @map("starts_at")
  expiresAt       DateTime? @map("expires_at")
  
  // Applicable Games
  gameIds         String[]  @map("game_ids") // Empty = all games
  productType     ProductType? @map("product_type")
  
  isActive        Boolean   @default(true) @map("is_active")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  @@map("coupons")
}

// ============================================
// ANALYTICS (Optional - for reporting)
// ============================================

model DailySalesSnapshot {
  id              String    @id @default(cuid())
  date            DateTime  @unique
  
  // Metrics
  totalOrders     Int       @default(0) @map("total_orders")
  totalRevenue    Decimal   @default(0) @map("total_revenue") @db.Decimal(14, 2)
  totalItemsSold  Int       @default(0) @map("total_items_sold")
  averageOrderValue Decimal @default(0) @map("average_order_value") @db.Decimal(12, 2)
  
  // By Game
  salesByGame     Json?     @map("sales_by_game")
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  @@map("daily_sales_snapshots")
}

model InventoryLog {
  id              String    @id @default(cuid())
  variantId       String    @map("variant_id")
  
  // Change
  changeType      String    @map("change_type") // "sale", "return", "adjustment", "restock"
  quantityChange  Int       @map("quantity_change") // Positive or negative
  
  // Before/After
  quantityBefore  Int       @map("quantity_before")
  quantityAfter   Int       @map("quantity_after")
  
  // Reference
  referenceType   String?   @map("reference_type") // "order", "shipment", etc.
  referenceId     String?   @map("reference_id")
  
  note            String?
  
  createdAt       DateTime  @default(now()) @map("created_at")
  
  @@index([variantId, createdAt])
  @@map("inventory_logs")
}
