const fs = require("fs");
const { importDataToDB, deleteCollectionData } = require("./seed");
const Reader = require("../models/readerModel");

const obj = {
    readers: {
        model: Reader,
        filePath: `${__dirname}/readers.json`,
    }
}

const list = JSON.parse(
    fs.readFileSync(obj[process.argv[3]].filePath, "utf-8")
);

if (process.argv[2] == "--import") {
    importDataToDB(obj[process.argv[3]].model, list);
} else if (process.argv[2] == "--delete") {
    deleteCollectionData(obj[process.argv[3]].model);
}
