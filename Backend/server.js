require("dotenv").config()
const express=require("express")
const cors=require("cors")

const app=express()
app.use(cors())
app.use(express.json())

const pool=require("./db/db")
const authRoute=require("./routers/authRoute")
const readingRoute=require("./routers/readingRoute")
const getReadingRoute=require("./routers/readingRoute")
const getReportRoute=require("./routers/reportRoute")



const PORT=process.env.PORT || 7864

app.use("/api/auth",authRoute)
app.use("/api/readings",readingRoute)
app.use("/api/all",getReadingRoute)
app.use("/api/readings",getReadingRoute)
app.use("/api",getReadingRoute)
app.use("/api/reports",getReportRoute)


async function startServer(){
    try {
        await pool.query("SELECT 1")
        console.log("PostgreSQL connection successful")
       app.listen(PORT,()=>{
            console.log(`Server Started on ${PORT}`)
        })
    } catch (error) {
        console.log('Server connection failed')
    }
}

startServer()