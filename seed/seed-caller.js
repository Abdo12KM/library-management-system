const fs = require("fs");
const { importDataToDB, deleteCollectionData, seedAllData, deleteAllData } = require("./seed");
const Reader = require("../models/readerModel");
const Author = require("../models/authorModel");
const Publisher = require("../models/publisherModel");
const Staff = require("../models/staffModel");
const Book = require("../models/bookModel");
const Loan = require("../models/loanModel");
const Fine = require("../models/fineModel");

const obj = {
    readers: {
        model: Reader,
        filePath: `${__dirname}/readers.json`,
    },
    authors: {
        model: Author,
        filePath: `${__dirname}/authors.json`,
    },
    publishers: {
        model: Publisher,
        filePath: `${__dirname}/publishers.json`,
    },
    staff: {
        model: Staff,
        filePath: `${__dirname}/staff.json`,
    },
    books: {
        model: Book,
        filePath: `${__dirname}/books.json`,
    },
    loans: {
        model: Loan,
        filePath: `${__dirname}/loans.json`,
    },
    fines: {
        model: Fine,
        filePath: `${__dirname}/fines.json`,
    }
}

// Handle seeding all data at once
if (process.argv[2] == "--seed-all") {
    seedAllData();
} else if (process.argv[2] == "--delete-all") {
    deleteAllData();
} else if (process.argv[3]) {
    // Handle individual model seeding
    const list = JSON.parse(
        fs.readFileSync(obj[process.argv[3]].filePath, "utf-8")
    );

    if (process.argv[2] == "--import") {
        importDataToDB(obj[process.argv[3]].model, list);
    } else if (process.argv[2] == "--delete") {
        deleteCollectionData(obj[process.argv[3]].model);
    }
} else {
    console.log("Usage:");
    console.log("  --seed-all                     Seed all data in correct order");
    console.log("  --delete-all                   Delete all data");
    console.log("  --import <model>               Import data for specific model");
    console.log("  --delete <model>               Delete data for specific model");
    console.log("");
    console.log("Available models: readers, authors, publishers, staff, books, loans, fines");
}
