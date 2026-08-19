import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('customer'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  status: text('status').notNull().default('submitted'),
  config: jsonb('config').notNull(),
  pricing: jsonb('pricing').notNull(),
  shippingAddress: jsonb('shipping_address').notNull(),
  paymentMethod: text('payment_method').default('upi'),
  paymentStatus: text('payment_status').default('paid'),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  categoryId: text('category_id').notNull(),
  categoryName: text('category_name').notNull(),
  style: text('style').notNull(),
  description: text('description'),
  artImage: text('art_image').notNull(),
  beforeImage: text('before_image'),
  featured: boolean('featured').default(false),
  startingPrice: real('starting_price').notNull(),
  artistName: text('artist_name'),
  faceCount: integer('face_count').default(1),
  mediumDetails: text('medium_details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const comparisonPairs = pgTable('comparison_pairs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  medium: text('medium').notNull(),
  artist: text('artist').notNull(),
  originalImage: text('original_image').notNull(),
  artImage: text('art_image').notNull(),
  description: text('description'),
  faceCount: text('face_count').default('2 Faces'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
