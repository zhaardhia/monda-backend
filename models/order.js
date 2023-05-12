const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    order_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gross_amount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    courier: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status_order: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    transfer_fee: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    verify_order_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shipment_order_date: {
      type: DataTypes.DATE,
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
    tableName: 'order',
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
