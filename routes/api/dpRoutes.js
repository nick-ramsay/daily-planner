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

router
  .route("/remove-jira")
  .post(dpControllers.removeJira);

router
  .route("/update-task-order")
  .post(dpControllers.updateTaskOrder);


router
  .route("/find-importable-plans")
  .post(dpControllers.findImportablePlans);

router
  .route("/find-import-punted-tasks")
  .post(dpControllers.findImportPuntedTasks);

module.exports = router;
