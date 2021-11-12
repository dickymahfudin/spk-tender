'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(30),
      },
      username: {
        type: Sequelize.STRING(20),
      },
      password: {
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 2,
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
    const createdAt = new Date();
    const updatedAt = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        username: 'admin',
        password: await bcrypt.hash('admin1234', 10),
        role: 1,
        createdAt,
        updatedAt,
      },
      {
        name: 'Fajar',
        username: 'fajar',
        password: await bcrypt.hash('user1234', 10),
        role: 2,
        createdAt,
        updatedAt,
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
