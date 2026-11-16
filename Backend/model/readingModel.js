
const pool = require("../db/db");

const createReading = async (userId, date, timeSlot, glucoseValue) => {
    const result = await pool.query(
        `INSERT INTO readings(user_id, reading_date, time_slot, glucose_value)
         VALUES($1, $2, $3, $4)
         RETURNING *`,
        [userId, date, timeSlot, glucoseValue]
    );

    return result.rows[0];
};

const getReading=async(userId)=>{
    const result=await pool.query(
        `SELECT * FROM readings 
        WHERE user_id=$1
        ORDER BY reading_date DESC,
        created_at DESC`,
        [userId]
    );
    return result.rows;
}

const updateReading=async(id,userId,date,timeSlot,glucoseValue)=>{
    const result=await pool.query(
    `UPDATE readings 
    SET reading_date=$1,
        time_slot=$2,
        glucose_value=$3
    WHERE id=$4 AND user_id=$5
    RETURNING *`,

    [date,timeSlot,glucoseValue,id,userId]
    );
    return result.rows[0];
}

const deleteReading=async(id,userId)=>{
    const result=await pool.query(
        `DELETE FROM readings 
        WHERE id=$1 AND user_id=$2
        RETURNING *
        `,
        [id,userId]
    );

    return result.rows[0]
}
module.exports = { createReading, getReading, updateReading, deleteReading };
