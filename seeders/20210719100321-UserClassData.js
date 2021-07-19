"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let date = new Date();

    data.push(
      {
        userId: 1,
        classId: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 1,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 1,
        classId: 3,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 4,
        createdAt: date,
        updatedAt: date,
      },
      {
        userId: 2,
        classId: 5,
        createdAt: date,
        updatedAt: date,
      }
    );

    await queryInterface.bulkInsert("userclasses", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("userclasses", null, {});
  },
};
