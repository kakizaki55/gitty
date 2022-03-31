const { Router } = require('express');
const req = require('express/lib/request');

module.exports = Router().get('/login', async (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
  );
});
