'use strict';

const { v4 } = require('uuid');
const bcrypt = require('bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    const adminId = await queryInterface.rawSelect('roles', { where: { name: 'admin' } }, ['id']);

    await queryInterface.bulkInsert('users', [{
      id: v4(),
      name: 'admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('12345678', salt),
      roleId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
