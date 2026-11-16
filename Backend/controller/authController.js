const {createUser} = require("../model/userModel")
const jwt=require("jsonwebtoken")
const pool = require("../db/db")
const bcrypt=require("bcrypt")

async function Signup(req,res){
    const {name,email,password}=req.body;
    

    try {
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All Fields Are Required",
                success:false
            })
        }
       const existingUser=await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
       )

       if(existingUser.rows.length>0){
        return res.status(400).json({
            message:"Email Already Taken",
            success:false
        })
       }
       const hashedPassword=await bcrypt.hash(password,10)
       const user=await createUser(name,email,hashedPassword)

       res.status(201).json({
        message:"User Creation Success",
        success:true,
        user
       })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"User Registration Failed",
            success:false
        })
    }
}

async function Login(req,res){
    const {email,password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                 message:"All Fields Are Required",
                success:false
            })
        }
        
        const result=await pool.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        )
        if(result.rows.length === 0){
            return res.status(400).json({
                message:"User not found"
            })
        }
          const user = result.rows[0];

        const comparePassword=await bcrypt.compare(password,user.password)

        if(!comparePassword){
            return res.status(400).json({
                message:"Invalid email or password",
                success:false
            })
        }

        const token=jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )

        res.status(200).json({
            message:"User Login Success",
            success:true,
            user:{
                email:user.email,
                password:user.password,
                name:user.name
            },
            token
        })
    } catch (error) {
        res.status(500).json({
            message:"Login Failed",
            success:false
        })
    }
}

module.exports={Signup,Login}