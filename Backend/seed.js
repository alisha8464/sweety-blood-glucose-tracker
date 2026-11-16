
const pool = require("./db/db");
const bcrypt = require("bcrypt");

async function seedDatabase() {
    try {
        const name = "Demo Patient";
        const email = "demo@sweety.com";
        const password = "Demo@123";

        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             ON CONFLICT (email)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [name, email, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        const readings = [
            ["Morning fasting", 95],
            ["After breakfast", 125],
            ["After lunch", 140],
            ["After dinner", 110]
        ];

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });

        for (const [timeSlot, glucoseValue] of readings) {
            await pool.query(
                `INSERT INTO readings
                 (user_id, reading_date, time_slot, glucose_value)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (user_id, reading_date, time_slot)
                 DO UPDATE SET glucose_value = EXCLUDED.glucose_value`,
                [userId, today, timeSlot, glucoseValue]
            );
        }

        console.log("Demo user and sample readings created successfully!");
        console.log("Email:", email);
        console.log("Password:", password);

    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await pool.end();
    }
}

seedDatabase();
