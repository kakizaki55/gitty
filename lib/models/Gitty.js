const pool = require('../utils/pool');

module.exports = class Gitty {
  id;
  text;
  username;
  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.username = row.username;
  }

  static async insert({ text, username }) {
    const { rows } = await pool.query(
      `
    INSERT INTO
        gitty (text, username)
    VALUES
        ($1, $2)
    RETURNING 
        *
    
    `,
      [text, username]
    );
    return new Gitty(rows[0]);
  }
};
