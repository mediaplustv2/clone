import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  numeric,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  creditBalance: numeric("credit_balance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Transactions table - track credit purchases and deductions
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { enum: ["purchase", "deduction"] }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed"] }).default("completed").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Services table - supported platforms for verification
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: text("logo_url"),
  category: varchar("category", { length: 100 }),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Verifications table - one-time verification purchases
export const verifications = pgTable("verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  phoneNumber: varchar("phone_number", { length: 20 }),
  status: varchar("status", { enum: ["pending", "active", "completed", "expired", "failed"] }).default("pending").notNull(),
  code: varchar("code", { length: 20 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  createdAt: true,
});

export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Verification = typeof verifications.$inferSelect;

// Rentals table - phone number rentals
export const rentals = pgTable("rentals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  type: varchar("type", { enum: ["non_renewable", "renewable"] }).notNull(),
  durationDays: integer("duration_days").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  autoRenew: boolean("auto_renew").default(false).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { enum: ["active", "expired", "cancelled"] }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRentalSchema = createInsertSchema(rentals).omit({
  id: true,
  createdAt: true,
});

export type InsertRental = z.infer<typeof insertRentalSchema>;
export type Rental = typeof rentals.$inferSelect;

// Pricing settings table - admin adjustable pricing
export const pricingSettings = pgTable("pricing_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceType: varchar("service_type", { enum: ["verification", "non_renewable_rental", "renewable_rental"] }).notNull().unique(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPricingSettingSchema = createInsertSchema(pricingSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertPricingSetting = z.infer<typeof insertPricingSettingSchema>;
export type PricingSetting = typeof pricingSettings.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  verifications: many(verifications),
  rentals: many(rentals),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const verificationsRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [verifications.serviceId],
    references: [services.id],
  }),
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user: one(users, {
    fields: [rentals.userId],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  verifications: many(verifications),
}));
