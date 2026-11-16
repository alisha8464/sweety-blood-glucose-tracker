import React, { useState } from 'react'
import { FaTint, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
import './Signup.css'
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const initialState={
        name:"",
        email:"",
        password:""
    }

    const [signupDetails,updateSignupdetails]=useState(initialState)
    const [success,setSuccess]=useState("")
    const [errorMsg,setErrmsg]=useState("")
    const navigate=useNavigate()

    function handleChange(event){
        const {name,value}=event.target;
        updateSignupdetails((prevState)=>({
            ...prevState,[name]:value
        }))
    }

    async function handleSignup(event){
        event.preventDefault()
        try {
            const response=await axios.post("http://localhost:7864/api/auth/signup",signupDetails)
            console.log(response.data)
            updateSignupdetails(initialState)
            setSuccess(response.data.message || "Signup Success")
             setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            setErrmsg(
                error.response?.data?.message || "Something Went Wrong. Try Again!"
            )
        }
    }
  return (
    <div className='signup-page'>
       <div className='signup-card'>
        <div className='brand'>
            <div className='brand-row'>
                <FaTint className="brand-icon" />
              <span className="brand-name">Sweety</span>
            </div>
             <p className="brand-tagline">Blood Glucose Tracker</p>
        </div>
        <h1 className="signup-title">Create Account</h1>
        <form className='signup-form' onSubmit={handleSignup}>
            <div className='input-group'>
                <FaUser className='input-icon'/>
                <input type='text' placeholder='Name' aria-label='Name' className='signup-input' name='name' value={signupDetails.name} onChange={handleChange} required/>
            </div>
             <div className='input-group'>
                <FaEnvelope className='input-icon'/>
                <input type='email' placeholder='Email' aria-label='Email' className='signup-input' name='email' value={signupDetails.email} onChange={handleChange} required/>
            </div>
             <div className='input-group'>
                <FaLock className='input-icon'/>
                <input type='password' placeholder='Password' aria-label='Password' className='signup-input' minLength={8} name='password' value={signupDetails.password} onChange={handleChange} required/>
            </div>
            {errorMsg && <p className='form-error'>{errorMsg}</p>}
            {success && <p className='form-success'>{success}</p>}
            <button type='submit' className='signup-btn'>Signup</button>
            <p className='login-text'>
                Already have an account?
                <Link to="/login" className='login-link'>Login</Link>
            </p>
        </form>
       </div>
    </div>
  )
}

export default Signup
