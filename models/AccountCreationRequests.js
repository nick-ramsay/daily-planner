const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountCreationRequestsSchema = new Schema({
    email: { type: String },
    emailVerificationToken: {type: String}
})

const AccountCreationRequests = mongoose.model("AccountCreationRequests", AccountCreationRequestsSchema);

module.exports = AccountCreationRequests;