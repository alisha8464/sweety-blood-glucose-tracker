
const pool = require("../db/db");

// DAILY REPORT
const getDailyReport = async (userId, date) => {
    const readingsResult = await pool.query(
        `SELECT id, reading_date, time_slot, glucose_value
         FROM readings
         WHERE user_id = $1 AND reading_date = $2
         ORDER BY created_at ASC`,
        [userId, date]
    );

    const statsResult = await pool.query(
        `SELECT
            COUNT(*) AS total_readings,
            ROUND(AVG(glucose_value), 1) AS average,
            MAX(glucose_value) AS highest,
            MIN(glucose_value) AS lowest
         FROM readings
         WHERE user_id = $1 AND reading_date = $2`,
        [userId, date]
    );

    return {
        readings: readingsResult.rows,
        stats: statsResult.rows[0]
    };
};


// MONTHLY REPORT
const getMonthlyReport = async (userId, startDate, endDate) => {
    const statsResult = await pool.query(
        `SELECT
            COUNT(*) AS total_readings,
            ROUND(AVG(glucose_value), 1) AS average,
            MAX(glucose_value) AS highest,
            MIN(glucose_value) AS lowest
         FROM readings
         WHERE user_id = $1
         AND reading_date >= $2
         AND reading_date < $3`,
        [userId, startDate, endDate]
    );

    const weeklyResult = await pool.query(
        `SELECT
            CEIL(EXTRACT(DAY FROM reading_date) / 7.0) AS week,
            COUNT(*) AS total_readings,
            ROUND(AVG(glucose_value), 1) AS average,
            MAX(glucose_value) AS highest,
            MIN(glucose_value) AS lowest
         FROM readings
         WHERE user_id = $1
         AND reading_date >= $2
         AND reading_date < $3
         GROUP BY week
         ORDER BY week`,
        [userId, startDate, endDate]
    );

    return {
        stats: statsResult.rows[0],
        weeklyBreakdown: weeklyResult.rows
    };
};

module.exports = {
    getDailyReport,
    getMonthlyReport
};
