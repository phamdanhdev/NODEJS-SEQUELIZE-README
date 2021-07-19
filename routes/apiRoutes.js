const express = require("express");
const routes = express.Router();
const db = require("../models");

routes.get("/", (req, res) => {
  db.User.findAll().then((user) => res.json(user));
});

routes.get("/findAllUserInClass/:name", (req, res) => {
  db.User.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.UserClass,
        where: {},
        include: [
          { attributes: [], model: db.Class, where: { name: req.params.name } },
        ],
      },
    ],
  }).then((data) => res.json(data));
});

routes.get("/findDocOfUser/:id", (req, res) => {
  db.Doc.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.User,
        where: { id: req.params.id },
      },
    ],
  }).then((data) => res.json(data));
});

routes.get("/findUserOfDoc/:id", (req, res) => {
  db.User.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.Doc,
        where: { id: req.params.id },
      },
    ],
  }).then((data) => res.json(data));
});

module.exports = routes;
