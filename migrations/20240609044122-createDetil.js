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
    await queryInterface.createTable('Detil', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_header: {
        allowNull: false,
        type: Sequelize.UUID
      },
      tanggal_awal: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      tanggal_akhir: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      nominal: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Detil');
  }
};
