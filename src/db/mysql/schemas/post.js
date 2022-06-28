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
        allowNull: false,
        defaultValue: 0,
      },
      reply: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      //! isRemoved로 사용할 것
      removed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // test: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   defaultValue: 100,
      // }
    },
    {
      sequelize,
      tableName: "posts",
      timestamps: false,
      paranoid: true,
      charset: "utf8",
    }
  );
};
