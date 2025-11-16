import { db } from "./db";
import { services, pricingSettings } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  try {
    // Seed pricing settings
    console.log("Creating pricing settings...");
    await db.insert(pricingSettings)
      .values([
        {
          serviceType: "verification",
          basePrice: "0.25",
          description: "One-time SMS verification",
        },
        {
          serviceType: "non_renewable_rental",
          basePrice: "1.50",
          description: "1-14 day phone number rental",
        },
        {
          serviceType: "renewable_rental",
          basePrice: "5.00",
          description: "Monthly renewable phone number rental",
        },
      ])
      .onConflictDoNothing();

    // Seed services
    console.log("Creating services...");
    const servicesList = [
      { name: "Google", slug: "google", category: "Social Media", basePrice: "0.25" },
      { name: "Tinder", slug: "tinder", category: "Dating", basePrice: "0.30" },
      { name: "PayPal", slug: "paypal", category: "Finance", basePrice: "0.25" },
      { name: "Uber", slug: "uber", category: "Rideshare", basePrice: "0.25" },
      { name: "Twitter", slug: "twitter", category: "Social Media", basePrice: "0.25" },
      { name: "Facebook", slug: "facebook", category: "Social Media", basePrice: "0.25" },
      { name: "Amazon", slug: "amazon", category: "E-commerce", basePrice: "0.25" },
      { name: "WhatsApp", slug: "whatsapp", category: "Messaging", basePrice: "0.25" },
      { name: "Instagram", slug: "instagram", category: "Social Media", basePrice: "0.25" },
      { name: "LinkedIn", slug: "linkedin", category: "Professional", basePrice: "0.30" },
      { name: "Snapchat", slug: "snapchat", category: "Social Media", basePrice: "0.25" },
      { name: "Discord", slug: "discord", category: "Messaging", basePrice: "0.25" },
      { name: "Telegram", slug: "telegram", category: "Messaging", basePrice: "0.25" },
      { name: "Microsoft", slug: "microsoft", category: "Technology", basePrice: "0.25" },
      { name: "Apple", slug: "apple", category: "Technology", basePrice: "0.30" },
      { name: "Netflix", slug: "netflix", category: "Entertainment", basePrice: "0.25" },
      { name: "Spotify", slug: "spotify", category: "Entertainment", basePrice: "0.25" },
      { name: "eBay", slug: "ebay", category: "E-commerce", basePrice: "0.25" },
      { name: "Airbnb", slug: "airbnb", category: "Travel", basePrice: "0.30" },
      { name: "Lyft", slug: "lyft", category: "Rideshare", basePrice: "0.25" },
    ];

    await db.insert(services)
      .values(servicesList.map(s => ({ ...s, isActive: true })))
      .onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
