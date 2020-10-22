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
    findPlan: function (req, res) {
        console.log("Called Find One Plans Controller");
        console.log(req.body);
        db.Plans
            .findOne({ _id: req.body.planID })
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
    },
    updatePlanTasks: function (req, res) {
        console.log(req.body);
        db.Plans
            .update({ _id: req.body.planID }, { $set: { tasks: req.body.tasks } })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    updateTask: function (req, res) {
        console.log("Called update task controller!");
        console.log(req.body);

        db.Plans
            .updateOne({ _id: req.body.planID, "tasks.description": req.body.taskDescription },
                {
                    $set: { "tasks.$.status": req.body.newStatus, "tasks.$.hoursLogged": req.body.newHoursLogged }
                }
            )
            // {$position: req.body.taskArrayPosition, hoursLogged: req.body.newHoursLogged, status: req.body.newStatus}}
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    checkExistingTasks: function (req, res) {
        console.log("Called checkExistingTasks Controller");
        console.log(req.body);
        db.Plans
            .findOne({ _id: req.body.planID, "task.$.description":req.body.taskDescription})
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    }
};