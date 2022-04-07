const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  })
    .then((response) => response.json)
    .then(({ access_token }) => access_token);
};

const getUserProfile = (token) => {
  return fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((profile) => profile.json())
    .then((profile) => {
      return {
        username: profile.login,
        avatar: profile.avatar_url,
        email: profile.email,
      };
    });
};

module.exports = { exchangeCodeForToken, getUserProfile };
