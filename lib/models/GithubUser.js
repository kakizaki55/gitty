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

  static async insert({ username, email, avatar }) {
    if (!username) throw new Error('Username is required');
    const { rows } = await pool.query(
      `
    INSERT INTO 
        github_users (username, email, avatar)
    VALUES
        ($1, $2, $3)
    RETURNING 
         *
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

    if (!rows[0]) return null;
    return new GithubUser(rows[0]);
  }
};
