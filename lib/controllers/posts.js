const { Router } = require('express');
const auth = require('../middleware/auth');

module.exports = Router().get('/', auth, async (req, res) => {
  console.log('req.body', req.user);
  res.json(req.user);
});
