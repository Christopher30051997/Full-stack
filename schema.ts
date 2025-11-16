import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  language: varchar("language", { length: 5 }).notNull().default("es"),
  gemasGoPoints: integer("gemasgo_points").notNull().default(0),
  gameLives: integer("game_lives").notNull().default(5),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Games table
export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  gameUrl: text("game_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Ad views tracking
export const adViews = pgTable("ad_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  adValue: integer("ad_value").notNull(),
  userEarned: integer("user_earned").notNull(),
  adminEarned: integer("admin_earned").notNull(),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

// Game sessions
export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameId: varchar("game_id").notNull().references(() => games.id),
  gamesPlayed: integer("games_played").notNull().default(0),
  lastPlayedAt: timestamp("last_played_at").notNull().defaultNow(),
});

// Store transactions
export const storeTransactions = pgTable("store_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // 'free_fire', 'game_lives', 'buy_gemasgo'
  tier: integer("tier"),
  amount: integer("amount").notNull(),
  cost: integer("cost").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'completed', 'cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Video promotions
export const videoPromotions = pgTable("video_promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform", { length: 20 }).notNull(), // 'youtube', 'tiktok', 'facebook'
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in days
  goalType: varchar("goal_type", { length: 20 }).notNull(), // 'likes', 'views'
  goalAmount: integer("goal_amount").notNull(),
  cost: integer("cost").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'approved', 'rejected', 'active', 'completed'
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications/Messages
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromAdmin: boolean("from_admin").notNull().default(false),
  message: text("message").notNull(),
  imageUrl: text("image_url"), // For payment receipts
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Store tiers configuration
export const storeTiers = pgTable("store_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category", { length: 50 }).notNull(), // 'free_fire', 'game_lives', 'buy_gemasgo'
  tier: integer("tier").notNull(),
  amount: integer("amount").notNull(),
  cost: integer("cost").notNull(),
  label: text("label").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  adViews: many(adViews),
  gameSessions: many(gameSessions),
  storeTransactions: many(storeTransactions),
  videoPromotions: many(videoPromotions),
  notifications: many(notifications),
}));

export const adViewsRelations = relations(adViews, ({ one }) => ({
  user: one(users, {
    fields: [adViews.userId],
    references: [users.id],
  }),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
  game: one(games, {
    fields: [gameSessions.gameId],
    references: [games.id],
  }),
}));

export const storeTransactionsRelations = relations(storeTransactions, ({ one }) => ({
  user: one(users, {
    fields: [storeTransactions.userId],
    references: [users.id],
  }),
}));

export const videoPromotionsRelations = relations(videoPromotions, ({ one }) => ({
  user: one(users, {
    fields: [videoPromotions.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  gemasGoPoints: true,
  gameLives: true,
  isAdmin: true,
  createdAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export const insertAdViewSchema = createInsertSchema(adViews).omit({
  id: true,
  viewedAt: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  lastPlayedAt: true,
});

export const insertStoreTransactionSchema = createInsertSchema(storeTransactions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertVideoPromotionSchema = createInsertSchema(videoPromotions).omit({
  id: true,
  status: true,
  approvedAt: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertStoreTierSchema = createInsertSchema(storeTiers).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertAdView = z.infer<typeof insertAdViewSchema>;
export type AdView = typeof adViews.$inferSelect;

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

export type InsertStoreTransaction = z.infer<typeof insertStoreTransactionSchema>;
export type StoreTransaction = typeof storeTransactions.$inferSelect;

export type InsertVideoPromotion = z.infer<typeof insertVideoPromotionSchema>;
export type VideoPromotion = typeof videoPromotions.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertStoreTier = z.infer<typeof insertStoreTierSchema>;
export type StoreTier = typeof storeTiers.$inferSelect;
