const router = require("express").Router();
const dpControllers = require("../../controllers/dpControllers");

router
  .route("/create-plan")
  .post(dpControllers.createPlan);

router
  .route("/find-all-plans")
  .post(dpControllers.findAllPlans);

router
  .route("/delete-one-plan")
  .post(dpControllers.deleteOnePlan);

module.exports = router;
