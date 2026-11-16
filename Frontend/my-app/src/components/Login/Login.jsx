import React, { useState } from 'react'
import { FaTint, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'

import axios from "axios";

const Login = () => {
    const initialState={
        email:"",
        password:""
    }
    const [loginDetails,updateLogindetails]=useState(initialState)
    const [success,setSuccess]=useState("")
    const [err,setErr]=useState("")
    const navigate=useNavigate()

    function handleChange(event){
        const {name,value}=event.target;
        updateLogindetails((prevState)=>({
            ...prevState,[name]:value
        }))
    }

    async function handleLogin(event){
        event.preventDefault();
        try {
            const response=await axios.post("http://localhost:7864/api/auth/login",loginDetails)
            console.log(response.data)
            updateLogindetails(initialState)
            setSuccess(response.data.message || "Login Success")
            const token=response.data.token 
            localStorage.setItem("token",token)
            localStorage.setItem("name",response.data.user.name)
            console.log(response.data.token)
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            setErr(
                error.response?.data?.message || "Something Went Wrong. Try Again!"
            )
        }
    }
  return (
    <div className='login-page'>
        <div className='login-card'>
            <div className='login-brand'>
                <div className='login-brand-row'>
                    <FaTint className="login-brand-icon"/>
                    <span className="login-brand-name">Sweety</span>
                </div>
                <p className="login-brand-tagline">Blood Glucose Tracker</p>
            </div>
             <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to your account</p>
        <form className='login-form' onSubmit={handleLogin}>
            <div className='login-input-group'>
                 <FaEnvelope className="login-input-icon" />
                 <input type='email' placeholder='Email' className="login-input" aria-label='Email' name="email" value={loginDetails.email} onChange={handleChange} required/>
            </div>
             <div className='login-input-group'>
                 <FaEnvelope className="login-input-icon" />
                 <input type='password' placeholder='Password' className="login-input" aria-label='Password' name='password' value={loginDetails.password} onChange={handleChange} required/>
            </div>
            {err && <p className='form-error'>{err}</p>}
            {success && <p className='form-success'>{success}</p>}
             <button type="submit" className="login-btn">Login</button>
        </form>
        <p className='signup-text'>Don't have an account? 
            <Link to="/signup" className='signup-link'>Signup</Link>
        </p>
        </div>
    </div>
  )
}

export default Login
