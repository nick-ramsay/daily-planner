const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlansSchema = new Schema({
    plan_name: { type: String },
    plan_status: { type: String },
    created_date: {type: Date},
    account_id: {type: String},
    tasks: {type: Array}
})

const Plans = mongoose.model("Plans", PlansSchema);

module.exports = Plans;