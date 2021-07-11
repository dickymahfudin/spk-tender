'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  supplier.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      moora: DataTypes.FLOAT,
      waspas: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'vendor',
    }
  );
  return supplier;
};
