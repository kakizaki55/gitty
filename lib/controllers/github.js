const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getUserProfile } = require('../utils/github');
const jwt = require('jsonwebtoken');
// const auth = require('../middleware/auth');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', (req, res, next) => {
    //get access token
    const { code } = req.query;
    let user = {};

    exchangeCodeForToken(code)
      .then((token) => getUserProfile(token))
      //use access token to get profile
      .then((profile) => {
        user = profile;
        GithubUser.findByUserName(profile.username)
          .then((githubUser) => {
            if (githubUser) {
              user = githubUser;
            } else {
              GithubUser.insert(user);
            }
          })
          .then((createdUser) => (user = createdUser));
      })
      .then(() => {
        res
          .cookie(
            process.env.COOKIE_NAME,
            jwt.sign({ ...user }, process.env.JWT_SECRET, {
              expiresIn: '1 day',
            }),
            {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24,
            }
          )
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })
  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .send({ success: true, message: 'Signed out successfully!' });
  });
