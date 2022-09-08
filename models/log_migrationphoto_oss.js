const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log_migrationphoto_oss', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    datetimetrx: {
      type: DataTypes.DATE,
      allowNull: false
    },
    uimg1_old: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg2_old: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg3_old: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg4_old: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg1_new: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg2_new: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg3_new: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg4_new: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uimg_old: {
      type: DataTypes.JSON,
      allowNull: true
    },
    uimg_new: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'log_migrationphoto_oss',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
