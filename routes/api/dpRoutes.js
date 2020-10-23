const router = require("express").Router();
const dpControllers = require("../../controllers/dpControllers");

router
  .route("/create-plan")
  .post(dpControllers.createPlan);

router
  .route("/find-all-plans")
  .post(dpControllers.findAllPlans);

router
  .route("/find-plan")
  .post(dpControllers.findPlan);

router
  .route("/delete-one-plan")
  .post(dpControllers.deleteOnePlan);

router
  .route("/update-plan-tasks")
  .post(dpControllers.updatePlanTasks);

router
  .route("/update-task")
  .post(dpControllers.updateTask);

router
  .route("/check-existing-tasks")
  .post(dpControllers.checkExistingTasks);

router
  .route("/link-jira")
  .post(dpControllers.linkJIRA);

module.exports = router;
