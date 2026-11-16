
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Report.css";

import {
    FaChartBar,
    FaCalendarAlt,
    FaTint,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

import axios from "axios";

const API_URL = "http://localhost:7864/api/reports";

const TABS = [
    { id: "daily", label: "Daily Report" },
    { id: "monthly", label: "Monthly Report" },
    { id: "previous", label: "Previous Month" },
];

const Report = () => {
    const [activeTab, setActiveTab] = useState("daily");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}`;
    });

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");
            setReport(null);

            let response;

            if (activeTab === "daily") {
                response = await axios.get(`${API_URL}/daily`, {
                    params: { date: selectedDate },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (activeTab === "monthly") {
                const [year, month] = selectedMonth.split("-");

                response = await axios.get(`${API_URL}/monthly`, {
                    params: {
                        month: Number(month),
                        year: Number(year)
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                response = await axios.get(`${API_URL}/previous`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            setReport(response.data.report);

        } catch (err) {
            console.log("Report error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to fetch report"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab, selectedDate, selectedMonth]);

    const stats = report?.stats || {};

    const formatValue = (value) => {
        return value === null || value === undefined ? "—" : value;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        });
    };

    const getPreviousMonth = () => {
        const today = new Date();

        return new Date(
            today.getFullYear(),
            today.getMonth() - 1
        ).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });
    };

    const getMonthLabel = () => {
        const [year, month] = selectedMonth.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });
    };

    const getBarHeight = (value) => {
        const readings = report?.weeklyBreakdown || [];

        const maxValue = Math.max(
            ...readings.map(item => Number(item.average) || 0),
            1
        );

        return `${Math.max(
            (Number(value) / maxValue) * 100,
            5
        )}%`;
    };

    return (
        <Sidebar>
            <div className="rep-page">

                <div className="rep-header">
                    <span className="rep-header-icon">
                        <FaChartBar />
                    </span>

                    <div>
                        <h1 className="rep-title">Reports</h1>
                        <p className="rep-subtitle">
                            View your glucose reading reports
                        </p>
                    </div>
                </div>

                

                <div
                    className="rep-tabs"
                    role="tablist"
                    aria-label="Report type"
                >
                    {TABS.map((each) => (
                        <button
                            key={each.id}
                            type="button"
                            className={
                                activeTab === each.id ? "active" : ""
                            }
                            onClick={() => setActiveTab(each.id)}
                        >
                            <FaCalendarAlt />
                            {each.label}
                        </button>
                    ))}
                </div>

                

                <div className="rep-filter">
                    {activeTab === "daily" && (
                        <>
                            <label>Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                max={new Date().toLocaleDateString("en-CA")}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                            />
                        </>
                    )}

                    {activeTab === "monthly" && (
                        <>
                            <label>Select Month</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                            />
                        </>
                    )}

                    {activeTab === "previous" && (
                        <h3>{getPreviousMonth()}</h3>
                    )}
                </div>

               

                {loading && (
                    <div className="rep-message">
                        Loading report...
                    </div>
                )}

              

                {!loading && error && (
                    <div className="rep-error">
                        {error}
                    </div>
                )}

              

                {!loading && !error && report && (
                    <>
                       

                        <div className="rep-stats">

                            <div className="rep-stat-card">
                                <div className="rep-stat-icon purple">
                                    <FaChartBar />
                                </div>
                                <p>Total Readings</p>
                                <h2>{formatValue(stats.total_readings)}</h2>
                            </div>

                            <div className="rep-stat-card">
                                <div className="rep-stat-icon blue">
                                    <FaTint />
                                </div>
                                <p>Average Glucose</p>
                                <h2>{formatValue(stats.average)}</h2>
                                <small>mg/dL</small>
                            </div>

                            <div className="rep-stat-card">
                                <div className="rep-stat-icon red">
                                    <FaArrowUp />
                                </div>
                                <p>Highest Reading</p>
                                <h2>{formatValue(stats.highest)}</h2>
                                <small>mg/dL</small>
                            </div>

                            <div className="rep-stat-card">
                                <div className="rep-stat-icon green">
                                    <FaArrowDown />
                                </div>
                                <p>Lowest Reading</p>
                                <h2>{formatValue(stats.lowest)}</h2>
                                <small>mg/dL</small>
                            </div>

                        </div>

                       

                        {activeTab === "daily" && (
                            <div className="rep-section">

                                <h2>Daily Readings</h2>

                                <p className="rep-section-subtitle">
                                    Readings for {formatDate(selectedDate)}
                                </p>

                                {report.readings?.length > 0 ? (
                                    <div className="rep-table-wrapper">
                                        <table className="rep-table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time Slot</th>
                                                    <th>Glucose Value</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {report.readings.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {formatDate(item.reading_date)}
                                                        </td>
                                                        <td>{item.time_slot}</td>
                                                        <td>
                                                            <strong>
                                                                {item.glucose_value} mg/dL
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="rep-empty">
                                        No readings found for this date.
                                    </p>
                                )}

                            </div>
                        )}

                      

                        {(activeTab === "monthly" ||
                            activeTab === "previous") && (
                            <div className="rep-section">

                                <h2>Weekly Breakdown</h2>

                                <p className="rep-section-subtitle">
                                    {activeTab === "monthly"
                                        ? getMonthLabel()
                                        : getPreviousMonth()}
                                </p>

                                {report.weeklyBreakdown?.length > 0 ? (
                                    <>
                                        <div className="rep-chart">
                                            {report.weeklyBreakdown.map(
                                                (week, index) => (
                                                    <div
                                                        className="rep-chart-item"
                                                        key={index}
                                                    >
                                                        <div className="rep-bar-area">
                                                            <div
                                                                className="rep-bar"
                                                                style={{
                                                                    height: getBarHeight(
                                                                        week.average
                                                                    )
                                                                }}
                                                            />
                                                        </div>

                                                        <strong>
                                                            {formatValue(week.average)}
                                                        </strong>

                                                        <span>
                                                            Week {week.week}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="rep-table-wrapper">
                                            <table className="rep-table">
                                                <thead>
                                                    <tr>
                                                        <th>Week</th>
                                                        <th>Total Readings</th>
                                                        <th>Average</th>
                                                        <th>Highest</th>
                                                        <th>Lowest</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {report.weeklyBreakdown.map(
                                                        (week, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    Week {week.week}
                                                                </td>
                                                                <td>
                                                                    {week.total_readings}
                                                                </td>
                                                                <td>
                                                                    {formatValue(week.average)}
                                                                </td>
                                                                <td>
                                                                    {formatValue(week.highest)}
                                                                </td>
                                                                <td>
                                                                    {formatValue(week.lowest)}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <p className="rep-empty">
                                        No readings found for this month.
                                    </p>
                                )}

                            </div>
                        )}

                    </>
                )}

            </div>
        </Sidebar>
    );
};

export default Report;
