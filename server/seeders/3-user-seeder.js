'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('users', [
      {
        username: 'daddio',
        password:'pa',
        email:'dadd@io.com',
        points: 0,
        status_id: 1,
        deletedAt: null,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'shmoo',
        password: 'ss',
        email: 'shoo@who.com',
        points: 0,
        status_id: 1,
        deletedAt: null,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'slick_daddy',
        password: 'wo',
        email: 'slick@daddy.com',
        points: 0,
        status_id: 1,
        deletedAt: null,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'slick_mama',
        password: 'rd',
        email: 'slick@mama.com',
        points: 0,
        status_id: 1,
        deletedAt: null,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('users', null, {});

  }
};