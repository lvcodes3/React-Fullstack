module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define("posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  posts.associate = (models) => {
    // each post can have many comments
    posts.hasMany(models.comments, {
      onDelete: "cascade", // if we delete a post, it will delete every associated comment
    });

    // each post can have many likes
    posts.hasMany(models.likes, {
      onDelete: "cascade", // if we delete a post, it will delete every associated like
    });
  };

  return posts;
};
