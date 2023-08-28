const express = require("express");
const router = express.Router();
const db = require("../models/index");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { username, securityQuestion, newPassword, reTypePassword } = req.body;
  const userProfile = await db.Users.findOne({
    where: {
      username: username,
    },
  });
  if (userProfile) {
    if (userProfile.securityquestion === securityQuestion) {
      if (newPassword === reTypePassword) {
        bcrypt.hash(newPassword, 10).then((hash) => {
          db.Users.update(
            { password: hash },
            {
              where: {
                username: username,
              },
            }
          );
        });
        res.json("Generated New Password successfully");
      } else {
        res.json("Please reEnter the password correctly");
      }
    } else {
      res.json("Incorrect Security question");
    }
  } else {
    res.json("Your Profile Doesnot exists in our system please sign up");
  }
});

module.exports = router;
