'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('users', [
      {
        username: 'admin1',
        password:'182rwk',
        email:'backyardboiz@gmail.com',
        points: 0,
        status_id: 1,
        deletedAt: null,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'admin2',
        password: 'uaafwz',
        email: 'noemail@gmail.com',
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