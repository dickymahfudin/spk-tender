'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
    static async getAll(user_id) {
      return await this.findAll({
        order: [['id', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      })
        .then(result => result)
        .catch(err => err);
    }
  }
  kriteria.init(
    {
      name: DataTypes.STRING,
      bobot: DataTypes.FLOAT,
      jenis: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'kriteria',
      tableName: 'kriterias',
    }
  );
  return kriteria;
};
