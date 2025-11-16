import { 
  users, 
  games, 
  adViews, 
  gameSessions, 
  storeTransactions, 
  videoPromotions, 
  notifications, 
  storeTiers,
  type User, 
  type InsertUser,
  type Game,
  type InsertGame,
  type AdView,
  type InsertAdView,
  type GameSession,
  type InsertGameSession,
  type StoreTransaction,
  type InsertStoreTransaction,
  type VideoPromotion,
  type InsertVideoPromotion,
  type Notification,
  type InsertNotification,
  type StoreTier,
  type InsertStoreTier,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  // Games
  getAllGames(): Promise<Game[]>;
  getActiveGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, data: Partial<Game>): Promise<Game | undefined>;
  
  // Ad Views
  createAdView(adView: InsertAdView): Promise<AdView>;
  getUserAdViews(userId: string): Promise<AdView[]>;
  getAdViewStats(): Promise<{ total: number; totalValue: number; userEarnings: number; adminEarnings: number }>;
  
  // Game Sessions
  getOrCreateGameSession(userId: string, gameId: string): Promise<GameSession>;
  updateGameSession(id: string, gamesPlayed: number): Promise<GameSession | undefined>;
  
  // Store Transactions
  createStoreTransaction(transaction: InsertStoreTransaction): Promise<StoreTransaction>;
  getUserTransactions(userId: string): Promise<StoreTransaction[]>;
  getPendingTransactions(): Promise<StoreTransaction[]>;
  updateTransactionStatus(id: string, status: string): Promise<StoreTransaction | undefined>;
  
  // Video Promotions
  createVideoPromotion(promotion: InsertVideoPromotion): Promise<VideoPromotion>;
  getUserPromotions(userId: string): Promise<VideoPromotion[]>;
  getPendingPromotions(): Promise<VideoPromotion[]>;
  getApprovedPromotions(): Promise<VideoPromotion[]>;
  updatePromotionStatus(id: string, status: string): Promise<VideoPromotion | undefined>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  
  // Store Tiers
  getStoreTiers(): Promise<StoreTier[]>;
  getStoreTiersByCategory(category: string): Promise<StoreTier[]>;
  createStoreTier(tier: InsertStoreTier): Promise<StoreTier>;
  updateStoreTier(id: string, data: Partial<StoreTier>): Promise<StoreTier | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Games
  async getAllGames(): Promise<Game[]> {
    return db.select().from(games).orderBy(desc(games.createdAt));
  }

  async getActiveGames(): Promise<Game[]> {
    return db.select().from(games).where(eq(games.isActive, true)).orderBy(desc(games.createdAt));
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame)
      .returning();
    return game;
  }

  async updateGame(id: string, data: Partial<Game>): Promise<Game | undefined> {
    const [game] = await db
      .update(games)
      .set(data)
      .where(eq(games.id, id))
      .returning();
    return game || undefined;
  }

  // Ad Views
  async createAdView(insertAdView: InsertAdView): Promise<AdView> {
    const [adView] = await db
      .insert(adViews)
      .values(insertAdView)
      .returning();
    return adView;
  }

  async getUserAdViews(userId: string): Promise<AdView[]> {
    return db.select().from(adViews).where(eq(adViews.userId, userId)).orderBy(desc(adViews.viewedAt));
  }

  async getAdViewStats(): Promise<{ total: number; totalValue: number; userEarnings: number; adminEarnings: number }> {
    const result = await db
      .select({
        total: count(),
        totalValue: sum(adViews.adValue),
        userEarnings: sum(adViews.userEarned),
        adminEarnings: sum(adViews.adminEarned),
      })
      .from(adViews);

    return {
      total: Number(result[0]?.total || 0),
      totalValue: Number(result[0]?.totalValue || 0),
      userEarnings: Number(result[0]?.userEarnings || 0),
      adminEarnings: Number(result[0]?.adminEarned || 0),
    };
  }

  // Game Sessions
  async getOrCreateGameSession(userId: string, gameId: string): Promise<GameSession> {
    const [existing] = await db
      .select()
      .from(gameSessions)
      .where(and(eq(gameSessions.userId, userId), eq(gameSessions.gameId, gameId)));

    if (existing) {
      return existing;
    }

    const [session] = await db
      .insert(gameSessions)
      .values({ userId, gameId, gamesPlayed: 0 })
      .returning();
    return session;
  }

  async updateGameSession(id: string, gamesPlayed: number): Promise<GameSession | undefined> {
    const [session] = await db
      .update(gameSessions)
      .set({ gamesPlayed, lastPlayedAt: new Date() })
      .where(eq(gameSessions.id, id))
      .returning();
    return session || undefined;
  }

  // Store Transactions
  async createStoreTransaction(insertTransaction: InsertStoreTransaction): Promise<StoreTransaction> {
    const [transaction] = await db
      .insert(storeTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<StoreTransaction[]> {
    return db.select().from(storeTransactions).where(eq(storeTransactions.userId, userId)).orderBy(desc(storeTransactions.createdAt));
  }

  async getPendingTransactions(): Promise<StoreTransaction[]> {
    return db.select().from(storeTransactions).where(eq(storeTransactions.status, "pending")).orderBy(desc(storeTransactions.createdAt));
  }

  async updateTransactionStatus(id: string, status: string): Promise<StoreTransaction | undefined> {
    const [transaction] = await db
      .update(storeTransactions)
      .set({ status })
      .where(eq(storeTransactions.id, id))
      .returning();
    return transaction || undefined;
  }

  // Video Promotions
  async createVideoPromotion(insertPromotion: InsertVideoPromotion): Promise<VideoPromotion> {
    const [promotion] = await db
      .insert(videoPromotions)
      .values(insertPromotion)
      .returning();
    return promotion;
  }

  async getUserPromotions(userId: string): Promise<VideoPromotion[]> {
    return db.select().from(videoPromotions).where(eq(videoPromotions.userId, userId)).orderBy(desc(videoPromotions.createdAt));
  }

  async getPendingPromotions(): Promise<VideoPromotion[]> {
    return db.select().from(videoPromotions).where(eq(videoPromotions.status, "pending")).orderBy(desc(videoPromotions.createdAt));
  }

  async getApprovedPromotions(): Promise<VideoPromotion[]> {
    return db.select().from(videoPromotions).where(eq(videoPromotions.status, "approved")).orderBy(desc(videoPromotions.createdAt));
  }

  async updatePromotionStatus(id: string, status: string): Promise<VideoPromotion | undefined> {
    const [promotion] = await db
      .update(videoPromotions)
      .set({ status, approvedAt: status === "approved" ? new Date() : undefined })
      .where(eq(videoPromotions.id, id))
      .returning();
    return promotion || undefined;
  }

  // Notifications
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification || undefined;
  }

  // Store Tiers
  async getStoreTiers(): Promise<StoreTier[]> {
    return db.select().from(storeTiers).where(eq(storeTiers.isActive, true));
  }

  async getStoreTiersByCategory(category: string): Promise<StoreTier[]> {
    return db.select().from(storeTiers).where(and(eq(storeTiers.category, category), eq(storeTiers.isActive, true)));
  }

  async createStoreTier(insertTier: InsertStoreTier): Promise<StoreTier> {
    const [tier] = await db
      .insert(storeTiers)
      .values(insertTier)
      .returning();
    return tier;
  }

  async updateStoreTier(id: string, data: Partial<StoreTier>): Promise<StoreTier | undefined> {
    const [tier] = await db
      .update(storeTiers)
      .set(data)
      .where(eq(storeTiers.id, id))
      .returning();
    return tier || undefined;
  }
}

export const storage = new DatabaseStorage();
