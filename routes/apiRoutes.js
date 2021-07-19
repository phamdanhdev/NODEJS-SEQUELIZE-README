const express = require("express");
const routes = express.Router();
const db = require("../models");

// routes.get("/", (req, res) => {
//   db.User.findAll().then((user) => res.json(user));
// });

routes.get("/findAllUserInClass/:id", (req, res) => {
  db.User.findAll().then((user) => res.json(user));
});

routes.get("/findAllClassOfUser/:id", (req, res) => {
  db.Class.findAll({
    attributes: ["name"],
    include: [
      {
        attributes: [],
        model: db.UserClass,
        where: { userId: req.params.id },
        include: [
          { attributes: [], model: db.User, where: { id: req.params.id } },
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
