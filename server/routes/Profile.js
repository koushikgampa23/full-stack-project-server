const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { validateToken } = require("../middleware/AuthMiddleWare");
const bcrypt = require("bcrypt");

router.get("/", validateToken, async (req, res) => {
  const id = req.user.id;
  const particularUserPosts = await db.Posts.findAll({
    where: {
      UserId: id,
    },
  });
  res.json(particularUserPosts);
});

router.put("/updatepassword",validateToken, async (req, res) => {
  const { oldPassword, newPassword, reTypePassword } = req.body;
  const id = req.user.id;
  const user = await db.Users.findOne({
    where: {
      id: id,
    },
  });
  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (match) {
      if (newPassword === reTypePassword) {
        await bcrypt.hash(newPassword, 10).then((hash) => {
          db.Users.update(
            { password: hash },
            {
              where: {
                id: id,
              },
            }
          );
        });
        res.json("Password Updated Successful");
      } else {
        res.json("Please reenter the correct password");
      }
    } else {
      res.json("Wrong old password");
    }
  });
});
module.exports = router;
