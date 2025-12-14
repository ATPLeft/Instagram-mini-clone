module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Post", {
    imageUrl: DataTypes.STRING,
    caption: DataTypes.STRING
  });
};
