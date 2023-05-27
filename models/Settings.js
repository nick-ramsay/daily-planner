const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
    accountID: { type: String },
    autoLinks: { type: Array},
})

const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;