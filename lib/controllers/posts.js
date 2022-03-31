const { Router } = require('express');

module.exports = Router().get('/', async (req, res) => {
  console.log('req.body', req.body);
  res.send(req.body);
});
