const express=require("express")
const router=express.Router()
const Addreading=require("../controller/readingController")
const GetReadings=require("../controller/getReadingController")
const UpdateReading=require("../controller/updateReadingController")
const verifyToken=require("../middleware/authMiddleware")
const DeleteReading=require("../controller/deleteController")
router.post("/add",verifyToken,Addreading)
router.get("/get",verifyToken,GetReadings)
router.put("/edit/:id", verifyToken, UpdateReading);
router.delete("/delete/:id",verifyToken,DeleteReading)
module.exports=router