const { Router } = require('express');

const fetch = require('cross-fetch');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    //get access token
    const { code } = req.query;

    const token = await exchangeCodeForToken(code);
    console.log('token', token);

    //use access token to get profile
    const profile = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    }).json();
    //does this work?
    console.log('profile', profile);
    // find is profile is a match in the github user table
    let user = await GithubUser.findByUserName(profile.login);

    //if there isnt a user insert in to user table
    if (!user) {
      await GithubUser.insert({
        username: profile.login,
        avatar: profile.avatar_url,
        email: profile.email,
      });
    }
    try {
    } catch (error) {}
  });
