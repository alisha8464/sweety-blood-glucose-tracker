
const {getDailyReport,getMonthlyReport}=require("../model/reportModel")

// DAILY REPORT
async function DailyReport(req, res) {
    const userId = req.user.id;
    const { date } = req.query;

    try {
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            Number.isNaN(Date.parse(date)) ||
            new Date(date).toISOString().slice(0, 10) !== date) {
            return res.status(400).json({
                message: "Please provide a valid date",
                success: false
            });
        }

        const report = await getDailyReport(userId, date);

        return res.status(200).json({
            message: "Daily report fetched successfully",
            success: true,
            report
        });

    } catch (error) {
        console.log("Daily report error:", error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}


// MONTHLY REPORT
async function MonthlyReport(req, res) {
    const userId = req.user.id;
    const { month, year } = req.query;

    try {
        const monthNumber = Number(month);
        const yearNumber = Number(year);

        if (
            !month || !year ||
            !Number.isInteger(monthNumber) ||
            monthNumber < 1 || monthNumber > 12 ||
            !Number.isInteger(yearNumber) ||
            yearNumber < 2000 || yearNumber > 2100
        ) {
            return res.status(400).json({
                message: "Please provide a valid month and year",
                success: false
            });
        }

        const startDate =
            `${yearNumber}-${String(monthNumber).padStart(2, "0")}-01`;

        const nextMonth = new Date(yearNumber, monthNumber, 1);

        const endDate = [
            nextMonth.getFullYear(),
            String(nextMonth.getMonth() + 1).padStart(2, "0"),
            "01"
        ].join("-");

        const report = await getMonthlyReport(
            userId,
            startDate,
            endDate
        );

        return res.status(200).json({
            message: "Monthly report fetched successfully",
            success: true,
            report
        });

    } catch (error) {
        console.log("Monthly report error:", error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}


// PREVIOUS MONTH REPORT
async function PreviousMonthReport(req, res) {
    const userId = req.user.id;

    try {
        const today = new Date();

        const start = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
        );

        const end = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");

            return `${year}-${month}-01`;
        };

        const startDate = formatDate(start);
        const endDate = formatDate(end);

        const report = await getMonthlyReport(
            userId,
            startDate,
            endDate
        );

        return res.status(200).json({
            message: "Previous month report fetched successfully",
            success: true,
            report
        });

    } catch (error) {
        console.log("Previous month report error:", error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

module.exports = {
    DailyReport,
    MonthlyReport,
    PreviousMonthReport
};
