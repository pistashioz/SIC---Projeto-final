import mongoose from "mongoose";
import dbConfig from '../config/db.config.js';

const db = {};
db.mongoose = mongoose;

(async () => {
    try {
        console.log(dbConfig.URL);
        await mongoose.connect(dbConfig.URL);
        console.log("Connected to the database!", error);
    } catch (error) {
        console.log("Error connecting to the database:", error);
        process.exit();
    }
})();

db.User = require("./User.model.js")(mongoose);
db.Event = require("./Event.model.js")(mongoose);
db.Tip = require("./Tip.model.js")(mongoose);
db.FavoriteTip = require("./FavoriteTip.model.js")(mongoose);

export default db;