const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getUserProfile } = require('../utils/github');
const jwt = require('jsonwebtoken');
// const auth = require('../middleware/auth');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    //get access token
    const { code } = req.query;
    try {
      const token = await exchangeCodeForToken(code);
      //use access token to get profile
      const profile = await getUserProfile(token);
      // find is profile is a match in the github user table
      let user = await GithubUser.findByUserName(profile.login);

      if (!user) {
        user = await GithubUser.insert({
          username: profile.login,
          avatar: profile.avatar_url,
          email: profile.email,
        });
      }
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
    } catch (error) {
      next(error);
    }
  })
  .delete('/', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .send({ success: true, message: 'Signed out successfully!' });
  });
