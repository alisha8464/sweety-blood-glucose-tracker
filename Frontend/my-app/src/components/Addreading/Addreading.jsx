import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaTint, FaSave } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import "./Addreading.css";

const TIME_SLOTS = [
  "Morning fasting",
  "After breakfast",
  "After lunch",
  "After dinner",
];

const today = () => new Date().toLocaleDateString("en-CA");
const Addreading = () => {
  const [form, setForm] = useState({
    date: today(),
    timeSlot: "",
    glucoseValue: "",
  });
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:7864/api/readings/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      setSuccess(response.data.message || "Addded Succesfully");
      setForm({
        date: today(),
        timeSlot: "",
        glucoseValue: "",
      });
    } catch (error) {
      console.log(error.message);
      setErr(error.response?.data?.message || "Please Try Again!");
    }
  }
  return (
    <Sidebar>
      <h1 className="page-title">Add Glucose Reading</h1>
      <p className="page-subtitle">
        Enter your latest blood glucose measurement.
      </p>
      <div className="add-reading-grid">
        <form className="reading-card" onSubmit={handleSubmit}>
          <div className="field">
            <span className="field-icon">
              <FaCalendarAlt />
            </span>
            <div className="field-body">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                className="field-input"
                id="date"
                name="date"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="field">
            <span className="field-icon">
              <FaClock />
            </span>
            <div className="field-body">
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                className="field-input"
                id="timeSlot"
                name="timeSlot"
                onChange={handleChange}
                required
              >
                <option value="">Select time slot</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <span className="field-icon">
              <FaTint />
            </span>
            <div className="field-body">
              <label htmlFor="glucoseValue">Glucose Value (mg/dL)</label>
              <input
                type="number"
                placeholder="Enter value (40-600)"
                min={40}
                max={600}
                step={1}
                required
                className="field-input"
                name="glucoseValue"
                id="glucoseValue"
                value={form.glucoseValue}
                onChange={handleChange}
              />
            </div>
          </div>
          {err && <p className="form-error">{err}</p>}
          {success && <p className="form-success">{success}</p>}
          <button type="submit" className="save-btn">
            <FaSave />
            Save Reading
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default Addreading;
