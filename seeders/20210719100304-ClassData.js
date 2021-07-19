"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let date = new Date();
    let count = 5;
    while (count--) {
      data.push({
        name: faker.name.firstName(),
        createdAt: date,
        updatedAt: date,
      });
    }
    await queryInterface.bulkInsert("classes", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("classes", null, {});
  },
};
