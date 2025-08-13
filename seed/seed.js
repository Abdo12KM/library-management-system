const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({
    path: "./.env"
})

mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
        console.log("DB connection successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });

exports.importDataToDB = (Model, data) => {
    Model.create(data)
        .then(() => {
            console.log(`Data seeded successfully into ${Model.modelName}`);
        })
        .catch((err) => {
            console.error(`Error seeding ${Model.modelName}:`, err);
        })
        .finally(() => {
            process.exit();
        });
};

exports.deleteCollectionData = (Model) => {
    Model.deleteMany({})
        .then(() => {
            console.log(`All documents deleted from ${Model.modelName}`);
        })
        .catch((err) => {
            console.error(`Error deleting documents from ${Model.modelName}:`, err);
        })
        .finally(() => {
            process.exit();
        });
};

exports.seedAllData = async () => {
    try {
        const Reader = require("../models/readerModel");
        const Author = require("../models/authorModel");
        const Publisher = require("../models/publisherModel");
        const Staff = require("../models/staffModel");
        const Book = require("../models/bookModel");

        console.log("Starting complete database seeding...");

        // Step 1: Seed Authors
        console.log("Seeding Authors...");
        const authorsData = JSON.parse(fs.readFileSync(`${__dirname}/authors.json`, "utf-8"));
        await Author.create(authorsData);
        console.log("✓ Authors seeded successfully");

        // Step 2: Seed Publishers
        console.log("Seeding Publishers...");
        const publishersData = JSON.parse(fs.readFileSync(`${__dirname}/publishers.json`, "utf-8"));
        await Publisher.create(publishersData);
        console.log("✓ Publishers seeded successfully");

        // Step 3: Seed Staff
        console.log("Seeding Staff...");
        const staffData = JSON.parse(fs.readFileSync(`${__dirname}/staff.json`, "utf-8"));
        await Staff.create(staffData);
        console.log("✓ Staff seeded successfully");

        // Step 4: Seed Readers
        console.log("Seeding Readers...");
        const readersData = JSON.parse(fs.readFileSync(`${__dirname}/readers.json`, "utf-8"));
        await Reader.create(readersData);
        console.log("✓ Readers seeded successfully");

        // Step 5: Seed Books (with reference resolution)
        console.log("Seeding Books...");
        const booksData = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, "utf-8"));
        
        // Get all authors and publishers to map names to IDs
        const authors = await Author.find({});
        const publishers = await Publisher.find({});
        
        const authorMap = {};
        const publisherMap = {};
        
        authors.forEach(author => {
            authorMap[author.author_name] = author._id;
        });
        
        publishers.forEach(publisher => {
            publisherMap[publisher.publisher_name] = publisher._id;
        });

        // Transform books data to use actual ObjectIds
        const booksWithRefs = booksData.map(book => {
            const { author_name, publisher_name, ...bookData } = book;
            
            if (!authorMap[author_name]) {
                throw new Error(`Author "${author_name}" not found in database`);
            }
            if (!publisherMap[publisher_name]) {
                throw new Error(`Publisher "${publisher_name}" not found in database`);
            }
            
            return {
                ...bookData,
                authorId: authorMap[author_name],
                publisherId: publisherMap[publisher_name],
                release_date: new Date(book.release_date)
            };
        });

        await Book.create(booksWithRefs);
        console.log("✓ Books seeded successfully");

        console.log("\n🎉 All data seeded successfully!");
        console.log("Database contents:");
        console.log(`- ${authorsData.length} Authors`);
        console.log(`- ${publishersData.length} Publishers`);
        console.log(`- ${staffData.length} Staff members`);
        console.log(`- ${readersData.length} Readers`);
        console.log(`- ${booksData.length} Books`);

    } catch (error) {
        console.error("Error seeding all data:", error);
    } finally {
        process.exit();
    }
};

exports.deleteAllData = async () => {
    try {
        const Reader = require("../models/readerModel");
        const Author = require("../models/authorModel");
        const Publisher = require("../models/publisherModel");
        const Staff = require("../models/staffModel");
        const Book = require("../models/bookModel");
        const Loan = require("../models/loanModel");
        const Fine = require("../models/fineModel");

        console.log("Deleting all data from database...");

        // Delete in reverse order to handle dependencies
        await Fine.deleteMany({});
        console.log("✓ Fines deleted");

        await Loan.deleteMany({});
        console.log("✓ Loans deleted");

        await Book.deleteMany({});
        console.log("✓ Books deleted");

        await Reader.deleteMany({});
        console.log("✓ Readers deleted");

        await Staff.deleteMany({});
        console.log("✓ Staff deleted");

        await Publisher.deleteMany({});
        console.log("✓ Publishers deleted");

        await Author.deleteMany({});
        console.log("✓ Authors deleted");

        console.log("\n🗑️  All data deleted successfully!");

    } catch (error) {
        console.error("Error deleting all data:", error);
    } finally {
        process.exit();
    }
};

