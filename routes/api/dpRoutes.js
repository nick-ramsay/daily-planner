const router = require("express").Router();
const dpControllers = require("../../controllers/dpControllers");

//START: Account Routes...

router
  .route("/send-email")
  .post(dpControllers.sendEmail);

router
  .route("/set-email-verification-token")
  .post(dpControllers.setEmailVerficationToken)

router
  .route("/check-email-verification-token")
  .post(dpControllers.checkEmailVerificationToken)

router
  .route("/delete-email-verification-token")
  .post(dpControllers.deleteEmailVerificationToken)

router
  .route("/create-account")
  .post(dpControllers.createAccount);

router
  .route("/check-existing-account-emails")
  .post(dpControllers.checkExistingAccountEmails);

router
  .route("/reset-password-request")
  .post(dpControllers.resetPasswordRequest);

router
  .route("/check-email-and-reset-token")
  .post(dpControllers.checkEmailAndToken);

router
  .route("/reset-password")
  .post(dpControllers.resetPassword);

router
  .route("/reset-login")
  .post(dpControllers.login);

router
  .route("/set-session-access-token")
  .post(dpControllers.setSessionAccessToken);

router
  .route("/fetch-account-details")
  .post(dpControllers.fetchAccountDetails);

router
  .route("/test-backend-token")
  .post(dpControllers.testBackendToken);

router
  .route("/find-user-name")
  .post(dpControllers.findUserName)

router
  .route("/find-auto-tasks")
  .post(dpControllers.findAutoTasks)

router
  .route("/save-auto-task")
  .post(dpControllers.saveAutoTask)

router
  .route("/auto-task-on-off")
  .post(dpControllers.autoTaskOnOff)

//END: User Account Routes...

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
  .route("/replace-task-array")
  .put(dpControllers.replaceTaskArray);

router
  .route("/update-task-order")
  .post(dpControllers.updateTaskOrder);


router
  .route("/find-importable-plans")
  .post(dpControllers.findImportablePlans);

router
  .route("/find-import-punted-tasks")
  .post(dpControllers.findImportPuntedTasks);

router
  .route("/import-tasks")
  .post(dpControllers.importTasks);

router
  .route("/delete-task")
  .post(dpControllers.deleteTask);

router
  .route("/sync-with-zendesk")
  .post(dpControllers.syncWithZendesk);

module.exports = router;
