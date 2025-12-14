const express = require("express");
const { Post, Follow, User } = require("../models");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    ...req.body,
    UserId: req.userId
  });
  res.json(post);
});

router.get("/feed", auth, async (req, res) => {
  const follows = await Follow.findAll({
    where: { followerId: req.userId }
  });

  const ids = follows.map(f => f.followingId);

  const posts = await Post.findAll({
    where: { UserId: ids },
    include: [{ model: User, attributes: ["username"] }],
    order: [["createdAt", "DESC"]]
  });

  res.json(posts);
});

module.exports = router;
