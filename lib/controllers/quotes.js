const { Router } = require('express');
const Quotes = require('../services/Quote.js');

module.exports = Router().get('/', (req, res, next) => {
  Quotes.getAll()
    .then((response) => res.send(response))
    .catch((error) => next(error));
});
