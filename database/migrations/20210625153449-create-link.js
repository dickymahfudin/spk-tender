'use strict';
const dataLaporan = require('../../src/helpers/dataLaporan');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kriteria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kriterias',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      value: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    dataLaporan();
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('links');
  },
};
