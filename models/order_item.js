const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_item', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order_item',
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
