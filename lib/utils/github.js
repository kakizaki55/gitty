const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
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
  });
  const { access_token } = await response.json();
  return access_token;
};

const getUserProfile = async (token) => {
  const profile = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  }).json();

  // this actually needs to return login/ avatar_url/email
  return profile;
};

module.exports = { exchangeCodeForToken, getUserProfile };
