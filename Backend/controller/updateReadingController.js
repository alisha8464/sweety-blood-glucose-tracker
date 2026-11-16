
const { updateReading } = require("../model/readingModel");

async function UpdateReading(req, res) {
    const { date, timeSlot, glucoseValue } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try {

        console.log("Update controller reached");

        console.log({
            id,
            userId,
            date,
            timeSlot,
            glucoseValue
        });

        // Validate required fields
        if (
            !date ||
            !timeSlot ||
            glucoseValue === undefined ||
            glucoseValue === null ||
            glucoseValue === ""
        ) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Validate glucose value
        const value = Number(glucoseValue);

        if (!Number.isInteger(value) || value < 40 || value > 600) {
            return res.status(400).json({
                message: "Glucose value must be an integer between 40 and 600",
                success: false
            });
        }

        // Validate time slot
        const allowedSlots = [
            "Morning fasting",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (!allowedSlots.includes(timeSlot)) {
            return res.status(400).json({
                message: "Invalid time slot",
                success: false
            });
        }

        // Validate date
        if (
            Number.isNaN(Date.parse(date)) ||
            new Date(date).toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({
                message: "Invalid date",
                success: false
            });
        }

        // Prevent future dates
        if (date > new Date().toLocaleDateString("en-CA")) {
            return res.status(400).json({
                message: "Future dates are not allowed",
                success: false
            });
        }

        // Update reading in database
        const updated = await updateReading(
            id,
            userId,
            date,
            timeSlot,
            value
        );

        if (!updated) {
            return res.status(404).json({
                message: "Reading not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Reading updated successfully",
            success: true,
            reading: updated
        });

    } catch (error) {

        console.log("Update error:", error);

        // Handle duplicate reading
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A reading already exists for this date and time slot",
                success: false
            });
        }

        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

module.exports = UpdateReading;
