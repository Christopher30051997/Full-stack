import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertAdViewSchema, insertStoreTransactionSchema, insertVideoPromotionSchema, insertNotificationSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getActiveGames();
      res.json(games);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const data = insertGameSchema.parse(req.body);
      const game = await storage.createGame(data);
      res.json(game);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Ad View routes
  app.post("/api/ad-views", async (req, res) => {
    try {
      const data = insertAdViewSchema.parse(req.body);
      
      // Calculate earnings: user gets 20%, admin gets 80%
      const userEarned = Math.floor(data.adValue * 0.2);
      const adminEarned = Math.floor(data.adValue * 0.8);
      
      const adView = await storage.createAdView({
        ...data,
        userEarned,
        adminEarned,
      });

      // Update user's GemasGo points
      const user = await storage.getUser(data.userId);
      if (user) {
        await storage.updateUser(data.userId, {
          gemasGoPoints: user.gemasGoPoints + userEarned,
        });
      }

      res.json(adView);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/ad-views/user/:userId", async (req, res) => {
    try {
      const adViews = await storage.getUserAdViews(req.params.userId);
      res.json(adViews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/ad-views/stats", async (req, res) => {
    try {
      const stats = await storage.getAdViewStats();
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Game Session routes
  app.post("/api/game-sessions", async (req, res) => {
    try {
      const { userId, gameId } = req.body;
      const session = await storage.getOrCreateGameSession(userId, gameId);
      
      // Increment games played
      const updated = await storage.updateGameSession(session.id, session.gamesPlayed + 1);
      
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Store Transaction routes
  app.post("/api/store-transactions", async (req, res) => {
    try {
      const data = insertStoreTransactionSchema.parse(req.body);
      
      // Validate user has enough points
      const user = await storage.getUser(data.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // For GemasGo purchases, don't deduct points (crypto payment)
      if (data.transactionType !== "buy_gemasgo" && user.gemasGoPoints < data.cost) {
        return res.status(400).json({ error: "Insufficient GemasGo points" });
      }

      const transaction = await storage.createStoreTransaction(data);

      // Deduct points for non-crypto purchases
      if (data.transactionType !== "buy_gemasgo") {
        await storage.updateUser(data.userId, {
          gemasGoPoints: user.gemasGoPoints - data.cost,
        });

        // Add lives if purchasing game lives
        if (data.transactionType === "game_lives") {
          await storage.updateUser(data.userId, {
            gameLives: user.gameLives + data.amount,
          });
        }
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/store-transactions/user/:userId", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.params.userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/store-transactions/pending", async (req, res) => {
    try {
      const transactions = await storage.getPendingTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/store-transactions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const transaction = await storage.updateTransactionStatus(req.params.id, status);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Video Promotion routes
  app.post("/api/video-promotions", async (req, res) => {
    try {
      const data = insertVideoPromotionSchema.parse(req.body);
      
      // Validate user has enough points
      const user = await storage.getUser(data.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.gemasGoPoints < data.cost) {
        return res.status(400).json({ error: "Insufficient GemasGo points" });
      }

      const promotion = await storage.createVideoPromotion(data);

      // Deduct cost from user's points
      await storage.updateUser(data.userId, {
        gemasGoPoints: user.gemasGoPoints - data.cost,
      });

      res.json(promotion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/video-promotions/user/:userId", async (req, res) => {
    try {
      const promotions = await storage.getUserPromotions(req.params.userId);
      res.json(promotions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/video-promotions/pending", async (req, res) => {
    try {
      const promotions = await storage.getPendingPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/video-promotions/approved", async (req, res) => {
    try {
      const promotions = await storage.getApprovedPromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/video-promotions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const promotion = await storage.updatePromotionStatus(req.params.id, status);
      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Notification routes
  app.post("/api/notifications", async (req, res) => {
    try {
      const data = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(data);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.params.userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Store Tiers routes
  app.get("/api/store-tiers", async (req, res) => {
    try {
      const tiers = await storage.getStoreTiers();
      res.json(tiers);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/store-tiers/:category", async (req, res) => {
    try {
      const tiers = await storage.getStoreTiersByCategory(req.params.category);
      res.json(tiers);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
