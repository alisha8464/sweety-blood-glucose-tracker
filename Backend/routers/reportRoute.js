const express=require("express")
const router=express.Router()
const verifyToken=require("../middleware/authMiddleware")
const {DailyReport,MonthlyReport,PreviousMonthReport}=require("../controller/reportController")
router.get("/daily",verifyToken,DailyReport)
router.get("/monthly",verifyToken,MonthlyReport)
router.get("/previous",verifyToken,PreviousMonthReport)
module.exports=router