import {
  users,
  transactions,
  services,
  verifications,
  rentals,
  pricingSettings,
  type User,
  type UpsertUser,
  type Transaction,
  type InsertTransaction,
  type Service,
  type InsertService,
  type Verification,
  type InsertVerification,
  type Rental,
  type InsertRental,
  type PricingSetting,
  type InsertPricingSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, amount: string): Promise<User>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Verification operations
  createVerification(verification: InsertVerification): Promise<Verification>;
  getUserVerifications(userId: string): Promise<Verification[]>;
  getVerification(id: string): Promise<Verification | undefined>;
  updateVerification(id: string, data: Partial<Verification>): Promise<Verification>;
  
  // Rental operations
  createRental(rental: InsertRental): Promise<Rental>;
  getUserRentals(userId: string): Promise<Rental[]>;
  getRental(id: string): Promise<Rental | undefined>;
  updateRental(id: string, data: Partial<Rental>): Promise<Rental>;
  
  // Pricing operations
  getPricingSettings(): Promise<PricingSetting[]>;
  getPricingSetting(serviceType: string): Promise<PricingSetting | undefined>;
  updatePricingSetting(serviceType: string, basePrice: string): Promise<PricingSetting>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(userId: string, amount: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const currentBalance = parseFloat(user.creditBalance || "0");
    const amountNum = parseFloat(amount);
    const newBalance = (currentBalance + amountNum).toFixed(2);
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        creditBalance: newBalance,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.name);
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(serviceData)
      .returning();
    return service;
  }

  // Verification operations
  async createVerification(verificationData: InsertVerification): Promise<Verification> {
    const [verification] = await db
      .insert(verifications)
      .values(verificationData)
      .returning();
    return verification;
  }

  async getUserVerifications(userId: string): Promise<Verification[]> {
    return await db
      .select()
      .from(verifications)
      .where(eq(verifications.userId, userId))
      .orderBy(desc(verifications.createdAt));
  }

  async getVerification(id: string): Promise<Verification | undefined> {
    const [verification] = await db
      .select()
      .from(verifications)
      .where(eq(verifications.id, id));
    return verification;
  }

  async updateVerification(id: string, data: Partial<Verification>): Promise<Verification> {
    const [verification] = await db
      .update(verifications)
      .set(data)
      .where(eq(verifications.id, id))
      .returning();
    return verification;
  }

  // Rental operations
  async createRental(rentalData: InsertRental): Promise<Rental> {
    const [rental] = await db
      .insert(rentals)
      .values(rentalData)
      .returning();
    return rental;
  }

  async getUserRentals(userId: string): Promise<Rental[]> {
    return await db
      .select()
      .from(rentals)
      .where(eq(rentals.userId, userId))
      .orderBy(desc(rentals.createdAt));
  }

  async getRental(id: string): Promise<Rental | undefined> {
    const [rental] = await db
      .select()
      .from(rentals)
      .where(eq(rentals.id, id));
    return rental;
  }

  async updateRental(id: string, data: Partial<Rental>): Promise<Rental> {
    const [rental] = await db
      .update(rentals)
      .set(data)
      .where(eq(rentals.id, id))
      .returning();
    return rental;
  }

  // Pricing operations
  async getPricingSettings(): Promise<PricingSetting[]> {
    return await db.select().from(pricingSettings);
  }

  async getPricingSetting(serviceType: string): Promise<PricingSetting | undefined> {
    const [setting] = await db
      .select()
      .from(pricingSettings)
      .where(eq(pricingSettings.serviceType, serviceType as any));
    return setting;
  }

  async updatePricingSetting(serviceType: string, basePrice: string): Promise<PricingSetting> {
    const [setting] = await db
      .update(pricingSettings)
      .set({ 
        basePrice,
        updatedAt: new Date()
      })
      .where(eq(pricingSettings.serviceType, serviceType as any))
      .returning();
    return setting;
  }
}

export const storage = new DatabaseStorage();
