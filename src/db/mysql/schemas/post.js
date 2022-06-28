import * as Sequelize from "sequelize";
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "posts",
    {
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      writer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commentCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reply: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      removed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "posts",
      timestamps: false,
      paranoid: true,
    }
  );
};
