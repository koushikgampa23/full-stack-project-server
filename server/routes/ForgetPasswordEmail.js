const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await db.Users.findOne({
    where: {
      username: username,
    },
  });
  if (user) {
    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    const link = `http://localhost:3001/forgetpasswordemail/resetpassword/${accessToken}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "koushikgampa@gmail.com",
        pass: "arrrcmckeycqkxsf",
      },
    });
    var mailOptions = {
      from: "koushikgampa@gmail.com",
      to: user.emailaddress,
      subject: "Sending Email using Node.js",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.json("Email sent: " + info.response);
      }
    });
    res.json("Email Sent SuccessFully please check the email");
  } else {
    res.json("Please Enter valid username");
  }
});

router.get("/resetpassword/:accesstoken", async (req, res) => {
  const { accesstoken } = req.params;
  try {
    const verfication = verify(accesstoken, "importantsecret");
    if (verfication) {
      res.render("index.ejs", { username: verfication.username });
    }
  } catch (e) {
    res.json("Invalid Token");
  }
});

router.post("/resetpassword/:accesstoken", async (req, res) => {
  const { password, reTypepassword } = req.body;
  const { accesstoken } = req.params;
  try {
    const verfication = verify(accesstoken, "importantsecret");
    if (verfication) {
      if (password === reTypepassword) {
        bcrypt.hash(password, 10).then((hash) => {
          db.Users.update(
            { password: hash },
            {
              where: {
                id: verfication.id,
              },
            }
          );
        });
        res.send("password Updated successfully");
      } else {
        res.send("Incorrect password match with old to new");
      }
    }
  } catch (e) {
    res.send("Invalid Token");
  }
});

module.exports = router;
