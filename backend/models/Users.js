module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  users.associate = (models) => {
    // each user can have many posts
    users.hasMany(models.posts, {
      onDelete: "cascade", // if we delete a user, it will delete every associated post
    });

    // each user can have many likes
    users.hasMany(models.likes, {
      onDelete: "cascade", // if we delete a user, it will delete every associated like
    });
  };

  return users;
};
