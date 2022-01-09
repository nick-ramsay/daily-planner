const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganisationsSchema = new Schema({
    name: {type: String},
    statuses: {type: Array},
    //Open, Pending, Closed
    linkShortcuts: {type: Array}
    //[name: "Zendesk","prefix":"ZD", identifier: "123456",wildcardString: "https://datadog.zendesk.com/agent/tickets/~LINK_ID~"]
})

const Organisations = mongoose.model("Organisations", OrganisationsSchema);

module.exports = Organisations;