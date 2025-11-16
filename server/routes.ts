import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Transactions are created internally by the system, not by users
  // This endpoint is removed for security reasons

  // Service routes
  app.get('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', isAuthenticated, async (req: any, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Verification routes
  app.get('/api/verifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const verifications = await storage.getUserVerifications(userId);
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      res.status(500).json({ message: "Failed to fetch verifications" });
    }
  });

  app.post('/api/verifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceId } = req.body;

      if (!serviceId) {
        return res.status(400).json({ message: "Service ID is required" });
      }

      // Get service to determine price (server-side pricing)
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const verificationPrice = parseFloat(service.basePrice);

      // Check user has enough credits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const creditBalance = parseFloat(user.creditBalance || "0");

      if (creditBalance < verificationPrice) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Set expiry time (5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Create verification
      const verification = await storage.createVerification({
        userId,
        serviceId,
        price: service.basePrice,
        status: "active",
        expiresAt,
      });

      // Deduct credits and create transaction atomically
      await storage.updateUserCredits(userId, (-verificationPrice).toString());
      await storage.createTransaction({
        userId,
        type: "deduction",
        amount: service.basePrice,
        description: `Phone verification - ${service.name}`,
        status: "completed",
      });

      // TODO: Call third-party SMS API to get phone number
      // This is a placeholder - user will need to configure their SMS API
      // Example integration point:
      // const phoneNumber = await smsApiClient.getNumber(serviceId);
      // await storage.updateVerification(verification.id, { phoneNumber });
      
      // For demo purposes, generate a fake phone number
      const fakePhoneNumber = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await storage.updateVerification(verification.id, { phoneNumber: fakePhoneNumber });

      const updatedVerification = await storage.getVerification(verification.id);
      res.json(updatedVerification);
    } catch (error) {
      console.error("Error creating verification:", error);
      res.status(500).json({ message: "Failed to create verification" });
    }
  });

  app.get('/api/verifications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const verification = await storage.getVerification(req.params.id);
      if (!verification) {
        return res.status(404).json({ message: "Verification not found" });
      }
      res.json(verification);
    } catch (error) {
      console.error("Error fetching verification:", error);
      res.status(500).json({ message: "Failed to fetch verification" });
    }
  });

  // Rental routes
  app.get('/api/rentals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rentals = await storage.getUserRentals(userId);
      res.json(rentals);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      res.status(500).json({ message: "Failed to fetch rentals" });
    }
  });

  app.post('/api/rentals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, durationDays } = req.body;

      if (!type || !durationDays) {
        return res.status(400).json({ message: "Type and duration are required" });
      }

      // Get pricing from settings (server-side pricing)
      const settingType = type === "renewable" ? "renewable_rental" : "non_renewable_rental";
      const pricingSetting = await storage.getPricingSetting(settingType);
      if (!pricingSetting) {
        return res.status(404).json({ message: "Pricing not found" });
      }

      const rentalPrice = parseFloat(pricingSetting.basePrice);

      // Check user has enough credits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const creditBalance = parseFloat(user.creditBalance || "0");

      if (creditBalance < rentalPrice) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Calculate expiry date
      const startDate = new Date();
      const expiresAt = new Date(startDate);
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // Generate fake phone number for demo
      const fakePhoneNumber = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create rental
      const rental = await storage.createRental({
        userId,
        type: type as "non_renewable" | "renewable",
        durationDays,
        price: pricingSetting.basePrice,
        phoneNumber: fakePhoneNumber,
        startDate,
        expiresAt,
        autoRenew: type === "renewable",
        status: "active",
      });

      // Deduct credits and create transaction
      await storage.updateUserCredits(userId, (-rentalPrice).toString());
      await storage.createTransaction({
        userId,
        type: "deduction",
        amount: pricingSetting.basePrice,
        description: `${type === 'renewable' ? 'Renewable' : 'Non-renewable'} rental (${durationDays} days)`,
        status: "completed",
      });

      // TODO: Call third-party SMS API to rent phone number
      // const phoneNumber = await smsApiClient.rentNumber(durationDays);
      // await storage.updateRental(rental.id, { phoneNumber });

      res.json(rental);
    } catch (error) {
      console.error("Error creating rental:", error);
      res.status(500).json({ message: "Failed to create rental" });
    }
  });

  // Stripe payment routes - accepts only predefined credit packages
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { packageAmount } = req.body;

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(501).json({ 
          message: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." 
        });
      }

      // Validate that packageAmount is one of the allowed values (server-side validation)
      const allowedPackages = [5, 10, 25, 50, 100];
      const amount = parseFloat(packageAmount);

      if (!allowedPackages.includes(amount)) {
        return res.status(400).json({ 
          message: "Invalid package amount. Must be one of: $5, $10, $25, $50, $100" 
        });
      }

      // Stripe integration (will be activated when keys are provided)
      const Stripe = require("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          packageAmount: amount.toString(), // Store for verification later
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Credits purchase endpoint - ONLY called after successful Stripe payment
  app.post("/api/credits/purchase", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(501).json({ 
          message: "Stripe is not configured. Cannot process credit purchase." 
        });
      }

      // Verify payment with Stripe and get amount from there (server-side)
      const Stripe = require("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment has not succeeded" });
      }

      // Get amount from Stripe payment (convert from cents to dollars)
      const amount = (paymentIntent.amount / 100).toFixed(2);

      // Add credits to user account
      await storage.updateUserCredits(userId, amount);

      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: "purchase",
        amount,
        description: "Credit purchase",
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
      });

      res.json({ success: true, transaction });
    } catch (error) {
      console.error("Error processing credit purchase:", error);
      res.status(500).json({ message: "Failed to process credit purchase" });
    }
  });

  // Pricing settings routes (admin)
  app.get('/api/settings/pricing', isAuthenticated, async (req: any, res) => {
    try {
      const settings = await storage.getPricingSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching pricing settings:", error);
      res.status(500).json({ message: "Failed to fetch pricing settings" });
    }
  });

  app.put('/api/settings/pricing/:serviceType', isAuthenticated, async (req: any, res) => {
    try {
      const { serviceType } = req.params;
      const { basePrice } = req.body;
      
      const setting = await storage.updatePricingSetting(serviceType, basePrice);
      res.json(setting);
    } catch (error) {
      console.error("Error updating pricing setting:", error);
      res.status(500).json({ message: "Failed to update pricing setting" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
