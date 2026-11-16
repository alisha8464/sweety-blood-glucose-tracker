const pool = require("../db/db");

const createUser = async (name, email, password) => {
    const result = await pool.query(
        `INSERT INTO users(name, email, password)
         VALUES($1, $2, $3)
         RETURNING id, name, email`,
        [name, email, password]
    );

    return result.rows[0];
};

module.exports = { createUser };