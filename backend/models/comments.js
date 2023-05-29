module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define("comments", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return comments;
};
