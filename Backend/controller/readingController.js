const {createReading}=require("../model/readingModel")

async function Addreading(req,res){
    const {date,timeSlot,glucoseValue}=req.body; 
    try {
        if(!date || !timeSlot || !glucoseValue === undefined){
            return res.status(401).json({
                message:"All fields are required",
                success:false
            })
        }

        const value=Number(glucoseValue)

        if(!Number.isInteger(value) || value<40 || value>600){
            return res.status(400).json({
                message:"Glucose value must be an integer between 40 and 600",
                success:false
            })
        }

        const allowedSlots=[
             "Morning fasting",
            "After breakfast",
            "After lunch",
            "After dinner"
        ]

        if(!allowedSlots.includes(timeSlot)){
            return res.status(400).json({
                message:"Invalid time slot",
                success:false
            })
        }

        const selectedDate=new Date(`${date}T00:00:00`)
        const today=new Date()
        today.setHours(0,0,0,0)

        if(Number.isNaN(selectedDate.getTime()) || selectedDate>today){
            return res.status(400).json({
                message:"Future dates are not allowed",
                success:false
            })
        }

        const reading=await createReading(
            req.user.id,
            date,
            timeSlot,
            value
        )

        return res.status(200).json({
            message:"Reading Creation Success",
            success:true,
            reading
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

module.exports=Addreading