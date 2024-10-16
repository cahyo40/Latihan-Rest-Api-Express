'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

 await queryInterface.bulkInsert('Categories',[
  {
    name:'makanan',
    description:'makanan enak',
    createdAt:new Date(),
    updatedAt:new Date()
  },
  {
    name:'minuman',
    description:'minuman enak',
    createdAt:new Date(),
    updatedAt:new Date()
  },
  {
    name:'elektronik',
    description:'elektronik enak',
    createdAt:new Date(),
    updatedAt:new Date()
  }
 ]);

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories',null,{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
