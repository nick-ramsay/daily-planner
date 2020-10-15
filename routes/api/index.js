const router = require("express").Router();
const dpRoutes = require("./dpRoutes");

// daily-planner routes
router.use("/daily-planner", dpRoutes);

module.exports = router;