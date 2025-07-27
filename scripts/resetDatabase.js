/**
 * Database Reset Script for Library Management System
 *
 * This script clears all collections except the Staff collection by default,
 * allowing you to start fresh while preserving admin/staff accounts.
 *
 * Collections that will be cleared:
 * - Authors
 * - Publishers
 * - Books
 * - Readers
 * - Loans
 * - Fines
 *
 * Collections that will be preserved by default:
 * - Staff (admin and librarian accounts)
 *
 * Usage:
 *   node scripts/resetDatabase.js           (preserves Staff collection)
 *   node scripts/resetDatabase.js --all     (clears ALL collections including Staff)
 */

const mongoose = require("mongoose");
const Author = require("../models/authorModel");
const Publisher = require("../models/publisherModel");
const Book = require("../models/bookModel");
const Reader = require("../models/readerModel");
const Loan = require("../models/loanModel");
const Fine = require("../models/fineModel");
const Staff = require("../models/staffModel");
require("dotenv").config();

// Parse command line arguments
const args = process.argv.slice(2);
const includeStaff = args.includes("--all");

const resetDatabase = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("✅ Database connected successfully");

    if (includeStaff) {
      console.log("\n🗑️  Starting COMPLETE database reset (clearing ALL collections)...");
    } else {
      console.log("\n🗑️  Starting database reset (preserving Staff collection)...");
    }

    // Define collections to clear
    const collections = [
      { model: Author, name: "Authors" },
      { model: Publisher, name: "Publishers" },
      { model: Book, name: "Books" },
      { model: Reader, name: "Readers" },
      { model: Loan, name: "Loans" },
      { model: Fine, name: "Fines" },
    ];

    // Add Staff collection if --all flag is used
    if (includeStaff) {
      collections.push({ model: Staff, name: "Staff" });
    }

    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      if (count > 0) {
        await collection.model.deleteMany({});
        console.log(`✅ Cleared ${collection.name} collection (${count} documents)`);
      } else {
        console.log(`ℹ️  ${collection.name} collection was already empty`);
      }
    }

    console.log("\n📊 Database reset completed successfully!");
    console.log("📋 Summary:");
    if (includeStaff) {
      console.log("   ✅ ALL collections cleared (including Staff)");
      console.log("   ⚠️  All admin/staff accounts removed");
    } else {
      console.log("   ✅ All data collections cleared");
      console.log("   🔒 Staff collection preserved");
    }
    console.log("   🎯 Ready for fresh testing");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
};

resetDatabase();
