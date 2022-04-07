const pool = require('../utils/pool');

module.exports = class GithubUser {
  email;
  username;
  avatar;

  constructor(row) {
    this.email = row.email;
    this.username = row.username;
    this.avatar = row.avatar;
  }

  static insert({ username, email, avatar }) {
    if (!username) throw new Error('Username is required');
    return pool
      .query(
        `
    INSERT INTO 
        github_users (username, email, avatar)
    VALUES
        ($1, $2, $3)
    RETURNING 
         *
      `,
        [username, email, avatar]
      )
      .then(({ rows }) => new GithubUser(rows[0]));
  }
  static findByUserName(username) {
    return pool
      .query(
        `
    SELECT 
        *
    FROM 
        github_users
    WHERE
        username=$1
    `,
        [username]
      )
      .then(({ rows }) => {
        if (!rows[0]) return null;
        new GithubUser(rows[0]);
      });
  }
};
