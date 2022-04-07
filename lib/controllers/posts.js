const { Router } = require('express');
const auth = require('../middleware/auth');
const Gitty = require('../models/Gitty');

module.exports = Router()
  .post('/', auth, (req, res, next) => {
    Gitty.insert({ ...req.body, username: req.user.username })
      .then((content) => res.send(content))
      .catch((error) => next(error));
  })
  .get('/', auth, (req, res) => {
    Gitty.getAll().then((content) => res.send(content));
  });
