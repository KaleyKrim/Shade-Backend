'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('messages', [
      {
        points: 5,
        media: '1511586711983-1.mp4',
        shader_id: 1,
        victim_id: 2,
        status_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 8,
        media: '1511586826280-2.mp4',
        shader_id: 2,
        victim_id: 1,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 100,
        media: '1511587024505-5.mp4',
        shader_id: 3,
        victim_id: 4,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 2000,
        media: '1511587178529-1.mp4',
        shader_id: 4,
        victim_id: 2,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 2000,
        media: '1511587308263-1.mp4',
        shader_id: 4,
        victim_id: 2,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 2000,
        media: '1511587442861-3.mp4',
        shader_id: 4,
        victim_id: 2,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        points: 2000,
        media: '1511586920409-4.mp4',
        shader_id: 4,
        victim_id: 2,
        status_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('messages', null, {});

  }
};

