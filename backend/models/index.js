const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const User = require("./User")(sequelize, DataTypes);
const Post = require("./Post")(sequelize, DataTypes);
const Follow = require("./Follow")(sequelize, DataTypes);

User.hasMany(Post);
Post.belongsTo(User);

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId"
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId"
});

module.exports = { sequelize, User, Post, Follow };
