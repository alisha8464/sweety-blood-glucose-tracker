const {getReading}=require("../model/readingModel")

async function GetReadings(req,res){
    try {
        const readings=await getReading(req.user.id)
        return res.status(200).json({
            message:"Readings Fetched Success",
            success:true,
            readings
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

module.exports=GetReadings