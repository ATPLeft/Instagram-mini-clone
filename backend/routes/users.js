const express = require("express");
const { Follow } = require("../models");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/follow", auth, async (req, res) => {
  await Follow.create({
    followerId: req.userId,
    followingId: req.params.id
  });
  res.json({ message: "Followed" });
});

router.post("/:id/unfollow", auth, async (req, res) => {
  await Follow.destroy({
    where: {
      followerId: req.userId,
      followingId: req.params.id
    }
  });
  res.json({ message: "Unfollowed" });
});

module.exports = router;
