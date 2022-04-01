const { Router } = require('express');
const auth = require('../middleware/auth');
const Gitty = require('../models/Gitty');

module.exports = Router()
  .post('/', auth, async (req, res, next) => {
    try {
      const gitty = await Gitty.insert({
        ...req.body,
        username: req.user.username,
      });
      res.send(gitty);
    } catch (error) {
      next(error);
    }
  })
  .get('/', auth, async (req, res) => {
    const response = await Gitty.getAll();

    res.send(response);
  })
  .get('/dashboard', auth, async (req, res) => {
    res.send(req.user);
  });
