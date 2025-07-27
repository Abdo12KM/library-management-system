const mongoose = require("mongoose");
const dotenv = require("dotenv");
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

