const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  email;
  username;
  avatar;

  constructor({ id, username, email, avatar }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.avatar = avatar;
  }

  static async insert({ username, email, avatar }) {
    const { rows } = await pool.query(
      `
    INSERT INTO 
        github_users (username, email, avatar)
    VALUES
        ($1, $2, $3)
    RETURNING 
         
      `,
      [username, email, avatar]
    );
    return new GithubUser(rows[0]);
  }
  static async findByUserName(username) {
    const { rows } = await pool.query(
      `
    SELECT 
        *
    FROM 
        github_users
    WHERE
        username=$1
    `,
      [username]
    );
    return new GithubUser(rows[0]);
  }
};
