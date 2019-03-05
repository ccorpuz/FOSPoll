const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

//  Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users route works!" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ err: "Email already exists!" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashed) => {
          if (err) throw err;
          newUser.password = hashed;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Log a user in
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //  Find user by email
  User.findOne({ email }).then(user => {
    //  Check for user
    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    //  Check password
    bcrypt.compare(password, user.password).then(passed => {
      if (passed) {
        res.json({ msg: "Success!" });
      } else {
        return res.status(400).json({ err: "Password is incorrect!" });
      }
    });
  });
});
module.exports = router;
