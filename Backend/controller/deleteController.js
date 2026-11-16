const {deleteReading}=require("../model/readingModel")

async function DeleteReading(req,res){
    const {id}=req.params;
    const userId=req.user.id;

    try {
        const deleted=await deleteReading(id,userId)

        if(!deleted){
            return res.status(404).json({
                message:"Readings Not Found",
                success:false
            })
        }

        res.status(200).json({
            message:"Reading Deleted Success",
            success:true,
            reading:deleted
        })
    } catch (error) {
        console.log("Deleted Error",error)
        res.status(500).json({
            message:error.message,
            success:false
        })   
    }
}

module.exports=DeleteReading