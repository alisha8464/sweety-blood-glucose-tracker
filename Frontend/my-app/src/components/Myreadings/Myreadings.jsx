import React, { useEffect, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";
import "./Myreadings.css";
import axios from "axios";

const Myreadings = () => {
  const [allReadings, setAllreadings] = useState([]);
  const [editReading, setEditReading] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  
  async function getAllReadings() {
    try {
      const response = await axios.get("http://localhost:7864/api/all/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAllreadings(response.data.readings || []);
        
      }
    } catch (error) {
      console.log("Fetch error:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    getAllReadings();
  }, []);

 
  function handleEdit(each) {
    setEditReading({
      id: each.id,
      date: new Date(each.reading_date).toLocaleDateString("en-CA"),
      timeSlot: each.time_slot,
      glucoseValue: each.glucose_value,
    });
  }

  
  function handleChange(event) {
    const { name, value } = event.target;

    setEditReading((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

 
  async function handleUpdate(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:7864/api/all/edit/${editReading.id}`,
        {
          date: editReading.date,
          timeSlot: editReading.timeSlot,
          glucoseValue: Number(editReading.glucoseValue),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        alert("Reading updated successfully");

        setEditReading(null);

        
        await getAllReadings();
      }
    } catch (error) {
      console.log("Update error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete=async(id)=>{
    try {
      const response=await axios.delete(`http://localhost:7864/api/delete/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      console.log(response.data)
      if(response.data.success){
        alert("Reading Deleted Successfully")
        getAllReadings()
      }
    } catch (error) {
      console.log("Delete error:", error);
        alert(error.response?.data?.message || "Unable to delete reading");
    }
  }

  return (
    <Sidebar>
      <h1 className="readings-title">My Readings</h1>

      <p className="readings-subtitle">
        View, edit and manage your glucose readings.
      </p>

      
      {editReading && (
        <div className="edit-reading-card">
          <h2>Edit Reading</h2>

          <form onSubmit={handleUpdate}>
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={editReading.date}
              max={new Date().toLocaleDateString("en-CA")}
              onChange={handleChange}
              required
            />

            <label>Time Slot</label>

            <select
              name="timeSlot"
              value={editReading.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="Morning fasting">Morning fasting</option>

              <option value="After breakfast">After breakfast</option>

              <option value="After lunch">After lunch</option>

              <option value="After dinner">After dinner</option>
            </select>

            <label>Glucose Value (mg/dL)</label>

            <input
              type="number"
              name="glucoseValue"
              min="40"
              max="600"
              step="1"
              value={editReading.glucoseValue}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setEditReading(null)}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Readings Table */}
      <div className="readings-card">
        <div className="readings-table-wrap">
          <table className="readings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>

                <th className="col-center">Glucose Value (mg/dL)</th>

                <th className="col-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allReadings.length > 0 ? (
                allReadings.map((each) => (
                  <tr key={each.id}>
                    <td>
                      {new Date(each.reading_date).toLocaleDateString("en-IN")}
                    </td>

                    <td>{each.time_slot}</td>

                    <td className="col-center">{each.glucose_value}</td>

                    <td className="col-center">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => handleEdit(each)}
                          title="Edit reading"
                        >
                          <FaPen />
                        </button>

                        <button
                          type="button"
                          className="icon-btn delete-btn"
                          title="Delete reading" onClick={() => handleDelete(each.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="col-center">
                    No readings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default Myreadings;
