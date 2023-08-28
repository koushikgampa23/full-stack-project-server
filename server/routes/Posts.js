const { Router } = require("express");
const router = Router();
const db = require("../models/index.js");
const { validateToken } = require("../middleware/AuthMiddleWare.js");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await db.Posts.findAll({ include: [db.Likes] });
  const likedPosts = await db.Likes.findAll({
    where: { UserId: req.user.id },
  });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byid/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await db.Posts.findByPk(id);
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  const username = req.user.username;
  post.username = username;
  post.UserId = req.user.id;
  await db.Posts.create(post);
  res.json(post);
});

router.put("/postTitle", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await db.Posts.update(
    { title: newTitle },
    {
      where: {
        id: id,
      },
    }
  );
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await db.Posts.update(
    { postTitle: newText },
    {
      where: {
        id: id,
      },
    }
  );
  res.json(newText);
});

router.delete("/:id", validateToken, async (req, res) => {
  const postId = req.params.id;
  await db.Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("Post deleted Successfully");
});

router.get("/individualuserposts/:id", async (req, res) => {
  const userId = req.params.id;
  const posts = await db.Posts.findAll({
    where: {
      UserId: userId,
    },
  });
  res.json(posts);
});

module.exports = router;
