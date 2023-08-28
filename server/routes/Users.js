const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middleware/AuthMiddleWare");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password, securityquestion, emailaddress } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      securityquestion: securityquestion,
      emailaddress: emailaddress,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (match) {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "importantsecret"
        );
        res.json({ token: accessToken, username: username, id: user.id });
      } else {
        res.json({ error: "Wrong Username And Password Combination" });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
