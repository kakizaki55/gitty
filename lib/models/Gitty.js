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

  static insert({ text, username }) {
    return pool
      .query(
        `
    INSERT INTO
        gitty (text, username)
    VALUES
        ($1, $2)
    RETURNING 
        *
    
    `,
        [text, username]
      )
      .then(({ rows }) => new Gitty(rows[0]));
  }
  static getAll() {
    return pool
      .query(
        `
    SELECT 
        *
    FROM
        gitty 
    `
      )
      .then(({ rows }) => {
        return rows.map((row) => new Gitty(row));
      });
  }
};
