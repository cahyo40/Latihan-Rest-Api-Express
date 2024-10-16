'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all(
      [
        queryInterface.addColumn(
          'products',
          'avg_review',
          {
            type: Sequelize.INTEGER,
            defaultValue:0,
            alter:'count_review',
          }

        )
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return Promise.all([
      queryInterface.removeColumn('products', 'avg_review'),
    ]);
  }
};
