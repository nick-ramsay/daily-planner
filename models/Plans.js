const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlansSchema = new Schema({
    plan_name: { type: String },
    created_date: {type: Date}
})

const Plans = mongoose.model("Plans", PlansSchema);

module.exports = Plans;