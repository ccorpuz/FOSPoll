const express = require("express");
const router = express.Router();

// @route   GET api/polls/test
// @desc    Tests polls route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Polls route works!" }));

module.exports = router;
