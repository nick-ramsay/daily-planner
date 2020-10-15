const router = require("express").Router();
const dpControllers = require("../../controllers/dpControllers");

router
  .route("/create-message")
  .post(dpControllers.createMessage);

router
  .route("/find-all-messages")
  .post(dpControllers.findAllMessages);

router
  .route("/delete-one-message")
  .post(dpControllers.deleteOneMessage);

module.exports = router;
