const db = require("../models");

module.exports = {
    createPlan: function (req, res) {
        console.log("Called Create Plan controller");
        console.log(req.body);
        db.Plans
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findAllPlans: function (req, res) {
        console.log("Called Find All Plans Controller");
        db.Plans
            .find({})
            .sort({ created_date: -1 })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    deleteOnePlan: function (req, res) {
        console.log(req.body);
        db.Plans
            .deleteOne({ _id: req.body.planID })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    }
};