const db = require("../models");

module.exports = {
    createMessage: function (req, res) {
        console.log("Called Create Message controller");
        console.log(req.body);
        db.Messages
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findAllMessages: function (req, res) {
        console.log("Called Find All Messages Controller");
        db.Messages
            .find({})
            .sort({ created_date: -1 })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    deleteOneMessage: function (req, res) {
        console.log(req.body);
        db.Messages
            .deleteOne({ _id: req.body.messageID })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    }
};