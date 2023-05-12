const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_order', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    payment_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    va_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expiry_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    response_midtrans: {
      type: DataTypes.TEXT,
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
    tableName: 'payment_order',
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
