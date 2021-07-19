"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let amount = 5;
    while (amount--) {
      let date = new Date();
      data.push({
        name: faker.name.findName(),
        createdAt: date,
        updatedAt: date,
      });
    }

    await queryInterface.bulkInsert("users", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
