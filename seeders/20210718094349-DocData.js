"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let count = 5;
    let userId = 1;
    while (count--) {
      let date = new Date();
      data.push({
        name: faker.name.lastName(),
        userId: userId++,
        createdAt: date,
        updatedAt: date,
      });
    }

    await queryInterface.bulkInsert("docs", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("docs", null, {});
  },
};
