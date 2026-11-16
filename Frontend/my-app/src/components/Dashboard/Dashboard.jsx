import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaCalendarCheck,
  FaTint,
  FaArrowUp,
  FaArrowDown,
  FaListUl,
  FaArrowRight,
  FaPlus,
} from "react-icons/fa";

import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";

const Dashboard = () => {
  const name = localStorage.getItem("name");
  const [readings,setReadings]=useState([])

  useEffect(()=>{
    async function fetchReading(){
      const token=localStorage.getItem("token")
      try {
        const response=await axios.get("http://localhost:7864/api/all/get",{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      setReadings(response.data.readings || [])
      console.log(response.data.readings)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchReading()
  },[])

  const today=new Date().toLocaleDateString("en-CA");

 const todayReadings = readings.filter(
  (each) =>
    new Date(each.reading_date).toLocaleDateString("en-CA") === today
);

  const values=todayReadings.map(
    (each)=>Number(each.glucose_value)
  )

  const slotsDone=values.length

  const average =
    slotsDone > 0
      ? (
          values.reduce((total, value) => total + value, 0) /
          slotsDone
        ).toFixed(1)
      : "--";

  const highest =
    slotsDone > 0 ? Math.max(...values) : "--";

  const lowest =
    slotsDone > 0 ? Math.min(...values) : "--";
  
  const stats = [
    {
      label: "Today's Readings",
      value: `${slotsDone}/4`,
      unit: "Out of 4 slots",
      icon: <FaCalendarCheck />,
    },
    {
      label: "Today's Average",
      value: average,
      unit: "mg/dL",
      icon: <FaTint />,
    },
    {
      label: "Highest Reading",
      value: highest,
      unit: "mg/dL",
      icon: <FaArrowUp className="icon-tilt" />,
    },
    {
      label: "Lowest Reading",
      value: lowest,
      unit: "mg/dL",
      icon: <FaArrowDown />,
    },
  ];
  return (
    <Sidebar>
      <h1 className="dash-title">
        Welcome back {name}
        <span aria-hidden="true">👋</span>
      </h1>
      <p className="dash-subtitle">
        Track your glucose levels and stay healthy.
      </p>
      <div className="stat-grid">
        {stats.map((each) => (
          <div className="stat-card" key={each.label}>
            <span className="stat-icon">{each.icon}</span>
            <div>
               <p className="stat-label">{each.label}</p>
               <p className="stat-value">{each.value}</p>
               <p className="stat-unit">{each.unit}</p>
              </div>
          </div>
        ))}
      </div>
    
  

    </Sidebar>
  );
};

export default Dashboard;
