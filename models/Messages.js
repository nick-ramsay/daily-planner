const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    message: { type: String },
    created_date: {type: Date}
})

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;